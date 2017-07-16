
const validator = require('validator');
const moment = require('moment');
const connection = require('../config/db');

// Gets users list
exports.list = function(req, res){
   connection.query('SELECT * FROM albums',function(err,rows)     {
          
      if(err)
        console.log("Error Selecting : %s ",err );
   
        res.render('album/list', {
          title: 'All albums',
          albums: rows,
          user: req.user
          //message: req.flash('loginMessage')
        });
                         
    });
};

// Gets add user template
exports.add = function(req, res){
    res.render('album/add', {
      title: 'Add new album',
      user: req.user
    });
};

// Gets edit user template
exports.edit = function(req, res){

    let id = req.params.id;

    connection.query('SELECT * FROM users WHERE id = ?',[id],function(err,rows)
      {
            
        if(err)
            console.log("Error Selecting : %s ",err );
 
        res.render('user/edit', {
          title: 'Edit user',
          user: req.user,
          saved_user: rows[0] 
        });            
    });
};

// Saves user
exports.save = function(req, res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    //let userId = input.id;
    //res.send(JSON.stringify({ack:'err', msg: 'Start date required'}));
    // vlaidate form
    if (validator.isEmpty(input.name)) {
        res.send(JSON.stringify({ack:'err', msg: 'Name is required'}));
        return false;
    }
    if (validator.isLength(input.name, {min:0, max:2})) {
        res.send(JSON.stringify({ack:'err', msg: 'Name must be at least 3 chars long'}));
        return false;
    }

    //req.getConnection(function (err, connection) {

    let data = {
        name : input.name,
        start_date : input.start_date,
        end_date : input.end_date,
        // password: bcrypt.hashSync(input.password, null, null),
        // display_name: input.display_name,
        // access_level: input.access_level,
        // author: req.user.id,
        // status: input.status
    };

    res.send(JSON.stringify(data));
    return false;
    // if (userId) {
    //   //res.send(JSON.stringify(data));
    //   delete data.author;
    //   delete data.password;
    //   connection.query('UPDATE users set ? WHERE id = ?', [data, userId], function(err,rows)     {
              
    //       if(err)
    //         console.log('Error saving user : %s ',err );

    //       res.send(JSON.stringify({ack:'ok'}));
                             
    //     });
    // } else {
    //   connection.query('INSERT INTO users set ? ',data, function(err,rows)     {
              
    //       if(err)
    //         console.log('Error saving user : %s ',err );

    //       res.send(JSON.stringify({ack:'ok'}));
                             
    //     });
    // }
};

// module.exports.getUserByUsername = function(username, callback){
//  var query = {username: username};
//  User.findOne(query, callback);
// }

// module.exports.createUser = function(newUser, callback){
//  bcrypt.genSalt(10, function(err, salt) {
//      bcrypt.hash(newUser.password, salt, function(err, hash) {
//          newUser.password = hash;
//          newUser.save(callback);
//      });
//  });
// }

// module.exports.getUserByUsername = function(username, callback){
//  var query = {username: username};
//  User.findOne(query, callback);
// }

// module.exports.getUserById = function(id, callback){
//  User.findById(id, callback);
// }

// module.exports.comparePassword = function(candidatePassword, hash, callback){
//  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
//      if(err) throw err;
//      callback(null, isMatch);
//  });
// }