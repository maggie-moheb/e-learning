// vendor libraries
var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bcrypt = require('bcrypt-nodejs');
var ejs = require('ejs');
var path = require('path');
var passport = require('passport');
var mysql = require('mysql');
var LocalStrategy = require('passport-local').Strategy;

// custom libraries
// routes
var route = require('./route');
// model
var app = express();
var mysql = require("mysql");

// First you need to create a connection to the db
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "dbUsers",
  port: '3307'
});

con.connect(function(err){
  if(err){
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

passport.use(new LocalStrategy(function(username, password, done) {
       
      var user = con.query('Select * from tblUsers where username = "'+username+'"', function(err, rows, fields) {
      
        if(err) {
          console.log(err);
           return done(null, false, {message: 'Invalid username or password'});
        }
        else {
          if(rows.length>0) {
            user = rows[0];
             if(!bcrypt.compareSync(password, user.password)) {
              return done(null, false, {message: 'Invalid username or password'});
             } else {
                return done(null, user);
              }
           

          } else {
              return done(null, user);
            }
          
         }
      });
    
   
}));
passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(cookieParser());

app.use(session({secret: 'secret strategic xxzzz code',
                saveUninitialized: true,
                resave: true}));
app.use(passport.initialize());
app.use(passport.session());

// GET
app.get('/', route.indexing);

// signin
// GET
app.get('/signin', route.signIn);

// POST
app.post('/signin', route.signInPost);

// signup
// GET
app.get('/signup', route.signUp);
// POST
app.post('/signup', route.signUpPost);

// logout
// GET
app.get('/signout', route.signOut);

/********************************/

/********************************/
// 404 not found
app.use(route.notFound404);

var server = app.listen(app.get('port'), function(err) {
   if(err) throw err;

   var message = 'Server is running @ http://localhost:' + server.address().port;
   console.log(message);
});
