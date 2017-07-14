
module.exports = function(app, passport) {

  // =====================================
  // LOGIN ===============================
  // =====================================
  // list all users
  app.get('/users', function(req, res) {
    // render the page and pass in any flash data if it exists
    console.log(process.env.HOME);
    res.render('login', {
      layout: false,
      message: req.flash('loginMessage')
    });
  });

  // process add new user form
  app.post('/user/add', passport.authenticate('local-login', {
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
        res.redirect('/users');
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

