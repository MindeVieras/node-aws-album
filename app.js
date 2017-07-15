const port = process.env.PORT || 3000;
const http = require('http');
const path = require('path');
const express = require('express');
const exphbs = require('express-handlebars');
const helpers = require('handlebars-helpers')();
const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const app = express();

//console.log(helpers);
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
    helpers: helpers,
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
 } ));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// routes
require('./routes/index')(app, passport);
require('./routes/login')(app, passport);
require('./routes/album')(app, passport);
require('./routes/user')(app, passport);

// Set static dir dir css and front js
app.use(express.static(path.join(__dirname, 'public')));

// Start HTTP server
http.createServer(app).listen(port, function(){
  console.log('Server listening on port ' + port);
});
