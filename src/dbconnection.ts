import * as mysql from 'mysql';

const connection = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'mtlkms'
});

export default connection;