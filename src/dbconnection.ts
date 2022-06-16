import * as mysql from 'mysql';

console.log(process.env.DB_HOST);
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'mtlkms'
});

export default connection;