## 初始化验证环境
chmod +x script.sh
./script.sh
## 服务器启动
npm init -y
npm install express multer snarkjs
node server.js

## 上传文件并验证
curl -F "proof=@proof.json" -F "public=@public.json" http://localhost:3000/verify