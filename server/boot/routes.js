




module.exports = function(app) {
  
  var User = app.models.owner;
  var bodyParser = require('body-parser');  
  var passport  = require('passport');
  var randomToken = require('random-token');
  
  var mongoose = require('mongoose')
  

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(passport.initialize());

  
  app.post('/signup', function(req, res) {

  //  if (!req.body.uid || !req.body.password  || !req.body.mobile) {

 //   res.json({success: false, msg: 'Please fill details again'});
 // } else {


    var newUser = new User({
      username: req.body.username,
      password: req.body.password,
      mobile : req.body.mobile,
      fullName : req.body.fullName,
      shopNo : req.body.shopNo,
      street : req.body.street,
      state : req.body.state,
      city : req.body.city,
      pincode : req.body.pincode

    });

  
    // save the user
    newUser.save(function(err, createdUserObject) {
      if (err) {
        console.log("err in signup", err);
        if(err.code == 11000)
          return res.send("duplicate key error")
        else
        return res.send(err);
      }

    res.json({user:createdUserObject,success: true, msg: 'user is being registered',status : "1"});

    }); 
    
    
  
  });


  app.post('/signup/checkUsername',function(req,res) {

    var flag = true;
    console.log(req.body.username);

    if(!req.body.username)
      return res.send("undefined username");

    if(!req.body.username)
      res.json({success: false, msg: 'Please fill details again',status : '1'});

    User.find({
    username : req.body.username
    },function(err, user) {

   console.log(user);

    if (err) {
        console.log("err", err);
         return res.send(err);
      } 
 
    user.forEach(function(element) {

      if((element.username == req.body.username) && flag) {
        flag = false;
        console.log(flag);
        return res.send({success: true, msg: 'Username exists', status : '1'});
                
      }
              
    });    
      
      if(flag == true)
        return res.send({success: false, msg: 'Username does not exists', status : '0'});


   });

  });  


app.post('/authenticate', function(req,res) {

  User.findOne({
    username : req.body.username
  }, function(err, user) {
    console.log(user);
    if (err) {
      console.log("err",err);
      res.send(err);
    }
 
  //  if (!user) {
    // 
   // } else 

          console.log(user.username);
            console.log(req.body.username);
      // check if mobileNo matches
        if(user.username === req.body.username)
          {                   
          // if user is found and mobileNo is right create a token
           // var token = random-token(16)
          // return the information including token as JSON
            return res.json({success: true,msg: 'Authentication done',status:'1'});
          } 

        return res.json({success: false, msg: 'Authentication failed. User not found.',status:'0'});
        

      });
});


app.post('/login' , function(req,res) { 

  var username = req.body.username;
  var password = req.body.password;

  User.find({username: username, password: password}, function(err,user) {

    if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send("user not found");
    }

    return res.status(200).send({user : user, msg: 'login Successful',status:'0'})

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





















  
