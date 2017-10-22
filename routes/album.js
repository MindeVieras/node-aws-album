
const album_model = require('../models/album');
const config = require('../config/config');

module.exports = function(app, passport) {

  app.get('/', config.isAuthed, album_model.list);
  app.get('/album/add', config.isAuthed, album_model.add);
  app.get('/album/edit/:id', config.isAuthed, album_model.edit);
  app.post('/album/add', config.isAuthed, album_model.save);

};
