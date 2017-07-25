
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const lambda = new AWS.Lambda();

module.exports.generate = function(key, cb){

    // Get S3 file metadata from lambda
    let params = {
        FunctionName: 'aws-album_generate_thumb',
        Payload: '{"srcKey": "'+key+'"}'
    };

    lambda.invoke(params, function(err, data) {
        
        if (err) console.log(err);
        
        var payload = JSON.parse(data.Payload);

        // var meta = payload;

        // if (payload) {
        //     var meta = {};

        //     // make exif object
        //     Object.keys(payload.exif).forEach(function (key) {
        //         if (key == 'DateTimeOriginal') meta.datetime = convertExifDate(payload.exif[key])
        //         if (key == 'ExifImageWidth') meta.width = payload.exif[key]
        //         if (key == 'ExifImageHeight') meta.height = payload.exif[key]
        //         if (key == 'Flash') meta.flash = payload.exif[key]
        //         if (key == 'ISO') meta.iso = payload.exif[key]
        //     });

        //     // make image object
        //     Object.keys(payload.image).forEach(function (key) {
        //         if (key == 'Make') meta.make = payload.image[key]
        //         if (key == 'Model') meta.model = payload.image[key]
        //         if (key == 'Orientation') meta.orientation = payload.image[key]
        //     });
        // }
        console.log(data.Payload);
        cb(null, payload);
  

    });

};
