
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

AWS.config.loadFromPath('./aws-keys.json');

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'media.album.mindelis.com',
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      cb(null, Date.now().toString())
    }
  })

});

//const upload_model = require('../api/upload');

module.exports = function(app, passport) {

  app.post('/upload-album-media', upload.single('file'), function( req, res, next ) {
    //console.log(req.file);

    return res.status(200).send(req.file);
  });

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

