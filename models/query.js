
const connection = require('../config/db');

// Get media by Album ID
module.exports.getMedia = function(id, limit, cb){

  connection.query(`SELECT
                      media.*,
                      media_meta.meta_value AS datetime
                    FROM media
                      JOIN media_meta ON media.id = media_meta.media_id AND media_meta.meta_name = 'datetime'
                    WHERE status = 1 AND type_id = ? LIMIT ?`,
      
    [id,limit], function(err,rows) {
          
      if(err)
        console.log("Error Selecting : %s ",err );
        console.log(rows);
        cb(null, rows);
    }

  );
};
