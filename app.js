// server.js

// set up ======================================================================
// get all the tools we need
var express  = require('express');
var exphbs   = require('express-handlebars');
var session  = require('express-session');
var http     = require('http');
var path     = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan   = require('morgan');
var app      = express();
var port     = process.env.PORT || 8080;

var passport = require('passport');
var flash    = require('connect-flash');

// configuration ===============================================================
// connect to our database

require('./config/passport')(passport); // pass passport for configuration



// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());

// Create `ExpressHandlebars` instance with a default layout.
const hbs = exphbs.create({
    defaultLayout: 'main',
    // helpers      : [
    //   'app/config'
    // ],
    partialsDir: [
        'views/partials/'
    ]
});

// Set template engine
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// required for passport
app.use(session({
  secret: '<3qjH{rqF,478O`b|+|M>a4H(gR-X>/2rzN*22tI|n5<nm<PU,fX~g659^8)$E;S',
  resave: true,
  saveUninitialized: true
 } )); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session


// routes ======================================================================
require('./routes/index.js')(app, passport); // load our routes and pass in our app and fully configured passport
require('./routes/login.js')(app, passport); // load our routes and pass in our app and fully configured passport

// Set static dir fir css and front js
app.use(express.static(path.join(__dirname, 'public')));

// Start HTTP server
app.set('port', process.env.PORT || 3000);
http.createServer(app).listen(app.get('port'), function(){
  console.log('Server listening on port ' + app.get('port'));
});

// const express = require('express');
// const http = require('http');
// const path = require('path');
// const exphbs = require('express-handlebars');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// const session = require('express-session');
// const Store = require('express-session').Store;
// const passport = require('passport');



// const morgan = require('morgan');

// const routes = require('./routes/index');
// const login = require('./routes/login');

// const app = express();

// // Create `ExpressHandlebars` instance with a default layout.
// const hbs = exphbs.create({
//     defaultLayout: 'main',
//     // helpers      : [
//     //   'app/config'
//     // ],
//     partialsDir: [
//         'views/partials/'
//     ]
// });

// // Set template engine
// app.engine('handlebars', hbs.engine);
// app.set('view engine', 'handlebars');

// app.use(morgan('dev')); // log every request to the console


// // Express Session
// app.use(session({
//     secret: 'secret',
//     saveUninitialized: true,
//     resave: true
// }));

// app.use(flash());

// // Passport init
// app.use(passport.initialize());
// app.use(passport.session());

// // Use all routes
// app.use('/', routes);
// app.use('/login', login);

// // Set static dir fir css and front js
// app.use(express.static(path.join(__dirname, 'public')));

// // Start HTTP server
// app.set('port', process.env.PORT || 3000);
// http.createServer(app).listen(app.get('port'), function(){
//   console.log('Server listening on port ' + app.get('port'));
// });