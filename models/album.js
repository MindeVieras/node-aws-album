
const validator = require('validator');
const moment = require('moment');
const connection = require('../config/db');
const query = require('./query');

// Gets albums list
exports.list = function(req, res){

  let footer_buttons = '<a href="/album/add" class="btn btn-sm btn-success">New Album</a>';

  if(req.user.access_level === 100) {
    var sql = 'SELECT * FROM albums';
  } else {
    var sql = 'SELECT * FROM albums WHERE uid = '+connection.escape(req.user.id);
  }

  connection.query(sql, function(err,rows)     {
          
    if(err)
      console.log("Error Selecting : %s ",err );
 
      res.render('album/list', {
        title: 'All albums',
        albums: rows,
        user: req.user,
        footer_buttons: footer_buttons
      });
                         
    });
};

// Gets add album template
exports.add = function(req, res){

  let footer_buttons = '<button id="save-button" data-function="Album.addAlbum" class="btn btn-sm btn-success">Save</button>';
  
  res.render('album/add', {
    title: 'Add new album',
    user: req.user,
    footer_buttons: footer_buttons
  });
};

// Gets edit album template
exports.edit = function(req, res){

  let id = req.params.id;

  let footer_buttons = '<button disabled="disabled" id="save-button" data-function="Album.addAlbum" class="btn btn-sm btn-success">Update</button>';

  if(req.user.access_level === 100) {
    var sql = 'SELECT * FROM albums WHERE id = '+connection.escape(id);
  } else {
    var sql = 'SELECT * FROM albums WHERE id = '+connection.escape(id)+' AND uid = ' + connection.escape(req.user.id);
  }

  connection.query(sql, function(err,rows){
          
    if(err) return res.send('SQL error: '+err.code);
    console.log(rows);
    if(rows[0] != null) {    
      query.getMedia(id, 1000, function(err, media){
        res.render('album/edit', {
          title: 'Edit album \''+rows[0]['name']+'\'',
          user: req.user,
          saved_album: rows[0],
          media: media,
          footer_buttons: footer_buttons
        });
      });
    } else {

      res.render('errors/access_denied', {
        title: 'Unauthorized',
        user: req.user
      });

    }
  });
};

// Saves album
exports.save = function(req, res){

    let input = JSON.parse(JSON.stringify(req.body));
    let albumId = input.id;

    if (validator.isEmpty(input.name)) {
        return res.send(JSON.stringify({ack:'form_err', msg: 'Name is required'}));
    }
    if (validator.isLength(input.name, {min:0, max:2})) {
        return res.send(JSON.stringify({ack:'form_err', msg: 'Name must be at least 3 chars long'}));
    }
    if (validator.isLength(input.start_date)) {
        return res.send(JSON.stringify({ack:'form_err', msg: 'Start date required'}));
    }
    if (validator.isLength(input.end_date)) {
        return res.send(JSON.stringify({ack:'form_err', msg: 'End date required'}));
    }

    let albumData = {
        name : input.name,
        start_date : input.start_date,
        end_date : input.end_date,
        body : input.body,
        uid : req.user.id
    };

    if (albumId) {

      // Update album data
      connection.query('UPDATE albums set ? WHERE id = ?', [albumData, albumId], function(err,rows)     {
              
        if(err) return res.send(JSON.stringify({ack:'err', msg: err.code}));
        console.log(rows);
        return res.send(JSON.stringify({ack:'ok', id: albumId, msg: 'Album \''+albumData.name+'\' updated'}));
        
        });
    
    } else {

      // Insert new album data
      connection.query('INSERT INTO albums set ? ', albumData, function(err,rows) {
        
        if(err) return res.send(JSON.stringify({ack:'err', msg: err.code}));
        
        return res.send(JSON.stringify({ack:'ok', id: rows.insertId, msg: 'Album \''+albumData.name+'\' added'}));
      
      });
    }
};
