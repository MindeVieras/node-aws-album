
module.exports = function(app, passport) {

  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function(req, res) {
    // render the page and pass in any flash data if it exists
    console.log(process.env.HOME);
    res.render('login', {
      layout: false,
      message: req.flash('loginMessage')
    });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
    }),
        function(req, res) {
            console.log("hello");

            if (req.body.remember) {
              req.session.cookie.maxAge = 1000 * 60 * 3;
            } else {
              req.session.cookie.expires = false;
            }
        res.redirect('/');
    });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
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
