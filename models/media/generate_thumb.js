
const connection = require('../../config/db');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const lambda = new AWS.Lambda();
const config = require('../../config/config');

module.exports.generate = function(key, cb){
    
    // Firtly get image media styles
    connection.query('SELECT * FROM media_styles', function(err,rows){
            
        if(err) throw err

        let payloadObj = {
            srcKey: key,
            bucket: config.bucket,
            styles: rows
        };

        let params = {
            FunctionName: 'aws-album_generate_thumb',
            Payload: JSON.stringify(payloadObj)
        };

        lambda.invoke(params, function(err, data) {
            
            if (err) console.log(err);
            
            var payload = JSON.parse(data.Payload);

            cb(null, payload);  

        });
          
          
    });

};
