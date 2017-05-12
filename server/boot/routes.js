




module.exports = function(app) {
  // Install a "/ping" route that returns "pong"
  var User = app.models.owner;
  var bodyParser = require('body-parser');  
  var passport  = require('passport');
  var randomToken = require('random-token');
  

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

  app.use(passport.initialize());


  var mongoose = require("mongoose");
  var db = mongoose.connect('mongodb://127.0.0.1:27017/duqaan');
  mongoose.connection.once('connected', function() {
  console.log("Database connected successfully")
  });



  app.get('/ping', function(req, res) {
    res.send('pong');
  });


  app.post('/signup', function(req, res) {


    console.log("hello in signup", req.body);
    if (!req.body.uid || !req.body.password  || !req.body.mobile) {

    res.json({success: false, msg: 'Please fill details again'});
  } else {


    var newUser = new User({
      uid: req.body.uid,
      password: req.body.password,
      mobile : req.body.mobile
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        console.log("err", err);
        return res.send(err);
      }
      res.json({success: true, msg: 'user is being registered'});
    });
  }
});



app.post('/authenticate', function(req,res) {

  User.findOne({
    mobile : req.body.password
  }, function(err, user) {
    if (err) throw err;
 
    if (!user) {
      res.send({success: false, msg: 'Authentication failed. User not found.'});
    } else {
      // check if mobileNo matches
        if(this.password == req.body.password)
          {          
          // if user is found and mobileNo is right create a token
            var token = random-token(16)
          // return the information including token as JSON
            res.json({success: true, token:token});
          } else {
            res.send({success: false, msg: 'Authentication failed. Wrong password.'});
            }   
        }

      });
});


app.post('/login' , function(req,res) { 

  var uid = req.body.uid;
  var password = req.body.password;

  User.findOne({uid: uid, password: password}, function(err,user) {

    if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send("not found");
    }

    return res.status(200).send("login Successful");
    });     
 

  });




}


















/*



var dsConfig = require('../datasources.json');

module.exports = function(app) {
  var User = app.models.owner;
  //var router = app.Router();

  var mongoose = require("mongoose");
  var db = mongoose.connect('mongodb://127.0.0.1:27017/duqaan');

  mongoose.connection.once('connected', function() {

  console.log("Database connected successfully")

  });



app.get('/', function(req, res) {

  console.log("hi");
  res.send('Hello! The API is at api');
});


app.post('/signup', function(req, res) {
  if (!req.body.name || !req.body.password) {
    res.json({success: false, msg: 'Please pass name and password.'});
  } else {
    var newUser = new User({
      name: req.body.name,
      password: req.body.password
    });
    // save the user
    newUser.save(function(err) {
      if (err) {
        return res.json({success: false, msg: 'Username already exists.'});
      }
      res.json({success: true, msg: 'Successful created new user.'});
    });
  }
});

}












/*app.post('/register', function(req, res) {

  var uid = req.body.uid;
  var password = req.body.password;
  var mobile = req.body.mobile;

  

}*/





















  
