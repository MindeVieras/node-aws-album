
const connection = require('../../config/db');
const path = require('path');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const s3 = new AWS.S3();
const config = require('../../config/config');

module.exports.deleteImage = function(id, cb){

    // Get media S3 key form DB
    connection.query('SELECT s3_key FROM media WHERE id = ?', id, function(err,rows){
        if(err) return cb('Can\'t find media in DB: '+err.code);

        // Check if any
        if (rows[0] != null) {
            
            const key = rows[0].s3_key
            // Get image media styles form DB
            connection.query('SELECT * FROM media_styles', function(err,rows){
                if(err) return cb('Can\'t get style: '+err.code);

                // make array of S3 objects
                var keysArray = [];
                var orgKeyObj = new Object();
                orgKeyObj['Key'] = key;
                keysArray.push(orgKeyObj);

                rows.forEach(function(row){
                    var keyObj = new Object();
                    keyObj['Key'] = 'thumbs/'+row.name+'/'+path.basename(key);
                    keysArray.push(keyObj);
                });
                
                var params = {
                    Bucket: config.bucket, 
                    Delete: {
                        Objects: keysArray,
                        Quiet: false
                    }
                };
                
                s3.deleteObjects(params, function(err, data) {
                    if (err) console.log(err);
                    else cb(null, data);
                });
                  
            });
        
        } else {
            cb('Can\'t find media in DB');
        }          
          
    });

};
