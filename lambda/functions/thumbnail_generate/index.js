
var async = require("async");
var AWS = require("aws-sdk");
var fs = require("fs");
var mktemp = require("mktemp");

exports.handle = function(e, ctx, cb) {

  console.log(AWS);
  console.log('object source key: %j', e.key);
  cb(null, { hello: 'world' });

};
// var async = require("async");
// var AWS = require("aws-sdk");
// var gm = require("gm").subClass({imageMagick: true});
// var fs = require("fs");
// var mktemp = require("mktemp");

// var THUMB_KEY_PREFIX = "thumbnails/",
//     THUMB_WIDTH = 300,
//     THUMB_HEIGHT = 300,
//     ALLOWED_FILETYPES = ['png', 'jpg', 'jpeg', 'bmp', 'tiff', 'pdf', 'gif'];

// var utils = {
//   decodeKey: function(key) {
//     return decodeURIComponent(key).replace(/\+/g, ' ');
//   }
// };


// var s3 = new AWS.S3();


// exports.handler = function(event, context) {
//   var bucket = event.Records[0].s3.bucket.name,
//   srcKey = utils.decodeKey(event.Records[0].s3.object.key),
//   dstKey = THUMB_KEY_PREFIX + srcKey.replace(/\.\w+$/, ".jpg"),
//   fileType = srcKey.match(/\.\w+$/);

//   if(srcKey.indexOf(THUMB_KEY_PREFIX) === 0) {
//     return;
//   }

//   if (fileType === null) {
//     console.error("Invalid filetype found for key: " + srcKey);
//     return;
//   }

//   fileType = fileType[0].substr(1);

//   if (ALLOWED_FILETYPES.indexOf(fileType) === -1) {
//     console.error("Filetype " + fileType + " not valid for thumbnail, exiting");
//     return;
//   }

//   async.waterfall([

//     function download(next) {
//         //Download the image from S3
//         s3.getObject({
//           Bucket: bucket,
//           Key: srcKey
//         }, next);
//       },

//       function createThumbnail(response, next) {
//         var temp_file, image;

//         if(fileType === "pdf") {
//           temp_file = mktemp.createFileSync("/tmp/XXXXXXXXXX.pdf")
//           fs.writeFileSync(temp_file, response.Body);
//           image = gm(temp_file + "[0]");
//         } else if (fileType === 'gif') {
//           temp_file = mktemp.createFileSync("/tmp/XXXXXXXXXX.gif")
//           fs.writeFileSync(temp_file, response.Body);
//           image = gm(temp_file + "[0]");
//         } else {
//           image = gm(response.Body);
//         }

//         image.size(function(err, size) {
//           /*
//            * scalingFactor should be calculated to fit either the width or the height
//            * within 150x150 optimally, keeping the aspect ratio. Additionally, if the image 
//            * is smaller than 150px in both dimensions, keep the original image size and just 
//            * convert to png for the thumbnail's display
//            */
//           var scalingFactor = Math.min(1, THUMB_WIDTH / size.width, THUMB_HEIGHT / size.height),
//           width = scalingFactor * size.width,
//           height = scalingFactor * size.height;

//           this.resize(width, height)
//           .toBuffer("jpg", function(err, buffer) {
//             if(temp_file) {
//               fs.unlinkSync(temp_file);
//             }

//             if (err) {
//               next(err);
//             } else {
//               next(null, response.contentType, buffer);
//             }
//           });
//         });
//       },

//       function uploadThumbnail(contentType, data, next) {
//         s3.putObject({
//           Bucket: bucket,
//           Key: dstKey,
//           Body: data,
//           ContentType: "image/jpg",
//           ACL: 'public-read',
//           Metadata: {
//             thumbnail: 'TRUE'
//           }
//         }, next);
//       }

//       ],
//       function(err) {
//         if (err) {
//           console.error(
//             "Unable to generate thumbnail for '" + bucket + "/" + srcKey + "'" +
//             " due to error: " + err
//             );
//         } else {
//           console.log("Created thumbnail for '" + bucket + "/" + srcKey + "'");
//         }

//         context.done();
//       });
// };





