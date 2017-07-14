// var mysql = require('mysql');

// var connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password : 'root',
//   database:'album'
// });

// connection.connect(function(err) {
//     if (err) throw err;
// });

// module.exports = connection;

// config/database.js
module.exports = {
    'connection': {
        'host': 'localhost',
        'user': 'root',
        'password': 'root'
    },
  'database': 'album',
    'users_table': 'users'
};