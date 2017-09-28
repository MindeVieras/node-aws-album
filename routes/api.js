
const mediaSave = require('../models/media/save');
const mediaTrash = require('../models/media/trash');

module.exports = function(app, passport) {

  app.post('/api/media/save', mediaSave.save);
  app.post('/api/media/save-exif', mediaSave.saveExif);
  app.post('/api/media/generate-thumb', mediaSave.generateThumb);
  app.post('/api/media/rekognition-labels', mediaSave.rekognitionLabels);
  app.post('/api/media/attach', mediaSave.attachMedia);
  app.post('/api/media/move-to-trash', isAdmin, mediaTrash.moveToTrash);
  app.post('/api/media/hard-delete', isAdmin, mediaTrash.hardDelete);
  app.post('/api/media/trash-recover', isAdmin, mediaTrash.recover);
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

