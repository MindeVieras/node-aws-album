
const connection = require('../config/db');

// Get media by Album ID
module.exports.getMedia = function(id, limit, cb){

  connection.query(`SELECT
                      m.*,
                      dt.meta_value AS datetime
                    FROM media AS m
                      LEFT JOIN media_meta AS dt ON m.id = dt.media_id AND dt.meta_name = 'datetime'
                    WHERE m.status = 1 AND m.type_id = ? LIMIT ?`,
      
    [id,limit], function(err,rows) {
          
      if(err) console.log(err);
      else
        cb(null, rows);
    }

  );
};
