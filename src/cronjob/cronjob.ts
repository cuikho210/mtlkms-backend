import studyTime from '../model/studyDiary/studyTime';
import SDTag from '../model/studyDiary/SDTag';
import { DbResult, SDTagData, studyTimeData } from '../model/studyDiary/SDInterface';

class CronJob {
    private date: Date;
    private isMonday: boolean;
    private isFirstDay: boolean;
    private isFirstMonth: boolean;

    constructor () {
        this.date = new Date();

        this.isMonday = (this.date.getDay() == 1);
        this.isFirstDay = (this.date.getDate() == 1);
        this.isFirstMonth = (this.date.getMonth() == 0);

        console.log('Cronjob: ' + this.date);
        console.log('Is Monday: ' + this.isMonday);
        console.log('Is first day: ' + this.isFirstDay);
        console.log('Is first month: ' + this.isFirstMonth);
        console.log('----------------------------------------');

        this.ResetSDTagTime();
    }

    public async ResetSDTagTime() {
        let sdtags: SDTagData[] = await SDTag.getAll();

        for (let tag of sdtags) {
            // Save study time
            let isResetTimeWeek: boolean = false;
            let isResetTimeMonth: boolean = false;
            let isResetTimeYear: boolean = false;

            await studyTime.saveTimeDay([tag.user, tag.id, tag.time_today]);

            if (this.isMonday) {
                await studyTime.saveTimeWeek([tag.user, tag.id, tag.time_week]);
                isResetTimeWeek = true;
            }

            if (this.isFirstDay) {
                await studyTime.saveTimeMonth([tag.user, tag.id, tag.time_month]);
                isResetTimeMonth = true;
            }

            if (this.isFirstMonth) {
                await studyTime.saveTimeYear([tag.user, tag.id, tag.time_year]);
                isResetTimeYear = true;
            }

            // Reset time
            let time_week: number = isResetTimeWeek ? 0 : tag.time_week;
            let time_month: number = isResetTimeMonth ? 0 : tag.time_month;
            let time_year: number = isResetTimeYear ? 0 : tag.time_year;

            await SDTag.updateTime([0, time_week, time_month, time_year, tag.time_total, tag.id, tag.user]);
        }
    }
}

export default CronJob;