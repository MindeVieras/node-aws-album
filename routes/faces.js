
const faces_model = require('../models/faces');

module.exports = function(app, passport) {

  app.get('/faces', isAdmin, faces_model.listCollections);
  app.get('/faces/add/collection', isAdmin, faces_model.addCollectionForm);
  // app.get('/album/add', isAdmin, album_model.add);
  // app.get('/album/edit/:id', isAdmin, album_model.edit);
  // app.post('/album/add', isAdmin, album_model.save);

};

// route middleware to make sure
function isAuthed(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated())
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}
// route middleware to make sure
function isAdmin(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user.access_level === 100)
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

