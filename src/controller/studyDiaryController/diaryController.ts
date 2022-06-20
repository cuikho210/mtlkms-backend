import diary from '../../model/studyDiary/diary';
import accountController from '../../controller/accountController/accountController';
import { DbResult, SDTagData, diaryData, studyTimeData } from '../../model/studyDiary/SDInterface';
import { UserData } from '../../model/account/accountInterface';
import SDTag from '../../model/studyDiary/SDTag';
import studyTime from '../../model/studyDiary/studyTime';

class DiaryController {
    public async create(token: string, data: diaryData): Promise<diaryData> {
        // Check if the user is logged in
        let userData: UserData = await accountController.getUserDataFromToken(token);

        // Create
        let result: DbResult = await diary.create([String(data.sdtag), String(userData.id)]);

        if (result.affectedRows == 0) {
            throw new Error('Diary creation failed');
        }

        return {
            id: result.insertId,
            sdtag: data.sdtag,
            user: userData.id,
            is_learning: 1,
            start_at: new Date().toISOString(),
            stop_at: '',
            log: ''
        };
    }

    public async getLearningDiary(user: string): Promise<diaryData> {
        let result: diaryData = await diary.getLearningDiary(user);
        
        if (result) {
            return result;
        }
        else {
            throw new Error('Learning Diary not found');
        }
    }

    public async stopLearningDiary(token: string, data: diaryData): Promise<SDTagData> {
        // Check if the user is logged in
        let userData: UserData = await accountController.getUserDataFromToken(token);

        // Validate data
        if (data.id == undefined || data.id == null) {
            throw new Error('Diary ID is missing');
        }

        // Update Diary
        let result: DbResult = await diary.stopLearningDiary([data.log, String(data.id), String(userData.id)]);

        if (result.affectedRows == 0) {
            throw new Error('Diary update failed');
        }

        // Update tag
        let diaryData: diaryData = await diary.getDiary(data.id);

        let startTime = new Date(diaryData.start_at);
        let stopTime = new Date(diaryData.stop_at);
        let timeDiff = stopTime.getTime() - startTime.getTime();
        let timeDiffMinutes = Math.round(timeDiff / 60000);

        let tagData: SDTagData = await SDTag.getTag(diaryData.sdtag);
        
        let newTimeToday = tagData.time_today + timeDiffMinutes;
        let newTimeWeek = tagData.time_week + timeDiffMinutes;
        let newTimeMonth = tagData.time_month + timeDiffMinutes;
        let newTimeYear = tagData.time_year + timeDiffMinutes;
        let newTimeTotal = tagData.time_total + timeDiffMinutes;

        let resultTag: DbResult = await SDTag.updateTime([newTimeToday, newTimeWeek, newTimeMonth, newTimeYear, newTimeTotal, tagData.id, userData.id]);

        if (resultTag.affectedRows == 0) {
            throw new Error('Tag update failed');
        }

        let sdtag: SDTagData = await SDTag.getTag(diaryData.sdtag);

        return sdtag;
    }

    public async getDiariesBySDTag(sdtag: number, user: number, month: number, year: number) {
        let diaries: diaryData[] = await diary.getDiariesBySDTag([sdtag, user, month, year]);
        let times: studyTimeData[] = await studyTime.getTimeMonthByTag([sdtag, month]);

        return {
            diaries: diaries,
            times: times
        };
    }

    public async getDiariesByUser(user: number, month: number, year: number) {
        let diaries: diaryData[] = await diary.getDiariesByUser([user, month, year]);
        let times: studyTimeData[] = await studyTime.getTimeMonthByUser([user, month]);

        return {
            diaries: diaries,
            times: times
        };
    }
}

export default new DiaryController();