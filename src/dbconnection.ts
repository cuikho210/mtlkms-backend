import * as mysql from 'mysql';
import { dbpwd } from './pwd';

const connection = mysql.createPool({
    host: 'localhost',
    user: 'cuikho210',
    password: dbpwd,
    database: 'mtlkms'
});

export default connection;