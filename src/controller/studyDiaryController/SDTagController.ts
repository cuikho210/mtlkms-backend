import SDTag from '../../model/studyDiary/SDTag';
import diary from '../../model/studyDiary/diary';
import { DbResult, SDTagData } from '../../model/studyDiary/SDInterface';
import { UserData } from '../../model/account/accountInterface';
import accountController from '../../controller/accountController/accountController';

class SDTagController {
    public async getTag(id: number): Promise<SDTagData> {
        let result: SDTagData = await SDTag.getTag(id);

        return result;
    }

    public async getAll(userID): Promise<Array<SDTagData>> {
        let result: Array<SDTagData> = await SDTag.getAll(parseInt(userID));

        return result;
    }

    public async create(token: string, data: SDTagData): Promise<SDTagData> {
        // Check if the user is logged in
        let userData: UserData = await accountController.getUserDataFromToken(token);

        // Create
        let result: DbResult = await SDTag.create([data.name, data.icon, data.bg_color, data.text_color, String(userData.id)]);

        if (result.affectedRows == 0) {
            throw new Error('Tag creation failed');
        }

        return {
            id: result.insertId,
            name: data.name,
            icon: data.icon,
            bg_color: data.bg_color,
            text_color: data.text_color,
            time_today: 0,
            time_week: 0,
            time_month: 0,
            time_year: 0,
            time_total: 0,
            user: userData.id
        };
    }

    public async update(token: string, data: SDTagData): Promise<SDTagData> {
        // Check if the user is logged in
        let userData: UserData = await accountController.getUserDataFromToken(token);
        let tag: SDTagData = await SDTag.getTag(data.id);

        if (tag.user != userData.id) {
            throw new Error('You are not allowed to update this tag');
        }

        // Update
        let result: DbResult = await SDTag.update([data.name, data.icon, data.bg_color, data.text_color, String(data.id), String(userData.id)]);

        if (result.affectedRows == 0) {
            throw new Error('Tag update failed');
        }

        return {
            id: data.id,
            name: data.name,
            icon: data.icon,
            bg_color: data.bg_color,
            text_color: data.text_color,
            time_today: tag.time_today,
            time_week: tag.time_week,
            time_month: tag.time_month,
            time_year: tag.time_year,
            time_total: tag.time_total,
            user: tag.user
        };
    }

    public async delete(token: string, id: number): Promise<boolean> {
        // Check if the user is logged in
        let userData: UserData = await accountController.getUserDataFromToken(token);

        // Delete tag
        let result: DbResult = await SDTag.delete([id, userData.id]);

        if (result.affectedRows == 0) {
            throw new Error('Tag deletion failed');
        }

        // Delete all diary entries with this tag
        result = await diary.deleteDiaryBySDTag([id, userData.id]);

        return true;
    }
}

export default new SDTagController();