"""测试服务器启动"""
import subprocess
import time
import sys
import os

# 切换到脚本所在目录
os.chdir(os.path.dirname(os.path.abspath(__file__)))

port = 5001
if len(sys.argv) > 1:
    port = int(sys.argv[1])

print(f"正在启动服务器，端口: {port}")
print(f"访问地址: http://localhost:{port}")
print("按 Ctrl+C 停止服务器\n")

# 直接运行app.py
os.system(f'python app.py {port}')

