
const media = require('../models/media/media');
const faces = require('../models/faces');
const trash = require('../models/media/trash');

module.exports = function(app, passport) {

  app.post('/api/media/save', isAuthed, media.save);
  app.post('/api/media/save-exif', isAuthed, media.saveExif);
  app.post('/api/media/generate-thumb', isAuthed, media.generateThumb);
  app.post('/api/media/rekognition-labels', isAuthed, media.rekognitionLabels);
  app.post('/api/media/generate-videos', isAuthed, media.generateVideos);
  app.post('/api/media/save-video-meta', isAuthed, media.saveVideoMeta);
  app.post('/api/media/attach', isAuthed, media.attachMedia);
  app.post('/api/media/get-image-url', isAuthed, media.getImageUrl);
  app.post('/api/media/get-video-url', isAuthed, media.getVideoUrl);

  app.post('/api/media/move-to-trash', isAuthed, trash.moveToTrash);
  app.post('/api/media/hard-delete', isAdmin, trash.hardDelete);
  app.post('/api/media/trash-recover', isAdmin, trash.recover);

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

