import studyTime from '../model/studyDiary/studyTime';
import SDTag from '../model/studyDiary/SDTag';
import { DbResult, SDTagData, studyTimeData } from '../model/studyDiary/SDInterface';

class CronJob {
    private date: Date;
    private isSaturday: boolean;
    private isLastDay: boolean;
    private isLastMonth: boolean;

    constructor () {
        this.date = new Date();

        let lastDay: number = new Date(this.date.getFullYear(), this.date.getMonth() + 1, 0).getDate();

        this.isSaturday = (this.date.getDay() == 6);
        this.isLastDay = (this.date.getDate() == lastDay);
        this.isLastMonth = (this.date.getMonth() == 12);

        console.log('\n');
        console.log('---------------- \x1b[35m[model/cronjob]\x1b[0m ---------------------')
        console.log('Cronjob: ' + this.date);
        console.log('Is Saturday: ' + this.isSaturday);
        console.log('Is last day: ' + this.isLastDay);
        console.log('Is last month: ' + this.isLastMonth);
        console.log('------------------------------------------------------\n');

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

            if (this.isSaturday) {
                await studyTime.saveTimeWeek([tag.user, tag.id, tag.time_week]);
                isResetTimeWeek = true;
            }

            if (this.isLastDay) {
                await studyTime.saveTimeMonth([tag.user, tag.id, tag.time_month]);
                isResetTimeMonth = true;
            }

            if (this.isLastMonth && this.isLastDay) {
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