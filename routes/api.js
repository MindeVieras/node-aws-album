
const media = require('../models/media/media');
const faces = require('../models/faces');
const trash = require('../models/media/trash');
const config = require('../config/config');

module.exports = function(app, passport) {

  app.post('/api/media/save', config.isAuthed, media.save);
  app.post('/api/media/save-exif', config.isAuthed, media.saveExif);
  app.post('/api/media/generate-thumb', config.isAuthed, media.generateThumb);
  app.post('/api/media/rekognition-labels', config.isAuthed, media.rekognitionLabels);
  app.post('/api/media/generate-videos', config.isAuthed, media.generateVideos);
  app.post('/api/media/save-video-meta', config.isAuthed, media.saveVideoMeta);
  app.post('/api/media/attach', config.isAuthed, media.attachMedia);
  app.post('/api/media/get-image-url', config.isAuthed, media.getImageUrl);
  app.post('/api/media/get-video-url', config.isAuthed, media.getVideoUrl);

  app.post('/api/media/move-to-trash', config.isAuthed, trash.moveToTrash);
  app.post('/api/media/hard-delete', config.isAdmin, trash.hardDelete);
  app.post('/api/media/trash-recover', config.isAdmin, trash.recover);

  app.post('/api/faces/index', config.isAdmin, faces.indexFaces);
  app.post('/api/faces/add-new-collection', config.isAdmin, faces.addNewCollection);
  app.post('/api/faces/delete-collection', config.isAdmin, faces.deleteCollection);
  app.post('/api/faces/delete-face', config.isAdmin, faces.deleteFace);

};
