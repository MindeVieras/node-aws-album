
const connection = require('../config/db');

// Get media by Album ID
module.exports.getMedia = function(id, cb){

   connection.query('SELECT * FROM media WHERE status = 1 AND type_id = ?', [id], function(err,rows) {
          
      if(err)
        console.log("Error Selecting : %s ",err );
        //console.log(rows);
        cb(null, rows);

    });
};