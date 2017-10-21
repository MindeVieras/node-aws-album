
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const lambda = new AWS.Lambda();
const config = require('../../config/config');

module.exports.get = function(key, cb){

    // Get S3 file metadata from lambda
    let params = {
        FunctionName: 'aws-album_get_video_metadata',
        Payload: '{"srcKey": "'+key+'", "bucket": "'+config.bucket+'"}'
    };

    lambda.invoke(params, function(err, data) {
        
        if (err) cb(err);
        
        var payload = JSON.parse(data.Payload);

        var meta = payload;

        if (payload) {
            // console.log(payload);
            var meta = {};

            // make meta object
            payload.streams.forEach(function (row) {
                if (row.codec_type == 'video') {
                    meta.width = row.width;
                    meta.height = row.height;
                    meta.duration = parseFloat(row.duration);
                    meta.aspect = row.display_aspect_ratio;
                    meta.frame_rate = eval(row.r_frame_rate);
                    meta.codec = row.codec_name;
                    if ('creation_time' in row.tags) meta.datetime = row.tags.creation_time;
                }
            });
        }
        
        cb(null, meta);
  
    });

};

// converts exif date to normal date
function convertExifDate(date){
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
        return date;
    }
};