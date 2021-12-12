const date = require('date-and-time');

const dateFormatter = function formatDate(startDate, validityInDays) {
    var d = new Date(date.addDays(startDate, validityInDays)),

        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2)
        month = '0' + month;
    if (day.length < 2)
        day = '0' + day;

    return [year, month, day].join('-');
}

module.exports = dateFormatter;