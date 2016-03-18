// vendor library
var passport = require('passport');
var bcrypt = require('bcrypt-nodejs');
var mysql = require("mysql");

//GET
var indexing = function(req, res, next) {
	console.log('Hello index');
   if(!req.isAuthenticated()) {
      res.redirect('/signin');
   } else {

      var user = req.user;

      // if(user !== undefined) {
      //    user = user.toJSON();
      // }
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
   console.log(req.body);
  // console.log(res.body );
  var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "dbUsers",
	  port: '3307'
	});
  con.connect(function(err){
  if(err){
    console.log('Error connecting to Db sign in');
    return;
  }
  console.log('Connection established sign in');
});
   passport.authenticate('local',{ successRedirect: '/',
   								   failureRedirect: '/signin'}
   	,function(err, user, info) {
   		console.log('In the authentication');
      if(err) {
      	 //console.log("I am in signin post");
      	 console.log(err);
         return res.render('signin', {title: 'Sign In', errorMessage: err.message});
      } 

      if(!user) {
         return res.render('signin', {title: 'Sign In', errorMessage: info.message});
      }
      

      return req.logIn(user, function(err) {
      		console.log('inside the log in ');
      		 con.end(function(err) {
		 console.log('Connection ended safely sign in');
	});
         if(err) {
         	// console.log('User should log in now');
            return res.render('signin', {title: 'Sign In', errorMessage: err.message});
         } else {
         	//console.log('user should be redirected now');
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
	console.log('I am in sign up post now');
	var con = mysql.createConnection({
	  host: "localhost",
	  user: "root",
	  password: "",
	  database: "dbUsers",
	  port: '3307'
	});
	con.connect(function(err){
	  if(err){
	    console.log('Error connecting to Db sign up');
	    return;
	  }
	  console.log('Connection established sign up');
	});
   	var user = req.body;
  	queryBody = 'Select * from tblUsers where username = "'+ user.username +'"';
   	console.log(queryBody);
   	usernamePromise = con.query(queryBody, function(err, rows, fields) { 
  
		if(rows.length > 0) {
        	res.render('signup', {title: 'signup', errorMessage: 'username already exists'});
   		} else {
   			console.log("no error");
   			var password = user.password;
         	var hash = bcrypt.hashSync(password);
         	var signUpUser = con.query('Insert into tblUsers (username, password) values ("'+ user.username +'","' +hash +'")', 
         		function(err, rows, fields) {
	         		if(err) {
	         			console.log('Error signing up');
	         			res.render('signup', {title: 'signup', errorMessage: 'Error signing up'});
	         		}
	         		else {
	         			console.log('user is signed up successfully');
	         			//res.render('signin', {title: 'signin', errorMessage: 'You have signed up successfully'});
	         			signInPost(req, res, next);
	         		}
	         	});
		        con.end(function(err) {
					console.log('Connection ended safely signup');
				});
				
	   		
   		}
   });
  
 
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
module.exports.indexing = indexing;

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