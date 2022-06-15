import db from '../../dbconnection';
import { DbResult } from './SDInterface';

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
}

export default new StudyTime();