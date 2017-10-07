
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const lambda = new AWS.Lambda();
const config = require('../../config/config');

module.exports.generate = function(key, cb){

    // Get S3 file metadata from lambda
    let params = {
        FunctionName: 'aws-album_generate_thumb',
        Payload: '{"srcKey": "'+key+'", "bucket": "'+config.bucket+'"}'
    };

    lambda.invoke(params, function(err, data) {
        
        if (err) console.log(err);
        
        var payload = JSON.parse(data.Payload);

        cb(null, payload);  

    });

};
