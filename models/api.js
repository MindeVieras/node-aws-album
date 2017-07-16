
const validator = require('validator');
const moment = require('moment');
const connection = require('../config/db');

// Gets users list
exports.upload = function(req, res){
    

    res.send(JSON.stringify({ack:'err', msg: 'Name is required'}));
    return false;
   // connection.query('SELECT * FROM albums',function(err,rows)     {
          
   //    if(err)
   //      console.log("Error Selecting : %s ",err );
   
   //      res.render('album/list', {
   //        title: 'All albums',
   //        albums: rows,
   //        user: req.user
   //        //message: req.flash('loginMessage')
   //      });
                         
   //  });
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
