
module.exports = function(app, passport) {
  app.get('/', isAuthed, function(req, res) {
    res.render('home', {
      user: req.user,
      device: req.device.type
    });
  });

};

// route middleware to make sure
function isAuthed(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}


