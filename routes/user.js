
var bcrypt = require('bcrypt-nodejs');
var validator = require('validator');
var connection = require('../config/db');

module.exports = function(app, passport) {

  // =====================================
  // LOGIN ===============================
  // =====================================
  // list all users
  app.get('/users', isLoggedIn, function(req, res) {
    
    //res.send(JSON.stringify(req.flash('test')));
       
     connection.query('SELECT * FROM users',function(err,rows)     {
            
        if(err)
          console.log("Error Selecting : %s ",err );
     
          res.render('user/list', {
            //layout: false,
            users: rows,
            //message: req.flash('loginMessage')
          });
                           
      });
       
  });

  // get new user form
  app.get('/user/add', isLoggedIn, function(req, res) {
    // console.log(req.user);
    res.render('user/add');
       
  });

  // save new user
  app.post('/user/add', isLoggedIn, function(req, res) {
      //console.log(req);

      let input = JSON.parse(JSON.stringify(req.body));
      
      // vlaidate form
      if (validator.isEmpty(input.username)) {
          res.send(JSON.stringify({ack:'err', msg: 'Username is required'}));
          return false;
      }
      if (validator.isLength(input.username, {min:0, max:5})) {
          res.send(JSON.stringify({ack:'err', msg: 'Username must be at least 6 chars long'}));
          return false;
      }
      if (!validator.isEmail(input.email) && !validator.isEmpty(input.email)){
          res.send(JSON.stringify({ack:'err', msg: 'Email must be valid'}));
          return false;
      }
      if (validator.isEmpty(input.password)){
          res.send(JSON.stringify({ack:'err', msg: 'Password is required'}));
          return false;
      }
      if (!validator.equals(input.confirm_password, input.password)){
          res.send(JSON.stringify({ack:'err', msg: 'Passwords must match'}));
          return false;
      }
      //req.getConnection(function (err, connection) {
        
      let data = {
          username : input.username,
          email : input.email,
          password: bcrypt.hashSync(input.password, null, null),
          display_name: input.display_name,
          access_level: input.access_level,
          author: req.user.id,
          status: input.status
      };
      // res.send(JSON.stringify(data));  
      connection.query('INSERT INTO users set ? ',data, function(err,rows)     {
              
          if(err)
            console.log('Error Inserting : %s ',err );
          
          //req.flash('message', 'welcome key is present');
          //res.redirect('/users');
            
          res.setHeader('Content-Type', 'application/json');
          res.send(JSON.stringify({ack:'ok'}));
                             
        });
        // var query = connection.query("INSERT INTO customer set ? ",data, function(err, rows)
        // {
  
        //   if (err)
        //       console.log("Error inserting : %s ",err );
         
        //   res.redirect('/customers');
          
        // });
        
       // console.log(query.sql); get raw query
    
    //});

       
  });

  // process add new user form
  // app.post('/user/add', passport.authenticate('local-login', {
  //           successRedirect : '/', // redirect to the secure profile section
  //           failureRedirect : '/login', // redirect back to the signup page if there is an error
  //           failureFlash : true // allow flash messages
  //   }),
  //       function(req, res) {
  //           console.log("hello");

  //           if (req.body.remember) {
  //             req.session.cookie.maxAge = 1000 * 60 * 3;
  //           } else {
  //             req.session.cookie.expires = false;
  //           }
  //       res.redirect('/users');
  //   });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

