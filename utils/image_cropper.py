"""
图片裁剪模块 - 根据边界框裁剪图片
"""
from PIL import Image


class ImageCropper:
    """图片裁剪器"""
    
    def __init__(self):
        pass
    
    def crop_image(self, image_path, bbox, output_path):
        """
        根据边界框裁剪图片
        
        Args:
            image_path: 原始图片路径
            bbox: 边界框字典 {'x': x, 'y': y, 'width': w, 'height': h}
            output_path: 输出图片路径
        """
        try:
            # 打开图片
            img = Image.open(image_path)
            img_width, img_height = img.size
            
            # 获取边界框坐标
            x = max(0, int(bbox['x']))
            y = max(0, int(bbox['y']))
            width = min(int(bbox['width']), img_width - x)
            height = min(int(bbox['height']), img_height - y)
            
            # 确保坐标有效
            if width <= 0 or height <= 0:
                raise ValueError("无效的边界框尺寸")
            
            # 裁剪图片
            cropped = img.crop((x, y, x + width, y + height))
            
            # 保存裁剪后的图片
            cropped.save(output_path, 'PNG')
        except Exception as e:
            raise Exception(f"图片裁剪失败: {str(e)}")

