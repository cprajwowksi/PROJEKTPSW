FROM node:alpine
WORKDIR /app
COPY *.json ./
RUN npm install
COPY ./index.js .
CMD ["node", "index.js"]
