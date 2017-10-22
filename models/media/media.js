
const connection = require('../../config/db');
const getImageMeta = require('./get_image_metadata');
const generateThumb = require('./generate_thumb');
const getRekognitionLabels = require('./get_rekognition_labels');
const generateVideos = require('./generate_videos');
const getVideoMeta = require('./get_video_metadata');

const helpers_custom = require('../../config/helpers');

// Save media in DB
exports.save = function(req, res){

    let mediaData = {
        s3_key : req.body.key,
        mime: req.body.mime.includes('image') ? 'image' : 'video',
        filesize: req.body.filesize,
        org_filename : req.body.org_filename,
        content_type : req.body.content_type,
        status : req.body.status,
        uid : req.user.id
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
            connection.query(sql, [values], function(err, rows) {
                if (err) return res.send(JSON.stringify({ack: 'err', msg: 'cant save meta'}));
                return res.send(JSON.stringify({ack: 'ok', data: metadata, msg: 'all meta saved'}));
            });

        } else {
            return res.send(JSON.stringify({ack: 'err', msg: 'no meta saved'}));
        }
    });
};

// Get and Save Image Labels from AWS rekognition
exports.rekognitionLabels = function(req, res){

    var key = req.body.key;
    var mediaId = req.body.id;

    getRekognitionLabels.get(key, function(err, labels){

        // save recognition labels to DB if any
        var labels = labels.Labels;
        if (labels !== null && typeof labels === 'object') {

            // make meta array
            var values = [];
            Object.keys(labels).forEach(function (key) {
                let obj = labels[key];
                values.push([mediaId, obj.Name, obj.Confidence]);
            });
            // make DB query
            var sql = "INSERT INTO rekognition (media_id, label, confidence) VALUES ?";
            connection.query(sql, [values], function(err, rows) {
                if (err) {
                    return res.send({ack: 'err', msg: 'cant save rekognition labels'});
                } else {
                    return res.send({ack: 'ok', msg: 'all rekognition labels saved'});
                }
              
            });

        } else {
            return res.send(JSON.stringify({ack: 'err', msg: 'no meta saved'}));
        }
    });
    //console.log(key);
};

// Attach media to album
exports.attachMedia = function(req, res){

    var albumId = req.body.album_id;
    var status = req.body.status;
    var media = req.body.media;

    // make media array
    var values = [];
    Object.keys(media).forEach(function(key) {
        let obj = media[key];
        values.push([obj['media_id']]);
    });
    //return res.send({ack: 'ok', msg: values});

    // make DB query
    var sql = "INSERT INTO media (id) VALUES ? ON DUPLICATE KEY UPDATE type_id = ?, status = ?";
    connection.query(sql, [values, albumId, status], function(err, rows) {
        if (err) {
            return res.send(JSON.stringify({ack: 'err', msg: 'cant attach media'}));
        } else {
            return res.send(JSON.stringify({ack: 'ok', msg: rows}));
        }
      
    });
};

// Generate Image Thumbnails
exports.generateThumb = function(req, res){
    var key = req.body.key;
    generateThumb.generate(key, function(err, response){
        return res.send({ack: 'ok', msg: response});
    });
};

// Generate Videos
exports.generateVideos = function(req, res){
    var key = req.body.key;
    generateVideos.generate(key, function(err, response){
        return res.send({ack: 'ok', msg: response});
    });
};

// Get video metadata from lambda and save to DB
exports.saveVideoMeta = function(req, res){
    // res.setHeader('Content-Type', 'application/json');
    // firstly get metadata
    var key = req.body.key;
    var mediaId = req.body.id;
    getVideoMeta.get(key, function (err, metadata) {
        
        if (err) return res.send(JSON.stringify({ack: 'err', msg: err}));
      
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
            connection.query(sql, [values], function(err, rows) {
                if (err) return res.send(JSON.stringify({ack: 'err', msg: 'cant save meta'}));
                return res.send(JSON.stringify({ack: 'ok', data: metadata, msg: 'all meta saved'}));
            });

        } else {
            return res.send(JSON.stringify({ack: 'err', msg: 'no meta saved'}));
        }
    });
};

// Gets presigned image url
exports.getImageUrl = function(req, res){
    var key = req.body.key;
    var style = req.body.style;
    var url = helpers_custom.img(key, style);
    return res.send({ack: 'ok', msg: url});
};

// Gets presigned video url
exports.getVideoUrl = function(req, res){
    var key = req.body.key;
    var preset = req.body.preset;
    var url = helpers_custom.video(key, preset);
    return res.send({ack: 'ok', msg: url});
};
