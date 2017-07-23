
const connection = require('../../config/db');
const getImageMeta = require('./get_image_metadata');

// Save media in DB
exports.save = function(req, res){

    let mediaData = {
        s3_key : req.body.key,
        mime: req.body.mime,
        filesize: req.body.filesize,
        org_filename : req.body.org_filename,
        content_type : req.body.content_type,
        status : req.body.status
    };

    // Insert album data
    connection.query('INSERT INTO media set ? ', mediaData, function(err,rows){
            
        if(err) throw err

          return res.send(JSON.stringify({ack: 'ok', id: rows.insertId}));
          
    });
  
};

// Get image metadata from lambda and save to DB
exports.saveExif = function(req, res){
    // res.setHeader('Content-Type', 'application/json');
    // firstly get metadata
    var key = req.body.key;
    var mediaId = req.body.id;
    getImageMeta.get(key, function (err, metadata) {
      
        // save metadata to DB if any
        if (metadata !== null && typeof metadata === 'object') {

            // make meta array
            var values = [];
            Object.keys(metadata).forEach(function (key) {
                let obj = metadata[key];
                values.push([mediaId, key, obj]);
            });

            // make DB query
            var sql = "INSERT INTO media_meta (media_id, meta_name, meta_value) VALUES ?";
            connection.query(sql, [values], function(err) {
                if (err) {
                    return res.send(JSON.stringify({ack: 'err', msg: 'cant save meta'}));
                } else {
                    return res.send(JSON.stringify({ack: 'ok', msg: 'all meta saved'}));
                }
              
            });

        } else {
            return res.send(JSON.stringify({ack: 'err', msg: 'no meta saved'}));
        }

    });
  
};


