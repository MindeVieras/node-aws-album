
const mediaSave = require('../models/media/save');

module.exports = function(app, passport) {

  // app.post('/api/get-image-exif', api.get_image_exif);
  app.post('/api/save-media', mediaSave.save);
  // app.get('/user/edit/:id', isAdmin, user_model.edit);
  // app.post('/user/add', isAdmin, user_model.save);

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

