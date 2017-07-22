
const connection = require('../../config/db');
const AWS = require('aws-sdk');

AWS.config.loadFromPath('./aws-keys.json');

const lambda = new AWS.Lambda();
const getImageMeta = require('./get_image_metadata');

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
          
      if(err)
        return res.send(JSON.stringify({ack:'err', msg: err.code}));

        return res.send(JSON.stringify({ack: 'ok', msg: rows.insertId}));
        
  });
  
};



// exports.saveExif = function(req, res){
//   res.setHeader('Content-Type', 'application/json');

//   var key = req.body.key;
//   var org_filename = req.body.org_filename;
//   var filesize = req.body.filesize;
//   var mime = req.body.mime;

//   let mediaData = {
//       s3_key : key,
//       mime: mime,
//       filesize: filesize,
//       org_filename : org_filename,
//       content_type : 3,
//       status : 0,
//   };

//   // Insert album data
//   connection.query('INSERT INTO media set ? ', mediaData, function(err,rows){
          
//       if(err) {
//         return res.send(JSON.stringify({ack:'err', msg: err.code}));
//       } else {
      
//         var type = mime.includes('image') ? 'image' : 'video';
        
//         // if image
//         if(type == 'image'){

//             // insert metadata in database
//             // //var metadata = getImageMeta.get();
//             // console.log(getImageMeta.get(key, result));
//             getImageMeta.get(key, function (err, metadata) {
              
//               // save metadata to DB if any
//               if (metadata !== null && typeof metadata === 'object') {
//                   console.log('saving meta to db '+metadata);
//               }

//               //meta = JSON.parse(metadata);
//               return res.send(JSON.stringify({ack: 'ok', msg: metadata}));
//               // return res.send(metadata);
//             });
//             // var values = [];
            
//             // // make image meta array
//             // var imgKeys = ['Make', 'Model', 'Orientation'];
//             // imgKeys.forEach(function (key) {
//             //   let obj = metadata.image[key];
//             //   values.push([rows.insertId, key, obj]);
              
//             // });
//             // // make exif array
//             // var exifKeys = ['ISO', 'Flash', 'DateTimeOriginal', 'ExifImageWidth', 'ExifImageHeight'];
//             // exifKeys.forEach(function (key) {
//             //   if (key == 'DateTimeOriginal') {
//             //     var obj = convertExifDate(metadata.exif[key]);
//             //   } else {
//             //     var obj = metadata.exif[key];
//             //   }
              
//             //   values.push([rows.insertId, key, obj]);
              
//             // });

//             // // make DB query
//             // var sql = "INSERT INTO media_meta (media_id, meta_name, meta_value) VALUES ?";
//             // connection.query(sql, [values], function(err) {
//             //   if (err) {
//             //     return res.send(JSON.stringify({ack: 'ok', id: rows.insertId,  msg: 'cant save meta'}));
//             //   } else {
//             //     return res.send(JSON.stringify({ack: 'ok', id: rows.insertId,  msg: 'all meta saved'}));
//             //   }
                
              
//             // });

//             //console.log(metadata);
//             //return res.send(JSON.stringify({ack: 'ok', msg: metadata}));
//             // return res.send(metadata);

//         }

//         // if video
//         else {
//           return res.send(JSON.stringify({ack:'err', msg: 'video uploaded'}));
//         }
//       }
//     });

  
// };


