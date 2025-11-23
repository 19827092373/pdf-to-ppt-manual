# Poppler安装说明

## 问题说明

如果遇到"PDF转图片失败"的错误，通常是因为缺少poppler工具。

## 解决方案

### 方案1：安装Poppler（推荐，与pdf2image配合使用）

#### Windows系统

1. **下载Poppler**
   - 访问：https://github.com/oschwartz10612/poppler-windows/releases/
   - 下载最新版本的zip文件（例如：`Release-23.11.0-0.zip`）

2. **解压文件**
   - 解压到任意目录，例如：`C:\poppler`
   - 解压后的目录结构应该是：`C:\poppler\poppler-xx.xx.x\Library\bin`

3. **添加到PATH环境变量**
   - 右键"此电脑" → 属性 → 高级系统设置
   - 点击"环境变量"
   - 在"系统变量"中找到`Path`，点击"编辑"
   - 点击"新建"，添加poppler的bin目录路径：
     ```
     C:\poppler\poppler-xx.xx.x\Library\bin
     ```
     （替换为你的实际路径）
   - 点击"确定"保存

4. **验证安装**
   - 打开新的命令行窗口（重要：必须重新打开）
   - 运行：`pdftoppm -h`
   - 如果显示帮助信息，说明安装成功

5. **重启应用**
   - 关闭所有命令行窗口
   - 重新启动应用

#### Linux系统
```bash
sudo apt-get update
sudo apt-get install poppler-utils
```

#### macOS系统
```bash
brew install poppler
```

### 方案2：使用PyMuPDF（无需poppler）

如果不想安装poppler，可以使用PyMuPDF作为替代方案：

1. **安装PyMuPDF**
   ```bash
   pip install PyMuPDF
   ```

2. **重启应用**
   - PyMuPDF会自动被检测并使用
   - 无需配置，开箱即用

## 验证安装

安装完成后，重新启动应用，上传一个PDF文件测试。如果成功显示PDF页面，说明安装成功。

## 常见问题

### Q: 添加到PATH后仍然提示找不到poppler？
A: 
1. 确保添加的是bin目录（包含pdftoppm.exe的目录）
2. 关闭所有命令行窗口，重新打开
3. 重启电脑（有时需要）

### Q: 不想安装poppler怎么办？
A: 使用方案2，安装PyMuPDF即可，无需poppler。

### Q: 两个方案哪个更好？
A: 
- pdf2image + poppler: 功能更全面，但需要额外安装工具
- PyMuPDF: 无需额外工具，安装简单，推荐新手使用

