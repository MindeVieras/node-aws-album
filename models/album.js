
const validator = require('validator');
const moment = require('moment');
const connection = require('../config/db');
const query = require('./query');

//const AWS = require('aws-sdk');

// Gets users list
exports.list = function(req, res){
   connection.query('SELECT * FROM albums',function(err,rows)     {
          
      if(err)
        console.log("Error Selecting : %s ",err );
   
        res.render('album/list', {
          title: 'All albums',
          albums: rows,
          user: req.user
          //message: req.flash('loginMessage')
        });
                         
    });
};

// Gets add user template
exports.add = function(req, res){
    res.render('album/add', {
      title: 'Add new album',
      user: req.user
    });
};

// Gets edit user template
exports.edit = function(req, res){

    let id = req.params.id;

    connection.query('SELECT * FROM albums WHERE id = ?', [id], function(err,rows){
            
      if(err) {
        console.log("Error Selecting : %s ",err );
      }
      else {
        query.getMedia(id, function(err, media){
          //console.log(media);

          res.render('album/edit', {
            title: 'Edit album',
            user: req.user,
            saved_album: rows[0],
            media: media
          });
        });
      }
    });
};

// Saves album
exports.save = function(req, res){
    
    let input = JSON.parse(JSON.stringify(req.body));
    let albumId = input.id;

    if (validator.isEmpty(input.name)) {
        return res.send(JSON.stringify({ack:'err', msg: 'Name is required'}));
    }
    if (validator.isLength(input.name, {min:0, max:2})) {
        return res.send(JSON.stringify({ack:'err', msg: 'Name must be at least 3 chars long'}));
    }

    let albumData = {
        name : input.name,
        start_date : input.start_date,
        end_date : input.end_date,
        body : input.body
    };

    if (albumId) {

      connection.query('UPDATE albums set ? WHERE id = ?', [albumData, albumId], function(err,rows)     {
              
        if(err) {
            return res.send(JSON.stringify({ack:'err', msg: err.code}));
          } else {
            return res.send(JSON.stringify({ack:'ok', id: albumId}));
          }
                             
        });
    
    } else {

      // Insert album data
      connection.query('INSERT INTO albums set ? ', albumData, function(err,rows)     {
        if(err) {
          return res.send(JSON.stringify({ack:'err', msg: err.code}));
        } else {
          return res.send(JSON.stringify({ack:'ok', id: rows.insertId}));
        }
                             
      });
    }
};
