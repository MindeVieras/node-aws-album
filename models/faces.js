
const path = require('path');
const validator = require('validator');
const AWS = require('aws-sdk');
AWS.config.loadFromPath('./aws-keys.json');
const rekognition = new AWS.Rekognition();
const config = require('../config/config');
const connection = require('../config/db');

module.exports.detect = function(key, cb){

    var params = {
        Image: {
            S3Object: {
                Bucket: config.bucket, 
                Name: key
            }
        },
        Attributes: ["ALL"]
    };

    rekognition.detectFaces(params, function(err, data) {
        if (err) console.log(err, err.stack);
        else cb(null, data);
    });

};

// Index all rekognized faces to AWS
module.exports.indexFaces = function(req, res){

    let key = JSON.parse(JSON.stringify(req.body.key));
    
    var params = {
        CollectionId: config.faces_collection,
        Image: {
            S3Object: {
                Bucket: config.bucket,
                Name: key
            }
        },
        DetectionAttributes: ['ALL'],
        ExternalImageId: path.basename(key)
    };

    rekognition.indexFaces(params, function(err, data) {
      if (err) return res.send(JSON.stringify({ack:'err', msg: err.message}));
      else return res.send(JSON.stringify({ack:'ok', msg: data}));
    });
};

// Gets face collections list
exports.listCollections = function(req, res){

  var params = {
  };
  
  rekognition.listCollections(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {

      let footer_buttons = '<a href="/faces/add/collection" data-remote="/faces/add/collection" class="btn btn-sm btn-success">New Collection</a>';

      res.render('faces/collections', {
        title: 'Faces collections',
        user: req.user,
        collections: data.CollectionIds,
        footer_buttons: footer_buttons,
        device: req.device.type
      });
    }
  });

};

// Gets faces list from collection
exports.listFaces = function(req, res){

  var params = {  
    CollectionId: req.params.collection_id, 
    MaxResults: 20
  };
  
  rekognition.listFaces(params, function(err, data) {
    if (err) {
      console.log(err, err.stack)
    } else {
      
      let footer_buttons = '<a href="/faces/add/collection" data-remote="/faces/add/collection" class="btn btn-sm btn-success">New Collection</a>';

      res.render('faces/list', {
        title: 'Faces list',
        user: req.user,
        faces: data.Faces,
        collection_id: req.params.collection_id,
        footer_buttons: footer_buttons,
        device: req.device.type
      });
    }
  });

};

// Deletes face form collection
exports.deleteFace = function(req, res){

    let collectionId = JSON.parse(JSON.stringify(req.body.collection_id));
    let faceId = JSON.parse(JSON.stringify(req.body.face_id));

    var params = {
      CollectionId: collectionId, 
      FaceIds: [faceId]
    };
    
    rekognition.deleteFaces(params, function(err, data) {
      if (err) return res.send(JSON.stringify({ack:'err', msg: err.message}));
      else return res.send(JSON.stringify({ack:'ok', msg: 'Face deleted'}));
    });
};

// Adds new collection form to AWS
exports.addCollectionForm = function(req, res){

  res.render('faces/add_collection', {
    layout: false,
    title: 'Add new collection to AWS',
    user: req.user,
    device: req.device.type
  });
};

// Adds new collection form to AWS
exports.addNewCollection = function(req, res){

    let collectionId = JSON.parse(JSON.stringify(req.body.collection_id));

    if (validator.isEmpty(collectionId)) {
        return res.send(JSON.stringify({ack:'form_err', msg: 'Collection ID is required'}));
    }
    
    var params = {
      CollectionId: collectionId
    };

    rekognition.createCollection(params, function(err, data) {
      if (err) return res.send(JSON.stringify({ack:'err', msg: err.message}));
      else return res.send(JSON.stringify({ack:'ok', msg: data}));
    });
};

// Deletes collection form AWS
exports.deleteCollection = function(req, res){

    let collectionId = JSON.parse(JSON.stringify(req.body.collection_id));
    
    var params = {
      CollectionId: collectionId
    };

    rekognition.deleteCollection(params, function(err, data) {
      if (err) return res.send(JSON.stringify({ack:'err', msg: err.message}));
      else return res.send(JSON.stringify({ack:'ok', msg: 'Collection deleted'}));
    });
};

