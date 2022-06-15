"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dbconnection_1 = require("../dbconnection");
class Account {
    constructor() {
    }
    create(data) {
        return new Promise((resolve, reject) => {
            dbconnection_1.default.query('INSERT INTO users(name, email, username, password) SET (?, ?, ?, ?)', data, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
}
exports.default = new Account();
//# sourceMappingURL=account.js.map