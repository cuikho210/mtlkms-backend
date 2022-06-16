# MTLKMS Backend
Học hành chăm chỉ ^^

Backend of [MTLKMS](https://mtlkms.github.io)

## Development
### Create docker-compose file
In `/`, create `docker-compose.yml`
```yml
version: '3.5'
services:
  mysql:
    image: mariadb:latest
    environment:
      TZ: UTC-7
      MYSQL_ROOT_PASSWORD: 'your_root_password'
      MYSQL_USER: 'your_username'
      MYSQL_PASSWORD: 'your_password'
      MYSQL_DATABASE: 'mtlkms'
    volumes:
      - ./mysqldata:/var/lib/mysql
    ports:
      - 3306:3306
  nginx:
    image: nginx:stable-alpine
    volumes:
      - ./nginx/host.conf:/etc/nginx/conf.d/default.conf
      - ./nginx/ssl/localhost.crt:/root/ssl/localhost.crt
      - ./nginx/ssl/localhost.key:/root/ssl/localhost.key
    network_mode: host
    ipc: host
    restart: unless-stopped     # or "always"
    command: /bin/sh -c "nginx -g 'daemon off;'"
```

Fill in there the path to the 2 ssl files and your username and password

### Create env file
In `/` create `.env`
```
DB_USER=""
DB_PASSWORD=""

SALT=""
EMAIL_PASSWORD=""

CLIENT_URL="http://localhost:8080"
```

`DB_USER` and `DB_PASSWORD` is your database user and password (In docker-compose file)  
`SALT` is your salt (for hash password and token)  
`EMAIL_PASSWORD` is your email password (for send email) 🦫  
`CLIENT_URL` is your client URL (for CORS)

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

### Start to develop
Run the following commands one by one
```bash
npm install
```
```bash
sudo docker-compose up -d
```
```bash
npm run dev
```

And now your server is ready on https://server.test
