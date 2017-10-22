
const user_model = require('../models/user');
const config = require('../config/config');

module.exports = function(app, passport) {

  app.get('/users', config.isAdmin, user_model.list);
  app.get('/user/add', config.isAdmin, user_model.add);
  app.get('/user/edit/:id', config.isAdmin, user_model.edit);
  app.post('/user/add', config.isAdmin, user_model.save);

};