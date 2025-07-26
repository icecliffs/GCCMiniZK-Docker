FROM node:alpine

WORKDIR /app
COPY ./ /app/
RUN npm init -y
RUN npm install express multer snarkjs cors

EXPOSE 11451
CMD ["node", "server.js"]