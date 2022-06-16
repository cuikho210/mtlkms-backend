FROM node:16-alpine
WORKDIR /app
COPY . .
ENV TZ="Asia/Ho_Chi_Minh"
RUN rm /app/docker-compose.yml
RUN npm install
CMD ["npm", "run", "dev"]