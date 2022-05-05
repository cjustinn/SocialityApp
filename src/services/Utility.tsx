import Moment from 'moment';

export function truncateNumber(num: Number): String {

    if (num == undefined || num == null) { return ""; }
    
    let truncated: String = "";

    if (num >= 10000) {

        let numString = num.toString();
        let digitsBeforeZeroes = numString.length % 3 === 0 ? 3 : numString.length % 3;

        let suffix = num >= 10000 && num < 1000000 ? 'K' : 'M';

        truncated = `${numString.substring(0, digitsBeforeZeroes - 1)}.${numString.charAt(digitsBeforeZeroes)}${suffix}`;

    } else {
        truncated = num.toString();
    }

    return truncated;

}

export function formatTime(date: Date, format: String): String {
    Moment.locale('en');

    const timeString = Moment(date).format(format);

    return timeString;
}

export function formatDate(date: Date, format: String): String {
    Moment.locale('en');

    const dateString = Moment(date).format(format);

    return dateString;
}

export function todayIsDayAfter(date: Date) {
    Moment.locale('en');

    const comparisonDate = Moment(date);
    const dayAfter = Moment(comparisonDate.format('YYYY-MM-DD')).add(1, 'days');

    return Moment().isSameOrAfter(dayAfter);
}