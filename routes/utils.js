
const trash = require('../models/media/trash');
const unattachedMedia = require('../models/media/unattached');
const config = require('../config/config');

module.exports = function(app, passport) {

  app.get('/trash', config.isAdmin, trash.list);
  app.get('/unattached-media', config.isAdmin, unattachedMedia.list);

};
