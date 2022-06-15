import db from '../../dbconnection';
import { DbResult, diaryData } from './SDInterface';

class Diary {
    public create(data: Array<string>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('INSERT INTO diaries(sdtag, user) VALUES (?, ?)', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public getDiary(id: number): Promise<diaryData> {
        return new Promise((resolve, reject) => {
            db.query('SELECT * FROM diaries WHERE id = ?', [id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result[0]);
                }
            });
        });
    }

    public getLearningDiary(user: string): Promise<diaryData> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    diaries.*,
                    sdtags.name
                FROM diaries
                INNER JOIN sdtags ON diaries.sdtag = sdtags.id
                WHERE
                    diaries.user = 9
                    AND is_learning = 1`,

                [user],

                (err, result) => {
                    if (err) {
                        reject(err);
                        console.log('[Model diary -> getLearningDiary]', err);
                    } else {
                        resolve(result[0]);
                        console.log('[Model diary -> getLearningDiary]', result);
                    }
                }
            );
        });
    }

    public stopLearningDiary(data: Array<string>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('UPDATE diaries SET is_learning = 0, stop_at = current_timestamp(), log = ? WHERE id = ? AND user = ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public deleteDiaryBySDTag(data: Array<number>): Promise<DbResult> {
        return new Promise((resolve, reject) => {
            db.query('DELETE FROM diaries WHERE sdtag = ? AND user = ?', data, (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    }

    public getDiariesBySDTag(data: Array<number>): Promise<Array<diaryData>> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    id,
                    sdtag,
                    user,
                    start_at,
                    stop_at,
                    log
                FROM diaries
                WHERE
                    sdtag = ?
                    AND user = ?
                    AND MONTH(stop_at) = ?
                    AND YEAR(stop_at) = ?
                    AND is_learning = 0
                ORDER BY stop_at DESC`,

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

    public getDiariesByUser(data: Array<number>): Promise<Array<diaryData>> {
        return new Promise((resolve, reject) => {
            db.query(
                `SELECT
                    diaries.id,
                    diaries.sdtag,
                    diaries.user,
                    diaries.start_at,
                    diaries.stop_at,
                    diaries.log,
                    sdtags.name
                FROM diaries
                INNER JOIN sdtags ON sdtags.id = diaries.sdtag
                WHERE
                    diaries.user = ?
                    AND MONTH(diaries.stop_at) = ?
                    AND YEAR(diaries.stop_at) = ?
                    AND diaries.is_learning = 0
                ORDER BY diaries.stop_at DESC`,
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

export default new Diary();