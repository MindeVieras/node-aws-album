
const trash_model = require('../models/media/trash');

module.exports = function(app, passport) {

  app.get('/trash', isAuthed, trash_model.list);

};

// route middleware to make sure
function isAuthed(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}