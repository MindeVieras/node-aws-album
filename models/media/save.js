
const validator = require('validator');
const moment = require('moment');
const connection = require('../../config/db');

const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');

const lambda = new AWS.Lambda();


exports.save = function(req, res){
  res.setHeader('Content-Type', 'application/json');

  var key = req.body.key;
  var org_filename = req.body.org_filename;
  var filesize = req.body.filesize;
  var mime = req.body.mime;

  let mediaData = {
      s3_key : key,
      mime: mime,
      filesize: filesize,
      org_filename : org_filename,
      content_type : 3,
      status : 0,
  };

  // Insert album data
  connection.query('INSERT INTO media set ? ', mediaData, function(err,rows){
          
      if(err) {
        return res.send(JSON.stringify({ack:'err', msg: err.code}));
      } else {
      
        var type = mime.includes('image') ? 'image' : 'video';
        
        // if image
        if(type == 'image'){
          // Get file metadata from lambda
          var params = {
            FunctionName: 'aws-album_get_image_metadata',
            //ClientContext: 'STRING_VALUE',
            Payload: '{"srcKey": "'+key+'"}',
          };
          
          lambda.invoke(params, function(err, data) {
            if (err) {
              return res.send(JSON.stringify({ack:'ok', id: rows.insertId, msg: 'can\'t load lambda'}));
            }
            else if (data.Payload == 'null') {
              return res.send(JSON.stringify({ack:'ok', id: rows.insertId, msg: 'can\'t get image metadata'}));
            }
            else {

              // insert metadata in database
              var metadata = JSON.parse(data.Payload);
              var values = [];
              
              // make image meta array
              var imgKeys = ['Make', 'Model', 'Orientation'];
              imgKeys.forEach(function (key) {
                let obj = metadata.image[key];
                values.push([rows.insertId, key, obj]);
                
              });
              // make exif array
              var exifKeys = ['ISO', 'Flash', 'DateTimeOriginal', 'ExifImageWidth', 'ExifImageHeight'];
              exifKeys.forEach(function (key) {
                if (key == 'DateTimeOriginal') {
                  var obj = convertExifDate(metadata.exif[key]);
                } else {
                  var obj = metadata.exif[key];
                }
                
                values.push([rows.insertId, key, obj]);
                
              });

              // make DB query
              var sql = "INSERT INTO media_meta (media_id, meta_name, meta_value) VALUES ?";
              connection.query(sql, [values], function(err) {
                if (err) {
                  return res.send(JSON.stringify({ack: 'ok', id: rows.insertId,  msg: 'cant save meta'}));
                } else {
                  return res.send(JSON.stringify({ack: 'ok', id: rows.insertId,  msg: 'all meta saved'}));
                }
                  
                
                });
              // return res.send(JSON.stringify({ack: 'ok', a: values, b: metadata.length}));
              //return res.send(data.Payload);
            }

          });
          //return res.send(JSON.stringify({ack: 'ok', id: rows.insertId}));

        }

        // if video
        else {
          return res.send(JSON.stringify({ack:'err', msg: 'video uploaded'}));
        }
      }
    });

  
};

function convertExifDate(date){
    if(date){
        var dateTime = date.split(' ');
        var regex = new RegExp(':', 'g');
        dateTime[0] = dateTime[0].replace(regex, '-');
        if(typeof date === 'undefined' || !date){
            var newDateTime = '';
        } else {
            var newDateTime = dateTime[0] + ' ' + dateTime[1];
        }
        return newDateTime;
    } else {
        return '';
    }

};

// // Gets add user template
// exports.add = function(req, res){
//     res.render('album/add', {
//       title: 'Add new album',
//       user: req.user
//     });
// };

// // Gets edit user template
// exports.edit = function(req, res){

//     let id = req.params.id;

//     connection.query('SELECT * FROM users WHERE id = ?',[id],function(err,rows)
//       {
            
//         if(err)
//             console.log("Error Selecting : %s ",err );
 
//         res.render('user/edit', {
//           title: 'Edit user',
//           user: req.user,
//           saved_user: rows[0] 
//         });            
//     });
// };

// // Saves user
// exports.save = function(req, res){
    
//     let input = JSON.parse(JSON.stringify(req.body));
//     let albumId = input.id;
//     //res.send(JSON.stringify({ack:'err', msg: 'Start date required'}));
//     // vlaidate form
//     if (validator.isEmpty(input.name)) {
//         res.send(JSON.stringify({ack:'err', msg: 'Name is required'}));
//         return false;
//     }
//     if (validator.isLength(input.name, {min:0, max:2})) {
//         res.send(JSON.stringify({ack:'err', msg: 'Name must be at least 3 chars long'}));
//         return false;
//     }

//     //req.getConnection(function (err, connection) {

//     let data = {
//         name : input.name,
//         start_date : input.start_date,
//         end_date : input.end_date,
//         body : input.body
//     };

//     // res.send(JSON.stringify(data));
//     // return false;
//     if (albumId) {
//       //res.send(JSON.stringify(data));
//       delete data.author;
//       delete data.password;
//       connection.query('UPDATE users set ? WHERE id = ?', [data, albumId], function(err,rows)     {
              
//           if(err)
//             console.log('Error saving user : %s ',err );

//           res.send(JSON.stringify({ack:'ok'}));
//           return false;
                             
//         });
//     } else {
//       connection.query('INSERT INTO albums set ? ',data, function(err,rows)     {
              
//           if(err)
//             console.log('Error saving user : %s ',err );

//           res.send(JSON.stringify({ack:'ok'}));
//           return false;
                             
//         });
//     }
// };
