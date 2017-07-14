
module.exports = function(app, passport) {

  // =====================================
  // HOME PAGE (with login links) ========
  // =====================================
  app.get('/', isLoggedIn, function(req, res) {
    res.render('home'); // load the index.ejs file
  });

};

// route middleware to make sure
function isLoggedIn(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}











// const express = require('express');
// const router = express.Router();
// const passport = require('passport');
// const LocalStrategy = require('passport-local').Strategy;
// const connection = require('../config/db');

// // Get login
// router.get('/', function(req, res){
//   //console.log(req.route);
//   res.render('login', {layout: false});
// });

// passport.use('local', new LocalStrategy({

//   usernameField: 'minde',

//   passwordField: 'Minde123',

//   passReqToCallback: true //passback entire req to call back
//   } , function (req, username, password, done){

//       console.log('jungiaso');
//       if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }

//       var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';

//       connection.query("select * from users where username = ?", [username], function(err, rows){

//           console.log(err); console.log(rows);

//         if (err) return done(req.flash('message',err));

//         if(!rows.length){ return done(null, false, req.flash('message','Invalid username.')); }

//         salt = salt+''+password;

//         var encPassword = crypto.createHash('sha1').update(salt).digest('hex');


//         var dbPassword  = rows[0].password;

//         if(!(dbPassword == encPassword)){

//             return done(null, false, req.flash('message','Invalid password.'));

//          }

//         return done(null, rows[0]);

//       });

//     }

// ));
// //console.log(passport);

// router.post('/',
//   passport.authenticate('local', {successRedirect:'/', failureRedirect:'/login'}),
//   function(req, res) {
//     res.redirect('/');
//   });


// module.exports = router;
