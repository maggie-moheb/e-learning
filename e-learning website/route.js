// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var mysql = require('mysql');
// custom library
// model
var Model = require('./models/patient');
// index
var index = function(req, res, next) {
   if(!req.isAuthenticated()) {
      res.redirect('/signin');
   } else {

      var user = req.user;

      if(user !== undefined) {
         user = user.toJSON();
      }
      res.render('index', {title: 'Home', user: user});
   }
};
// sign in
// GET
var signIn = function(req, res, next) {
   if(req.isAuthenticated()) res.redirect('/');
   res.render('signin', {title: 'Sign In'});
};
// sign in
// POST
var signInPost = function(req, res, next) {
   passport.authenticate('local', { successRedirect: '/',
                          failureRedirect: '/signin'}, function(err, user, info) {
      if(err) {
         return res.render('signin', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('signin', {title: 'Sign In', errorMessage: info.message});
      }
      return req.logIn(user, function(err) {
         if(err) {
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
         } else {
            return res.redirect('/');
         }
      });
   })(req, res, next);
};
// sign up
// GET
var signUp = function(req, res, next) {
   if(req.isAuthenticated()) {
      res.redirect('/');
   } else {
      res.render('signup', {title: 'Sign Up'});
   }
};
// sign up
// POST
var signUpPost = function(req, res, next) {
   var user = req.body;
   var usernamePromise = null;
   console.log(user.email);
   tempPatient = new Model.Patient({email: "maggie", password: "Mugz"});
   console.log(tempPatient);
   var con = mysql.createConnection({
     host: 'localhost',
     port: '3307',
     user: 'root',
     password: '',
     database: 'bachelor'
   });

   con.connect(function(err){
     if(err){
       console.log('Error connecting to Db');
       return;
     }
     console.log('Connection established');
   });

   usernamePromise = con.query('Select * from patients where email = "'+user.email+'"',function(err,rows){
      if(err) throw err;

      console.log('Data received from Db:\n');
      console.log(rows);
       if(rows.length != 0) {
         console.log("It already exists");
         res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
      }
      console.log("It does not exist");
      var password = user.password;
      console.log(password);
      var hash = bcrypt.hashSync(password);
      console.log(hash);
      con.query('Insert into patients set email = "'+ user.email+'", password = "'+hash+'"');
      //var signUpUser = new Model.Patient({email: user.email, password: hash});

      // signUpUser.save().then(function(model) {
            // sign in the newly registered user
         signInPost(req, res, next);
     // });  
   });
   //console.log(usernamePromise);
  
   
   // return usernamePromise.then(function(model) {
   //    if(model) {
   //    	console.log("It already exists");
   //       res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
   //    } else {

   //       //****************************************************//
   //       // MORE VALIDATION GOES HERE(E.G. PASSWORD VALIDATION)
   //       //****************************************************//
   //       console.log("It does not exist");
   //       var password = user.password;
   //       var hash = bcrypt.hashSync(password);

   //       var signUpUser = new Model.Patient({email: user.email, password: hash});

   //       signUpUser.save().then(function(model) {
   //          // sign in the newly registered user
   //          signInPost(req, res, next);
   //       });	
   //    }
   // });
};
// sign out
var signOut = function(req, res, next) {
   if(!req.isAuthenticated()) {
      notFound404(req, res, next);
   } else {
      req.logout();
      res.redirect('/signin');
   }
};
// 404 not found
var notFound404 = function(req, res, next) {
   res.status(404);
   res.render('404', {title: '404 Not Found'});
};
// export functions
/**************************************/
// index
module.exports.index = index;

// sigin in
// GET
module.exports.signIn = signIn;
// POST
module.exports.signInPost = signInPost;

// sign up
// GET
module.exports.signUp = signUp;
// POST
module.exports.signUpPost = signUpPost;

// sign out
module.exports.signOut = signOut;

// 404 not found
module.exports.notFound404 = notFound404;
