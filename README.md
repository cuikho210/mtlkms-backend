# MTLKMS - App học tập của nhà vịt :duck:
URL: https://mtlkms.github.io  
Author: *cuikho210*

## Kho lưu trữ
Backend: https://github.com/cuikho210/mtlkms-backend  
Frontend: https://github.com/cuikho210/mtlkms-frontend  
Build: https://github.com/mtlkms/mtlkms.github.io

## Dev
```bash
git clone https://github.com/cuikho210/mtlkms-backend
cd mtlkms-backend
npm install
mv docker-compose-demo.yml docker-compose.yml
```
Chỉnh sửa `docker-compose.yml` theo ý của bạn :smile:  
Sửa `nginx/host.conf` cho khớp với domain và SSL file của bạn  
Sửa volume tại `docker-compose.yml` cho khớp với SSL file và `nginx/host.conf`  

Sau khi đã cấu hình hoàn tất, chạy `docker-compose up`

Sử dụng sqlclient bất kì truy cập vào `mariadb` `localhost:3306` với mật khẩu bạn đã đặt trong `docker-compose.yml`.  
Tạo database có tên `mtlkms`  
Tạo lần lượt từng bảng bằng script trong `database.sql`

## Build
Build docker image với sudo để không gặp các vấn đề với phân quyền thư mục mysqldata:

```bash
sudo docker build -t yourname/mtlkms:tag .
```

Sử dụng docker buildx để build image cho server có kiến trúc khác:
```bash
sudo docker buildx build --platform linux/arm64/v8 -t yourname/mtlkms:arm64v8 .
```
Sau khi build xong, push lên docker hub:
```bash
docker push yourname/mtlkms:tag
```

## Triển khai phía server
Tạo một thư mục mới cùng `docker-compose.yml`
```bash
mkdir mtlkms
cd mtlkms
touch docker-compose.yml
```

```yml
# docker-compose.yml

version: '3'
services:
  mysql:
    image: mariadb:latest
    environment:
      TZ: UTC-7
      MYSQL_ROOT_PASSWORD: 'root_password'
      MYSQL_USER: 'user'
      MYSQL_PASSWORD: 'password'
      MYSQL_DATABASE: 'mtlkms'
    volumes:
      - ./mysqldata:/var/lib/mysql
    ports:
      - 3306:3306
  app:
    image: cuikho210/mtlkms:arm64v8 # Hoặc cuikho210/mtlkms:amd64
    environment:
      DB_HOST: "mysql"
      DB_USER: "user"
      DB_PASSWORD: "password"
      SALT: "any_string"
      EMAIL_PASSWORD: ""
      CLIENT_URL: "https://yourclienturl"
    links:
      - mysql
    volumes:
      - ./users:/app/assets/users
  nginx:
    image: nginx:stable-alpine
    volumes:
      - ./nginx/host.conf:/etc/nginx/conf.d/default.conf
      - /home/ubuntu/ssl/live/domain/fullchain.pem:/root/ssl/fullchain.pem
      - /home/ubuntu/ssl/live/domain/privkey.pem:/root/ssl/privkey.pem
      - ./nginx/log:/var/log/nginx
    environment:
      TZ: 'Asia/Ho_Chi_Minh'
    ports:
      - 80:80
      - 443:443
    links:
      - app:mtlkms
```

```bash
# nginx/host.conf

server {
    listen 80;
    listen [::]:80;
    server_name domain www.domain;
    return         301 https://$server_name$request_uri;
}

server {
    listen 443 ssl;
    server_name domain www.domain;
    ssl_certificate /root/ssl/fullchain.pem;
    ssl_certificate_key /root/ssl/privkey.pem;

    sendfile on;

    charset utf-8;
    # max upload size
    client_max_body_size 50G; # adjust to taste

    location / {
        proxy_pass http://mtlkms:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
}
```

Tạo các thư mục volume
```bash
mkdir mysqldata # Chứa dữ liệu từ cơ sở dữ liệu
mkdir users # Chứa dữ liệu người dùng
mkdir nginx/log # Chứa log của nginx
```

Sau khi cấu hình hoàn tất, chạy `docker-compose up` và tạo database `mtlkms` với các bảng trong `database.sql`

Bây giờ, server của bạn đã sẵn sàng!
