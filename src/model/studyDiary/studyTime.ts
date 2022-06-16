import db from '../../dbconnection';
import { DbResult, studyTimeData } from './SDInterface';

class StudyTime {
    saveTimeDay(data: Array<number>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO studytimes (user, sdtag, time) VALUES (?, ?, ?)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    saveTimeWeek(data: Array<number>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO studytimes (user, sdtag, time, type) VALUES (?, ?, ?, 1)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    saveTimeMonth(data: Array<number>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO studytimes (user, sdtag, time, type) VALUES (?, ?, ?, 2)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    saveTimeYear(data: Array<number>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO studytimes (user, sdtag, time, type) VALUES (?, ?, ?, 3)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getTimeMonthByTag(data: Array<number>): Promise<studyTimeData[]> {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM studytimes WHERE sdtag = ? AND MONTH(created_at) = ? AND (type = 0 OR type = 1 OR type = 2)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    getTimeMonthByUser(data: Array<number>): Promise<studyTimeData[]> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    type,
                    created_at,
                    SUM(time) as time
                FROM studytimes
                WHERE
                    user = ?
                    AND (type = 0 OR type = 1 OR type = 2)
                    AND MONTH(created_at) = ?
                GROUP BY created_at, type`,

                data,

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
}

export default new StudyTime();