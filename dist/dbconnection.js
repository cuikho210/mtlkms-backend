"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = require("mysql");
const dbpwd_1 = require("./dbpwd");
const connection = mysql.createPool({
    host: 'localhost',
    user: 'cuikho210',
    password: dbpwd_1.default,
    database: 'mtlkms'
});
exports.default = connection;
//# sourceMappingURL=dbconnection.js.map