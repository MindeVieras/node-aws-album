
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const rekognition = new AWS.Rekognition();

module.exports.get = function(key, cb){

    var params = {
        Image: {
            S3Object: {
                Bucket: "media.album.mindelis.com", 
                Name: key
            }
        }, 
        MaxLabels: 100, 
        MinConfidence: 10
    };

    rekognition.detectLabels(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else cb(null, data);
    });

};
