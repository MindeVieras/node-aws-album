
const connection = require('../../config/db');
const path = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const elastictranscoder = new AWS.ElasticTranscoder();
const config = require('../../config/config');

module.exports.generate = function(key, cb){

    var params = {
        PipelineId: '1495388973247-jvhq6m',
        Input: {
            AspectRatio: 'auto',
            Container: 'auto',
            FrameRate: 'auto',
            Interlaced: 'auto',
            Key: key,
            Resolution: 'auto',
        },
        Output: {
            Key: 'videos/medium/'+path.basename(key),
            PresetId: '1495400403828-wqj8po',
            Rotate: 'auto',
            ThumbnailPattern: ''
        }
    };

    elastictranscoder.createJob(params, function(err, data) {
        if (err) cb(err);
        else cb(null, data);
    });
    // // Firtly get image media styles
    // connection.query('SELECT * FROM media_styles', function(err,rows){
            
    //     if(err) throw err

    //     let payloadObj = {
    //         srcKey: key,
    //         bucket: config.bucket,
    //         styles: rows
    //     };

    //     let params = {
    //         FunctionName: 'aws-album_generate_thumb',
    //         Payload: JSON.stringify(payloadObj)
    //     };

    //     lambda.invoke(params, function(err, data) {
            
    //         if (err) console.log(err);
            
    //         // var payload = JSON.parse(data.Payload);
    //         var thumb = '//s3-eu-west-1.amazonaws.com/'+config.bucket+'/thumbs/medium/'+path.basename(key);
    //         cb(null, thumb);  

    //     });
          
          
    // });

};
