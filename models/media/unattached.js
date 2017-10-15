
const connection = require('../../config/db');
const deleteFromS3 = require('./delete_from_s3');

// Gets unattached media list
exports.list = function(req, res){
   connection.query('SELECT * FROM media WHERE status = 0',function(err,rows)     {
          
      if(err)
        console.log("Error Selecting : %s ",err );
   
        res.render('utils/unattached', {
          title: 'Unattached media',
          media: rows,
          user: req.user,
          device: req.device.type
        });
                         
    });
};
