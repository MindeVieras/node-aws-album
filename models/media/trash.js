
const connection = require('../../config/db');
const deleteFromS3 = require('./delete_from_s3');

// Gets trash list
exports.list = function(req, res){
   connection.query('SELECT * FROM media WHERE status = 2',function(err,rows)     {
          
      if(err)
        console.log("Error Selecting : %s ",err );
   
        res.render('utils/trash', {
          title: 'Trash',
          media: rows,
          user: req.user,
          device: req.device.type
        });
                         
    });
};

// Move media to trash
exports.moveToTrash = function(req, res){
    connection.query('UPDATE media set status = 2 WHERE id = ?', req.body.id, function(err, rows){
            
        if(err) return res.send(JSON.stringify({ack: 'err', msg: err.code}));

        return res.send(JSON.stringify({ack: 'ok', msg: 'Moved to trash'}));
          
    });
};

// Recover media file from trash
exports.recover = function(req, res){

    connection.query('UPDATE media set status = 1 WHERE id = ?', req.body.id, function(err, rows){

        if(err) return res.send(JSON.stringify({ack: 'err', msg: err.code}));

        if(rows.changedRows == 0) return res.send(JSON.stringify({ack: 'err', msg: 'Cannot find album'}));

        return res.send(JSON.stringify({ack: 'ok', msg: 'Madia file recovered'}));
    
    });
};

// Completely remove media file from system and S3
exports.hardDelete = function(req, res){
    
    var id = req.body.id;
    var type = req.body.type;

    if (type == 'image') {
        // Firstly delete image and thumbnails from S3
        deleteFromS3.deleteImage(id, function (err, data) {
            
            if (err) return res.send(JSON.stringify({ack: 'err', msg: err}));
            
            // Delete media
            connection.query('DELETE FROM media WHERE id = ?', id);
            // Delete meta
            connection.query('DELETE FROM media_meta WHERE media_id = ?', id);
            // Delete rekognition
            connection.query('DELETE FROM rekognition WHERE media_id = ?', id);
            
            return res.send(JSON.stringify({ack: 'ok', msg: 'Image deleted for good'}));

        });
    } else if (type == 'video') {
        // Delete video and its styles S3
        deleteFromS3.deleteVideo(id, function (err, data) {
            
            if (err) return res.send(JSON.stringify({ack: 'err', msg: err}));
            
            // Delete media
            connection.query('DELETE FROM media WHERE id = ?', id);
            // Delete meta
            connection.query('DELETE FROM media_meta WHERE media_id = ?', id);
            
            return res.send(JSON.stringify({ack: 'ok', msg: 'Video deleted for good'}));

        });
    } else {
        return res.send(JSON.stringify({ack: 'err', msg: 'nothing to delete'}));
    }

};
