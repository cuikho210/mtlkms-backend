import * as mysql from 'mysql';
import * as dotenv from 'dotenv';

dotenv.config();

const connection = mysql.createPool({
    host: 'localhost',
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: 'mtlkms'
});

export default connection;