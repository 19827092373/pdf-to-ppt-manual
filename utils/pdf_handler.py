"""
PDF处理模块 - 将PDF转换为图片
"""
import os
import sys


class PDFHandler:
    """PDF处理器"""
    
    def __init__(self):
        self.use_pymupdf = False
        self._check_dependencies()
    
    def _check_dependencies(self):
        """检查可用的PDF处理库"""
        # 首先检查PyMuPDF是否可用（优先使用，无需poppler）
        try:
            import fitz  # PyMuPDF
            self.use_pymupdf = True
            self.fitz = fitz
            return
        except ImportError:
            pass
        
        # 如果PyMuPDF不可用，尝试使用pdf2image（需要poppler）
        try:
            from pdf2image import convert_from_path
            self.convert_from_path = convert_from_path
            self.use_pymupdf = False
            return
        except ImportError:
            pass
        
        # 如果都不可用，给出明确的错误提示
        raise ImportError(
            "PDF处理失败：缺少必要的库。\n"
            "请运行以下命令安装PyMuPDF（推荐，无需poppler）：\n"
            "  pip install PyMuPDF\n"
            "或者安装poppler工具：\n"
            "  - Windows: 下载 https://github.com/oschwartz10612/poppler-windows/releases/\n"
            "  - 解压后将bin目录添加到系统PATH"
        )
    
    def _convert_with_pdf2image(self, pdf_path, file_id, temp_folder):
        """使用pdf2image转换PDF"""
        from pdf2image import convert_from_path
        
        try:
            # 尝试自动检测poppler路径
            poppler_path = self._find_poppler_path()
            if poppler_path:
                images = convert_from_path(pdf_path, dpi=200, poppler_path=poppler_path)
            else:
                images = convert_from_path(pdf_path, dpi=200)
        except Exception as e:
            error_msg = str(e).lower()
            if 'poppler' in error_msg or 'pdftoppm' in error_msg:
                raise Exception(
                    "PDF转图片失败：未找到poppler工具。\n"
                    "请安装poppler：\n"
                    "1. 访问 https://github.com/oschwartz10612/poppler-windows/releases/\n"
                    "2. 下载最新版本并解压\n"
                    "3. 将解压后的bin目录添加到系统PATH环境变量\n"
                    "4. 重启命令行窗口和应用\n\n"
                    "或者安装PyMuPDF作为替代方案：pip install PyMuPDF"
                )
            raise Exception(f"PDF转图片失败: {str(e)}")
        
        return images
    
    def _convert_with_pymupdf(self, pdf_path, file_id, temp_folder):
        """使用PyMuPDF转换PDF（支持图片型PDF）"""
        from PIL import Image
        import io
        
        try:
            pdf_document = self.fitz.open(pdf_path)
        except Exception as e:
            raise Exception(f"无法打开PDF文件: {str(e)}。请确保PDF文件未损坏。")
        
        images = []
        
        try:
            page_count = len(pdf_document)
            if page_count == 0:
                raise Exception("PDF文件没有页面")
            
            for page_num in range(page_count):
                try:
                    page = pdf_document[page_num]
                    
                    # 使用200 DPI渲染（图片型PDF也能正常处理）
                    zoom = 200 / 72.0
                    mat = self.fitz.Matrix(zoom, zoom)
                    
                    # 对于图片型PDF，使用get_pixmap可以正常渲染
                    pix = page.get_pixmap(matrix=mat, alpha=False)
                    
                    # 检查是否成功获取图片
                    if pix is None or pix.width == 0 or pix.height == 0:
                        raise Exception(f"第{page_num + 1}页无法渲染（可能为空页面）")
                    
                    # 转换为PIL Image
                    img_data = pix.tobytes("png")
                    img = Image.open(io.BytesIO(img_data))
                    
                    # 验证图片是否有效
                    if img.size[0] == 0 or img.size[1] == 0:
                        raise Exception(f"第{page_num + 1}页图片尺寸无效")
                    
                    images.append(img)
                    
                except Exception as e:
                    # 如果某一页失败，记录错误但继续处理其他页
                    error_msg = f"处理第{page_num + 1}页时出错: {str(e)}"
                    print(f"警告: {error_msg}")
                    # 如果所有页都失败，抛出异常
                    if page_num == 0 and len(images) == 0:
                        raise Exception(f"PDF处理失败: {error_msg}")
                    # 否则跳过这一页，继续处理
                    continue
                    
        finally:
            pdf_document.close()
        
        if len(images) == 0:
            raise Exception("PDF处理失败：没有成功转换任何页面。请检查PDF文件是否损坏或格式不正确。")
        
        return images
    
    def _find_poppler_path(self):
        """尝试查找poppler安装路径"""
        import subprocess
        
        # 首先检查是否在PATH中
        try:
            result = subprocess.run(['pdftoppm', '-h'], 
                                  capture_output=True, 
                                  timeout=2)
            if result.returncode == 0 or result.returncode == 1:  # 帮助信息或错误都说明找到了
                return None  # 在PATH中，不需要指定路径
        except (FileNotFoundError, subprocess.TimeoutExpired):
            pass
        
        # 检查常见安装位置
        possible_paths = [
            r"C:\poppler\Library\bin",
            r"C:\poppler\bin",
            r"C:\Program Files\poppler\bin",
            r"C:\Program Files (x86)\poppler\bin",
            r"C:\tools\poppler\bin",
            os.path.join(os.path.expanduser("~"), "poppler", "bin"),
            os.path.join(os.path.expanduser("~"), "AppData", "Local", "poppler", "bin"),
            # Conda环境
            os.path.join(os.path.expanduser("~"), "anaconda3", "Library", "bin"),
            os.path.join(os.path.expanduser("~"), "miniconda3", "Library", "bin"),
            # MSYS2
            r"C:\msys64\mingw64\bin",
            r"C:\msys64\usr\bin",
        ]
        
        for path in possible_paths:
            if os.path.exists(path):
                pdftoppm_path = os.path.join(path, "pdftoppm.exe")
                if os.path.exists(pdftoppm_path):
                    return path
        
        # 尝试搜索整个C盘（较慢，但更全面）
        # 只在其他方法都失败时才使用
        return None
    
    def pdf_to_images(self, pdf_path, file_id, temp_folder='temp'):
        """
        将PDF转换为图片（支持图片型PDF/扫描件PDF）
        
        Args:
            pdf_path: PDF文件路径
            file_id: 文件ID（用于生成唯一文件名）
            temp_folder: 临时文件夹路径
        
        Returns:
            list: 图片信息列表，每个元素包含 {'page': 页码, 'path': 图片路径}
        """
        # 验证PDF文件是否存在
        if not os.path.exists(pdf_path):
            raise Exception(f"PDF文件不存在: {pdf_path}")
        
        # 验证PDF文件大小
        file_size = os.path.getsize(pdf_path)
        if file_size == 0:
            raise Exception("PDF文件为空")
        if file_size > 50 * 1024 * 1024:  # 50MB
            raise Exception("PDF文件过大（超过50MB）")
        
        try:
            # 确保临时文件夹存在
            os.makedirs(temp_folder, exist_ok=True)
            
            # 根据可用的库选择转换方法
            if self.use_pymupdf:
                images = self._convert_with_pymupdf(pdf_path, file_id, temp_folder)
            else:
                images = self._convert_with_pdf2image(pdf_path, file_id, temp_folder)
            
            if not images or len(images) == 0:
                raise Exception("PDF处理失败：没有成功转换任何页面")
            
            images_info = []
            for idx, image in enumerate(images, start=1):
                try:
                    # 保存图片
                    image_path = os.path.join(temp_folder, f"{file_id}_page_{idx}.png")
                    image.save(image_path, 'PNG', quality=95)
                    
                    # 验证图片文件是否成功保存
                    if not os.path.exists(image_path) or os.path.getsize(image_path) == 0:
                        raise Exception(f"第{idx}页图片保存失败")
                    
                    images_info.append({
                        'page': idx,
                        'path': f"/api/image/{file_id}/{idx}",
                        'width': image.width,
                        'height': image.height
                    })
                except Exception as e:
                    # 如果某页保存失败，记录错误但继续处理
                    print(f"警告: 保存第{idx}页时出错: {str(e)}")
                    if idx == 1:  # 如果第一页就失败，抛出异常
                        raise Exception(f"保存图片失败: {str(e)}")
                    # 否则跳过这一页
                    continue
            
            if len(images_info) == 0:
                raise Exception("PDF处理失败：没有成功保存任何页面图片")
            
            return images_info
            
        except Exception as e:
            # 提供更详细的错误信息
            error_msg = str(e)
            if "无法打开" in error_msg or "损坏" in error_msg:
                raise Exception(f"PDF文件可能已损坏或格式不正确: {error_msg}")
            elif "poppler" in error_msg.lower() or "pdftoppm" in error_msg.lower():
                raise Exception(f"PDF处理工具未找到: {error_msg}\n建议安装PyMuPDF: pip install PyMuPDF")
            else:
                raise Exception(f"PDF转图片失败: {error_msg}")

