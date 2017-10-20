
const mediaSave = require('../models/media/save');
const faces = require('../models/faces');
const mediaTrash = require('../models/media/trash');

module.exports = function(app, passport) {

  app.post('/api/media/save', isAuthed, mediaSave.save);
  app.post('/api/media/save-exif', isAuthed, mediaSave.saveExif);
  app.post('/api/media/generate-thumb', isAuthed, mediaSave.generateThumb);
  app.post('/api/media/rekognition-labels', isAuthed, mediaSave.rekognitionLabels);
  app.post('/api/media/generate-videos', isAuthed, mediaSave.generateVideos);
  app.post('/api/media/save-video-meta', isAuthed, mediaSave.saveVideoMeta);
  app.post('/api/media/attach', isAuthed, mediaSave.attachMedia);

  app.post('/api/media/move-to-trash', isAuthed, mediaTrash.moveToTrash);
  app.post('/api/media/hard-delete', isAdmin, mediaTrash.hardDelete);
  app.post('/api/media/trash-recover', isAdmin, mediaTrash.recover);

  app.post('/api/faces/index', isAdmin, faces.indexFaces);
  app.post('/api/faces/add-new-collection', isAdmin, faces.addNewCollection);
  app.post('/api/faces/delete-collection', isAdmin, faces.deleteCollection);
  app.post('/api/faces/delete-face', isAdmin, faces.deleteFace);

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

