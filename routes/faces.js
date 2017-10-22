
const faces_model = require('../models/faces');
const config = require('../config/config');

module.exports = function(app, passport) {

  app.get('/faces', config.isAdmin, faces_model.listCollections);
  app.get('/faces/add/collection', config.isAdmin, faces_model.addCollectionForm);
  app.get('/faces/list/:collection_id', config.isAdmin, faces_model.listFaces);
};
