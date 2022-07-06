import db from '../../dbconnection';
import { DbResult, UserData } from './accountInterface';

class Account {
    constructor () {

    }
    
    public get(username: string) : Promise<UserData> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    users.*,
                    SUM(sdtags.time_today) as time_today,
                    SUM(sdtags.time_week) as time_week,
                    SUM(sdtags.time_month) as time_month,
                    SUM(sdtags.time_year) as time_year,
                    SUM(sdtags.time_total) as time_total
                FROM users
                LEFT JOIN sdtags
                ON sdtags.user=users.id
                WHERE
                    users.username=?
                `,
            
                [username],

                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    }

    public getAll() {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    users.id,
                    users.name,
                    users.username,
                    users.email,
                    users.slogan,
                    users.created_at,
                    SUM(sdtags.time_today) as time_today,
                    SUM(sdtags.time_week) as time_week,
                    SUM(sdtags.time_month) as time_month,
                    SUM(sdtags.time_year) as time_year,
                    SUM(sdtags.time_total) as time_total
                FROM users
                LEFT JOIN sdtags
                ON sdtags.user=users.id
                GROUP BY users.id`,

                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                }
            );
        });
    }

    public create(data: Array<string>) {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO users(name, email, username, password) VALUES (?, ?, ?, ?)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public login(data: Array<string>) {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    users.*,
                    SUM(sdtags.time_today) as time_today,
                    SUM(sdtags.time_week) as time_week,
                    SUM(sdtags.time_month) as time_month,
                    SUM(sdtags.time_year) as time_year,
                    SUM(sdtags.time_total) as time_total
                FROM users
                LEFT JOIN sdtags
                ON users.id=sdtags.user
                WHERE
                    BINARY username=?
                    AND password=?
                `,

                data,

                (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result[0]);
                    }
                }
            );
        });
    }

    public updateUserInfo(data: Array<string>) : Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET name=?, slogan=? WHERE id=?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public changePassword(data: Array<string>) : Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('UPDATE users SET password=? WHERE id=?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }
}

export default new Account();