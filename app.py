"""
PDF习题拆分PPT工具 - Flask主应用
"""
import os
import uuid
from flask import Flask, render_template, request, jsonify, send_file
from werkzeug.utils import secure_filename
from utils.pdf_handler import PDFHandler
from utils.image_cropper import ImageCropper
from utils.ppt_generator import PPTGenerator

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  # 50MB max file size
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['TEMP_FOLDER'] = 'temp'
app.config['OUTPUT_FOLDER'] = 'output'

# 确保必要的目录存在
for folder in [app.config['UPLOAD_FOLDER'], app.config['TEMP_FOLDER'], app.config['OUTPUT_FOLDER']]:
    os.makedirs(folder, exist_ok=True)

# 允许的文件扩展名
ALLOWED_EXTENSIONS = {'pdf'}

def allowed_file(filename):
    """检查文件扩展名是否允许"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    """主页面"""
    return render_template('index.html')

@app.route('/api/upload', methods=['POST'])
def upload_pdf():
    """上传PDF文件"""
    if 'file' not in request.files:
        return jsonify({'error': '没有上传文件'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': '文件名为空'}), 400
    
    if not allowed_file(file.filename):
        return jsonify({'error': '只支持PDF文件'}), 400
    
    # 生成唯一文件名
    file_id = str(uuid.uuid4())
    filename = secure_filename(file.filename)
    filepath = os.path.join(app.config['UPLOAD_FOLDER'], f"{file_id}_{filename}")
    file.save(filepath)
    
    try:
        # 验证文件大小
        file_size = os.path.getsize(filepath)
        if file_size == 0:
            return jsonify({'error': 'PDF文件为空'}), 400
        if file_size > 50 * 1024 * 1024:
            return jsonify({'error': 'PDF文件过大（超过50MB）'}), 400
        
        # 将PDF转换为图片
        pdf_handler = PDFHandler()
        images_info = pdf_handler.pdf_to_images(filepath, file_id, app.config['TEMP_FOLDER'])
        
        if not images_info or len(images_info) == 0:
            return jsonify({'error': 'PDF处理失败：没有成功转换任何页面'}), 500
        
        return jsonify({
            'success': True,
            'file_id': file_id,
            'filename': filename,
            'pages': images_info
        })
    except Exception as e:
        # 记录详细错误信息（用于调试）
        import traceback
        error_detail = traceback.format_exc()
        print(f"PDF处理错误: {error_detail}")
        
        # 返回用户友好的错误信息
        error_msg = str(e)
        return jsonify({'error': f'处理PDF时出错: {error_msg}'}), 500

@app.route('/api/image/<file_id>/<int:page>')
def get_image(file_id, page):
    """获取PDF页面图片"""
    image_path = os.path.join(app.config['TEMP_FOLDER'], f"{file_id}_page_{page}.png")
    if os.path.exists(image_path):
        return send_file(image_path, mimetype='image/png')
    return jsonify({'error': '图片不存在'}), 404

@app.route('/api/generate-ppt', methods=['POST'])
def generate_ppt():
    """生成PPT文件"""
    data = request.json
    file_id = data.get('file_id')
    selections = data.get('selections', {})  # {page_num: [{'x': x, 'y': y, 'width': w, 'height': h, 'id': id}, ...]}
    merged_selections = data.get('merged_selections', [])  # [{id: id, items: [{pageNum, rectId}, ...]}, ...]
    custom_order = data.get('custom_order', [])  # [{type: 'single'|'merged', pageNum?, rectId?, mergedId?}, ...]
    
    if not file_id:
        return jsonify({'error': '缺少file_id'}), 400
    
    try:
        # 裁剪图片
        cropper = ImageCropper()
        ppt_generator = PPTGenerator()
        
        # 处理合并的题目
        merged_images = []
        for merged in merged_selections:
            merged_cropped_images = []
            for item in merged['items']:
                page_num = item['pageNum']
                rect_id = item['rectId']
                
                # 找到对应的矩形框
                if str(page_num) not in selections:
                    continue
                
                rect = None
                for box in selections[str(page_num)]:
                    if box.get('id') == rect_id:
                        rect = box
                        break
                
                if not rect:
                    continue
                
                image_path = os.path.join(app.config['TEMP_FOLDER'], f"{file_id}_page_{page_num}.png")
                if not os.path.exists(image_path):
                    continue
                
                cropped_path = os.path.join(
                    app.config['TEMP_FOLDER'], 
                    f"{file_id}_merged_{merged['id']}_page_{page_num}_rect_{rect_id}.png"
                )
                cropper.crop_image(image_path, rect, cropped_path)
                merged_cropped_images.append(cropped_path)
            
            if merged_cropped_images:
                # 拼接图片
                merged_path = os.path.join(
                    app.config['TEMP_FOLDER'],
                    f"{file_id}_merged_{merged['id']}.png"
                )
                ppt_generator.merge_images(merged_cropped_images, merged_path)
                merged_images.append(merged_path)
        
        # 处理单个题目（不在合并组中的）
        single_images = []
        used_rects = set()
        
        # 收集所有已合并的矩形框
        for merged in merged_selections:
            for item in merged['items']:
                used_rects.add((item['pageNum'], item['rectId']))
        
        # 处理未合并的题目
        for page_num_str, boxes in selections.items():
            page_num = int(page_num_str)
            image_path = os.path.join(app.config['TEMP_FOLDER'], f"{file_id}_page_{page_num}.png")
            
            if not os.path.exists(image_path):
                continue
            
            for idx, box in enumerate(boxes):
                rect_id = box.get('id')
                if (page_num, rect_id) in used_rects:
                    continue  # 跳过已合并的
                
                cropped_path = os.path.join(
                    app.config['TEMP_FOLDER'], 
                    f"{file_id}_page_{page_num}_crop_{idx}.png"
                )
                cropper.crop_image(image_path, box, cropped_path)
                single_images.append(cropped_path)
        
        # 创建图片路径映射
        image_map = {}
        
        # 映射合并图片
        for merged_path in merged_images:
            merged_id = int(merged_path.split('_merged_')[1].split('.')[0])
            image_map[('merged', merged_id)] = merged_path
        
        # 映射单个图片
        for page_num_str, boxes in selections.items():
            page_num = int(page_num_str)
            for idx, box in enumerate(boxes):
                rect_id = box.get('id')
                if (page_num, rect_id) not in used_rects:
                    cropped_path = os.path.join(
                        app.config['TEMP_FOLDER'],
                        f"{file_id}_page_{page_num}_crop_{idx}.png"
                    )
                    if os.path.exists(cropped_path):
                        image_map[('single', page_num, rect_id)] = cropped_path
        
        # 按照自定义顺序排列图片
        all_images = []
        
        if custom_order:
            # 使用自定义顺序
            for order_item in custom_order:
                if order_item.get('type') == 'merged':
                    merged_id = order_item.get('mergedId')
                    img_path = image_map.get(('merged', merged_id))
                    if img_path and os.path.exists(img_path):
                        all_images.append(img_path)
                else:  # single
                    page_num = order_item.get('pageNum')
                    rect_id = order_item.get('rectId')
                    img_path = image_map.get(('single', page_num, rect_id))
                    if img_path and os.path.exists(img_path):
                        all_images.append(img_path)
        else:
            # 如果没有自定义顺序，使用默认顺序（先合并的，后单个的）
            all_images = merged_images + single_images
        
        if not all_images:
            return jsonify({'error': '没有选择任何题目'}), 400
        
        # 生成PPT
        output_filename = f"{file_id}_questions.pptx"
        output_path = os.path.join(app.config['OUTPUT_FOLDER'], output_filename)
        ppt_generator.create_ppt(all_images, output_path)
        
        return jsonify({
            'success': True,
            'filename': output_filename,
            'download_url': f'/api/download/{output_filename}'
        })
    except Exception as e:
        return jsonify({'error': f'生成PPT时出错: {str(e)}'}), 500

@app.route('/api/download/<filename>')
def download_ppt(filename):
    """下载PPT文件"""
    filepath = os.path.join(app.config['OUTPUT_FOLDER'], filename)
    if os.path.exists(filepath):
        return send_file(filepath, as_attachment=True, download_name=filename)
    return jsonify({'error': '文件不存在'}), 404

if __name__ == '__main__':
    import sys
    import os
    # 支持Render等云平台部署（使用环境变量PORT）
    port = int(os.environ.get('PORT', 5001))
    
    # 命令行参数优先级更高
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"无效的端口号: {sys.argv[1]}，使用默认端口{port}")
    
    # 判断是否为生产环境
    is_production = os.environ.get('RENDER') or os.environ.get('RAILWAY_ENVIRONMENT')
    debug_mode = not is_production
    
    print(f"正在启动服务器...")
    print(f"访问地址: http://localhost:{port}")
    if not is_production:
        print(f"按 Ctrl+C 停止服务器")
    app.run(debug=debug_mode, host='0.0.0.0', port=port)

