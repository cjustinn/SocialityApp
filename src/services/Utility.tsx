export function truncateNumber(num: Number): String {

    if (!num) { return ""; }
    
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