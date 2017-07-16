
Album.convertExifDate = function(date){
    if(date){
        var dateTime = date.split(' ');
        var regex = new RegExp(':', 'g');
        dateTime[0] = dateTime[0].replace(regex, '-');
        if(typeof date === 'undefined' || !date){
            var newDateTime = '';
        } else {
            var newDateTime = dateTime[0] + ' ' + dateTime[1];
        }
        return newDateTime;
    } else {
        return '';
    }

};