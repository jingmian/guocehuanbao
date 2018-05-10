function buildTimeByYear(year, month, day) {
    var time = year;
    if (month < 10) {
        if (day < 10) {
            time = time + '-0' + month + '-0' + day;
        } else {
            time = time + '-0' + month + '-' + day;
        }
    } else {
        if (day < 10) {
            time = time + '-' + month + '-0' + day;
        } else {
            time = time + '-' + month + '-' + day;
        }
    }
    return time;
}

