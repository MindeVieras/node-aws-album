
var fs = require("fs");
var AWS = require("aws-sdk");
var s3 = new AWS.S3();
var ffprobe = require('ffprobe');
var ffprobeStatic = require('ffprobe-static');

exports.handle = function(e, ctx, cb) {
  var bucket = e['bucket'];
  var srcKey = e['srcKey'];

  ffprobe('https://s3-eu-west-1.amazonaws.com/'+bucket+'/'+srcKey, { path: ffprobeStatic.path }, function (err, data) {
    
    if (err) cb(err);
    
    cb(null, data);
  });
};
