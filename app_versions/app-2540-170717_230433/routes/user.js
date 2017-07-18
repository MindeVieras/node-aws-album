
const user_model = require('../models/user');

module.exports = function(app, passport) {

  app.get('/users', isAdmin, user_model.list);
  app.get('/user/add', isAdmin, user_model.add);
  app.get('/user/edit/:id', isAdmin, user_model.edit);
  app.post('/user/add', isAdmin, user_model.save);

};

// route middleware to make sure
function isAdmin(req, res, next) {

  // if user is authenticated in the session, carry on
  if (req.isAuthenticated() && req.user.access_level === 100)
    return next();

  // if they aren't redirect them to the home page
  res.redirect('/login');
}

