
const path =require('path');
const AWS = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');
const config = require('../config/config');

AWS.config.loadFromPath('./aws-keys.json');

const s3 = new AWS.S3();

const upload = multer({
  storage: multerS3({
    s3: s3,
    serverSideEncryption: 'AES256',
    bucket: config.bucket,
    metadata: function (req, file, cb) {
      cb(null, {fieldName: file.fieldname});
    },
    key: function (req, file, cb) {
      // get file extention
      rand = Math.floor((Math.random() * 9999999) + 1);
      ext = path.extname(file.originalname);
      cb(null, 'media/'+Date.now().toString()+'-'+rand+ext.toLowerCase());
    }
  })

});

//const upload_model = require('../api/upload');

module.exports = function(app, passport) {

  app.post('/upload-media', upload.single('file'), function( req, res, next ) {
    //console.log(req.file);
    let responseFile = {
      key: req.file.key
    };

    // return res.status(200).send(responseFile);
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

