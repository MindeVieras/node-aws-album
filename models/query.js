
const connection = require('../config/db');

// Get media by Album ID
module.exports.getMedia = function(id, limit, cb){

  connection.query(`SELECT
                      *
                    FROM media
                    WHERE status = 1 AND type_id = ? LIMIT ?`,
      
    [id,limit], function(err,rows) {
          
      if(err)
        console.log("Error Selecting : %s ",err );
        console.log(rows);
        cb(null, rows);
    }

  );
};
