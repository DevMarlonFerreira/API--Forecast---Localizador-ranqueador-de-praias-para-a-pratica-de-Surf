import moment from 'moment';

export class Timeutil {
    public static getUnixTimeForAFutureDay(days: number): number {
        return moment().add(days, 'days').unix();
    }
}