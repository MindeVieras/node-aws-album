
const connection = require('../../config/db');

// Gets trash list
exports.list = function(req, res){
   connection.query('SELECT * FROM media WHERE status = 2',function(err,rows)     {
          
      if(err)
        console.log("Error Selecting : %s ",err );
   
        res.render('utils/trash', {
          title: 'Trash',
          media: rows,
          user: req.user
        });
                         
    });
};

// Move media to trash
exports.moveToTrash = function(req, res){
    connection.query('UPDATE media set status = 2 WHERE id = ?', req.body.id, function(err, rows){
            
        if(err) return res.send(JSON.stringify({ack: 'err', msg: err.code}));

        return res.send(JSON.stringify({ack: 'ok', msg: 'Moved to trash'}));
          
    });
};

// Recover media file from trash
exports.recover = function(req, res){

    connection.query('UPDATE media set status = 1 WHERE id = ?', req.body.id, function(err, rows){

        if(err) return res.send(JSON.stringify({ack: 'err', msg: err.code}));

        if(rows.changedRows == 0) return res.send(JSON.stringify({ack: 'err', msg: 'Cannot find album'}));

        return res.send(JSON.stringify({ack: 'ok', msg: 'Madia file recovered'}));
    
    });
};

// Completely remove media file from system
exports.hardDelete = function(req, res){
    return res.send(JSON.stringify({ack: 'ok', id: req.body.id}));
    // let mediaData = {
    //     status: 2
    // };

    // // Update media database entry to move to trash
    // connection.query('UPDATE media set status = 2 WHERE id = ?', req.body.id,  function(err,rows){
            
    //     if(err) throw err
    //         console.log(rows);
    //       return res.send(JSON.stringify({ack: 'ok', id: 9}));
          
    // });
};
