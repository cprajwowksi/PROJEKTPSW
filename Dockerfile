FROM node:alpine
WORKDIR /app
COPY *.json .
RUN npm install
COPY ./src ./src
COPY ./public ./public
CMD ["npm", "run", "start"]