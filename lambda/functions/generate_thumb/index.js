// dependencies
var async = require('async');
var AWS = require('aws-sdk');
var gm = require('gm').subClass({ imageMagick: true });
var path = require('path');

// constants    
var VERSIONS = [
    {width: 125, height: 125, name: "icon"},
    {width: 400, height: 400, name: "small"},
    {width: 640, height: 480, name: "medium"},
    {width: 1280, height: 720, name: "hd"},
    {width: 1600, height: 1200, name: "large"},
    {width: 1920, height: 1080, name: "fullhd"},
    {width: 3840, height: 2160, name: "uhd"}
];

// get reference to S3 client
var s3 = new AWS.S3();

exports.handle = function(event, context, callback) {
    // Read options from the event.
    var srcBucket = "media.album.mindelis.com";
    var srcKey = decodeURIComponent(event['srcKey'].replace(/\+/g, " "));
    var dstBucket = "media.album.mindelis.com";

    // Infer the image type.
    var typeMatch = srcKey.match(/\.([^.]*)$/);
    if (!typeMatch) {
        callback("Could not determine the image type.");
        return;
    }
    var imageType = typeMatch[1];
    if (imageType != "jpg" && imageType != "png") {
        callback('Unsupported image type: ${imageType}');
        return;
    }

    // Download the image from S3, transform, and upload to a different S3 bucket.
    async.waterfall([
        function download(next) {
            // Download the image from S3 into a buffer.
            s3.getObject({
                Bucket: srcBucket,
                Key: srcKey
            },
            next);
        },
        function transform(response, next) {
            gm(response.Body).size(function(err, size) {
                var self = this;

                var createVersion = function(versions, ind, buffers) {
                    if (ind === versions.length) {
                        next(null, response.ContentType, buffers);
                        return;
                    }

                    // Infer the scaling factor to avoid stretching the image unnaturally.
                    var scalingFactor = Math.min(versions[ind].width / size.width, versions[ind].height / size.height);
                    var width   = scalingFactor * size.width;
                    var height = scalingFactor * size.height;

                    self.quality(100).resize(width, height).toBuffer(imageType, function(err, buffer) {
                        if (err) next(err);
                        else {
                            buffers.push(buffer);
                            createVersion(versions, ind + 1, buffers);
                        }
                    });
                }

                // Transform the image buffer in memory.
                var buffers = [];
                createVersion(VERSIONS, 0, buffers);
            });
        },
        function upload(contentType, buffers, next) {
            // Stream the transformed image to a different S3 bucket.
            var putFile = function(versions, ind) {
                if (ind === versions.length - 1) cb = next;
                else cb = function() { putFile(versions, ind + 1); };

                s3.putObject({
                    Bucket: dstBucket,
                    Key: "thumbs/" + versions[ind].name + "/" + path.basename(srcKey),
                    Body: buffers[ind],
                    ACL: "public-read",
                    ContentType: contentType
                }, cb);
            };

            putFile(VERSIONS, 0);
        }
    ], function (err) {
        if (err) {
            console.error(
                'Unable to resize ' + srcBucket + '/' + srcKey +
                ' and upload to ' + dstBucket + '/' + srcKey +
                ' due to an error: ' + err
            );
        } else {
            console.log(
                'Successfully resized ' + srcBucket + '/' + srcKey +
                ' and uploaded to ' + dstBucket + '/' + srcKey
            );
        }

        callback(null, VERSIONS);
    }
);
};