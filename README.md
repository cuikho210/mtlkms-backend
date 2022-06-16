# MTLKMS Backend
Học hành chăm chỉ ^^

Backend of [MTLKMS](https://mtlkms.github.io)

## Development
### Create docker-compose file
In `/`, create `docker-compose.yml`
```yml
version: '3'
services:
  mysql:
    image: mariadb:latest
    environment:
      TZ: UTC-7
      MYSQL_ROOT_PASSWORD: ''
      MYSQL_USER: ''
      MYSQL_PASSWORD: ''
      MYSQL_DATABASE: 'mtlkms'
    volumes:
      - ./mysqldata:/var/lib/mysql
    ports:
      - 3306:3306
  nginx:
    image: nginx:stable-alpine
    volumes:
      - ./nginx/host.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl/localhost.crt:/root/ssl/localhost.crt # Link to your SSL cert in here
      - ./nginx/ssl/localhost.key:/root/ssl/localhost.key # And change your nameserver in /nginx/host.conf
    network_mode: host
    ipc: host
    restart: unless-stopped     # or "always"
    command: /bin/sh -c "nginx -g 'daemon off;'"
  app:
    image: cuikho210/mtlkms:dev
    environment:
      DB_HOST: "mysql"
      DB_USER: ""
      DB_PASSWORD: ""
      SALT: ""
      EMAIL_PASSWORD: ""
      CLIENT_URL: "http://localhost:8080"
    ports:
      - 3000:3000
    links:
      - mysql
    volumes:  # Only for dev, remove in prod
      - ./:/app
```
Replace `MYSQL_ROOT_PASSWORD`, `MYSQL_USER`, `MYSQL_PASSWORD`, `DB_USER`, `DB_PASSWORD`, `SALT`, `EMAIL_PASSWORD`, `CLIENT_URL`

- `MYSQL_USER` = `DB_USER`
- `MYSQL_PASSWORD` = `DB_PASSWORD`
- `SALT` is any string (For hash password and gen token)
- `CLIENT_URL` is your client URL (Use for CORS)

### Run docker-compose
```bash
sudo docker-compose up
```

### Create Database
First, create a database named mtlkms  
Then open the `/database.sql` file and run the commands in it using your sqlclient

### Change your hosts file
Open your host file
```bash
# On linux
sudo nano /etc/hosts
# Or use your favorite editor
```
and add the following line
```
127.0.0.1       server.test
```

And now your server is ready on https://server.test
