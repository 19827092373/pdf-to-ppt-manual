# PDF习题拆分PPT工具

一个帮助物理老师将PDF格式的习题册转换为PPT的工具，每页PPT包含一道题目，方便在多媒体大屏上进行讲解。

[![GitHub](https://img.shields.io/github/license/your-username/pdf-to-ppt-manual)](LICENSE)
[![Python](https://img.shields.io/badge/python-3.7+-blue.svg)](https://www.python.org/)
[![Flask](https://img.shields.io/badge/flask-3.0.0-green.svg)](https://flask.palletsprojects.com/)

## 功能特点

- 📄 PDF文件上传和预览
- 🖼️ PDF页面转图片显示
- 📦 手动矩形框选择题目区域
- 🔧 矩形框拖拽和缩放调整
- 📊 自动生成PPT（每页一题）
- 📐 智能图片布局（左上角，不超过页面一半）

## 安装说明

### 1. 安装Python依赖

```bash
pip install -r requirements.txt
```

### 2. 安装系统依赖

#### Windows系统
下载并安装poppler:
- 访问 https://github.com/oschwartz10612/poppler-windows/releases/
- 下载最新版本
- 解压后将bin目录添加到系统PATH环境变量

#### Linux系统
```bash
sudo apt-get install poppler-utils
```

#### macOS系统
```bash
brew install poppler
```

## 使用方法

1. 启动应用：
```bash
python app.py
```

2. 打开浏览器访问：`http://localhost:5001`

**端口占用问题**：如果5001端口被占用，可以：
- 运行 `run_port.bat` 自定义端口
- 或使用命令：`python app.py 5002`（替换为其他可用端口）

3. 上传PDF文件，按照界面提示操作：
   - 选择PDF文件并上传
   - 在左侧查看所有页面缩略图
   - 点击页面查看大图
   - 在大图上绘制矩形框选择题目
   - 调整矩形框位置和大小
   - 处理完所有页面后，点击"生成PPT"按钮
   - 下载生成的PPT文件

## 项目结构

```
pdf-to-ppt-manual/
├── app.py                 # Flask主应用
├── requirements.txt       # Python依赖
├── README.md             # 项目说明
├── PROJECT_PLAN.md       # 详细项目计划
├── static/
│   ├── css/
│   │   └── style.css     # 样式文件
│   └── js/
│       └── main.js       # 前端逻辑
├── templates/
│   └── index.html        # 主页面
├── uploads/              # 上传文件目录
├── temp/                 # 临时文件目录
└── output/               # 输出PPT目录
```

## 技术栈

- **后端**: Python Flask
- **前端**: HTML5 + CSS3 + JavaScript (原生)
- **PDF处理**: pdf2image
- **图片处理**: Pillow
- **PPT生成**: python-pptx

## 注意事项

- 当前版本需要手动选择每道题目（使用矩形框）
- 建议每页题目数量不要过多，便于手动选择
- 生成的PPT文件会保存在output目录中

## 许可证

MIT License

