#!/bin/bash
# PDF习题拆分PPT工具 - 一键部署脚本
# 适用于Ubuntu 20.04+系统

set -e

echo "=========================================="
echo "PDF习题拆分PPT工具 - 服务器部署脚本"
echo "=========================================="
echo ""

# 检查是否为root用户
if [ "$EUID" -ne 0 ]; then 
    echo "请使用root用户运行此脚本"
    exit 1
fi

# 获取项目路径
PROJECT_DIR="/opt/pdf-to-ppt-manual"
if [ ! -d "$PROJECT_DIR" ]; then
    echo "错误：项目目录不存在：$PROJECT_DIR"
    echo "请先将项目文件上传到服务器"
    exit 1
fi

cd "$PROJECT_DIR"

# 1. 更新系统
echo "[1/8] 更新系统..."
apt update && apt upgrade -y

# 2. 安装基础工具
echo "[2/8] 安装基础工具..."
apt install -y git curl wget vim python3 python3-pip python3-venv nginx ufw poppler-utils

# 3. 创建虚拟环境并安装依赖
echo "[3/8] 安装Python依赖..."
if [ ! -d "venv" ]; then
    python3 -m venv venv
fi
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
pip install PyMuPDF gunicorn

# 4. 创建必要的目录
echo "[4/8] 创建目录..."
mkdir -p uploads temp output
chmod 755 uploads temp output
chown -R www-data:www-data uploads temp output

# 5. 配置systemd服务
echo "[5/8] 配置systemd服务..."
cat > /etc/systemd/system/pdf-to-ppt.service <<EOF
[Unit]
Description=PDF习题拆分PPT工具
After=network.target

[Service]
Type=simple
User=www-data
Group=www-data
WorkingDirectory=$PROJECT_DIR
Environment="PATH=$PROJECT_DIR/venv/bin:/usr/bin:/usr/local/bin"
ExecStart=$PROJECT_DIR/venv/bin/gunicorn -w 4 -b 127.0.0.1:5000 --timeout 120 --access-logfile $PROJECT_DIR/logs/access.log --error-logfile $PROJECT_DIR/logs/error.log app:app
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# 创建日志目录
mkdir -p logs
chown www-data:www-data logs

# 启动服务
systemctl daemon-reload
systemctl enable pdf-to-ppt
systemctl start pdf-to-ppt

# 6. 配置Nginx
echo "[6/8] 配置Nginx..."
read -p "请输入域名（直接回车使用IP访问）: " DOMAIN

if [ -z "$DOMAIN" ]; then
    DOMAIN="_"
fi

cat > /etc/nginx/sites-available/pdf-to-ppt <<EOF
server {
    listen 80;
    server_name $DOMAIN;

    # 日志
    access_log /var/log/nginx/pdf-to-ppt-access.log;
    error_log /var/log/nginx/pdf-to-ppt-error.log;

    # 上传文件大小限制（50MB）
    client_max_body_size 50M;

    # 静态文件
    location /static {
        alias $PROJECT_DIR/static;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    # 代理到Flask应用
    location / {
        proxy_pass http://127.0.0.1:5000;
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# 启用配置
ln -sf /etc/nginx/sites-available/pdf-to-ppt /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# 测试Nginx配置
nginx -t

# 重启Nginx
systemctl restart nginx

# 7. 配置防火墙
echo "[7/8] 配置防火墙..."
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

# 8. 获取服务器IP
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip)

echo ""
echo "=========================================="
echo "部署完成！"
echo "=========================================="
echo ""
echo "服务状态："
systemctl status pdf-to-ppt --no-pager | head -5
echo ""
echo "访问地址："
if [ "$DOMAIN" != "_" ]; then
    echo "  http://$DOMAIN"
else
    echo "  http://$SERVER_IP"
fi
echo ""
echo "下一步："
echo "1. 如果使用域名，请配置DNS解析指向：$SERVER_IP"
echo "2. 配置SSL证书：certbot --nginx -d $DOMAIN"
echo "3. 查看日志：journalctl -u pdf-to-ppt -f"
echo ""
echo "=========================================="