// dependencies
// var async = require('async');
// var path = require('path');
// var AWS = require('aws-sdk');
// var gm = require('gm').subClass({
//     imageMagick: true
// });
// var util = require('util');
// // get reference to S3 client
// var s3 = new AWS.S3();
// exports.handler = function(event, context) {
//     // Read options from the event.
//     console.log("Reading options from event:\n", util.inspect(event, {
//         depth: 5
//     }));
//     var srcBucket = event.Records[0].s3.bucket.name;
//     // Object key may have spaces or unicode non-ASCII characters.
//     var srcKey = decodeURIComponent(event.Records[0].s3.object.key.replace(
//         /\+/g, " "));
//     var dstBucket = "thumbs.album.mindelis.com";
//     // Sanity check: validate that source and destination are different buckets.
//     if (srcBucket == dstBucket) {
//         console.error("Destination bucket must not match source bucket.");
//         return;
//     }
//     var _800px = {
//         width: 800,
//         dstnKey: srcKey,
//         destinationPath: "large"
//     };
//     var _500px = {
//         width: 500,
//         dstnKey: srcKey,
//         destinationPath: "medium"
//     };
//     var _200px = {
//         width: 200,
//         dstnKey: srcKey,
//         destinationPath: "small"
//     };
//     var _45px = {
//         width: 45,
//         dstnKey: srcKey,
//         destinationPath: "thumbnail"
//     };
//     var _sizesArray = [_800px, _500px, _200px, _45px];
//     var len = _sizesArray.length;
//     console.log(len);
//     console.log(srcBucket);
//     console.log(srcKey);
//     // Infer the image type.
//     var typeMatch = srcKey.match(/\.([^.]*)$/);
//     var fileName = path.basename(srcKey);
//     if (!typeMatch) {
//         console.error('unable to infer image type for key ' + srcKey);
//         return;
//     }
//     var imageType = typeMatch[1].toLowerCase();
//     if (imageType != "jpg" && imageType != "gif" && imageType != "png" &&
//         imageType != "eps") {
//         console.log('skipping non-image ' + srcKey);
//         return;
//     }
//     // Transform, and upload to same S3 bucket but to a different S3 bucket.
//     async.forEachOf(_sizesArray, function(value, key, callback) {
//         async.waterfall([

//             function download(next) {
//                 console.time("downloadImage");
//                 console.log("download");
//                 // Download the image from S3 into a buffer.
//                 // sadly it downloads the image several times, but we couldn't place it outside
//                 // the variable was not recognized
//                 s3.getObject({
//                     Bucket: srcBucket,
//                     Key: srcKey
//                 }, next);
//                 console.timeEnd("downloadImage");
//             },
//             function convert(response, next) {
//                 // convert eps images to png
//                 console.time("convertImage");
//                 console.log("Reponse content type : " +
//                     response.ContentType);
//                 console.log("Conversion");
//                 gm(response.Body).antialias(true).density(
//                     300).toBuffer('JPG', function(err,
//                     buffer) {
//                     if (err) {
//                         //next(err);
//                         next(err);
//                     } else {
//                         console.timeEnd(
//                             "convertImage");
//                         next(null, buffer);
//                         //next(null, 'done');
//                     }
//                 });
//             },
//             function process(response, next) {
//                 console.log("process image");
//                 console.time("processImage");
//                 // Transform the image buffer in memory.
//                 //gm(response.Body).size(function(err, size) {
//                 gm(response).size(function(err, size) {
//                     //console.log("buf content type " + buf.ContentType);
//                     // Infer the scaling factor to avoid stretching the image unnaturally.
//                     console.log("run " + key +
//                         " size array: " +
//                         _sizesArray[key].width);
//                     console.log("run " + key +
//                         " size : " + size);
//                     console.log(err);
//                     var scalingFactor = Math.min(
//                         _sizesArray[key].width /
//                         size.width, _sizesArray[
//                             key].width / size.height
//                     );
//                     console.log("run " + key +
//                         " scalingFactor : " +
//                         scalingFactor);
//                     var width = scalingFactor *
//                         size.width;
//                     var height = scalingFactor *
//                         size.height;
//                     console.log("run " + key +
//                         " width : " + width);
//                     console.log("run " + key +
//                         " height : " + height);
//                     var index = key;
//                     //this.resize({width: width, height: height, format: 'jpg',})
//                     this.resize(width, height).toBuffer(
//                         'JPG', function(err,
//                             buffer) {
//                             if (err) {
//                                 //next(err);
//                                 next(err);
//                             } else {
//                                 console.timeEnd(
//                                     "processImage"
//                                 );
//                                 next(null,
//                                     buffer,
//                                     key);
//                                 //next(null, 'done');
//                             }
//                         });
//                 });
//             },
//             function upload(data, index, next) {
//                 console.time("uploadImage");
//                 console.log("upload : " + index);
//                 console.log("upload to path : /images/" +
//                     _sizesArray[index].destinationPath +
//                     "/" + fileName.slice(0, -4) +
//                     ".jpg");
//                 // Stream the transformed image to a different folder.
//                 s3.putObject({
//                     Bucket: dstBucket,
//                     Key: "images/" + _sizesArray[
//                             index].destinationPath +
//                         "/" + fileName.slice(0, -4) +
//                         ".jpg",
//                     Body: data,
//                     ContentType: 'JPG'
//                 }, next);
//                 console.timeEnd("uploadImage");
//             }
//         ], function(err, result) {
//             if (err) {
//                 console.error(err);
//             }
//             // result now equals 'done'
//             console.log("End of step " + key);
//             callback();
//         });
//     }, function(err) {
//         if (err) {
//             console.error('---->Unable to resize ' + srcBucket +
//                 '/' + srcKey + ' and upload to ' + dstBucket +
//                 '/images' + ' due to an error: ' + err);
//         } else {
//             console.log('---->Successfully resized ' + srcBucket +
//                 ' and uploaded to' + dstBucket + "/images");
//         }
//         context.done();
//     });
// };
