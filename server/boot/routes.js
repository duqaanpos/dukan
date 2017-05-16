




module.exports = function(app) {
  
  var User = app.models.owner;
  var bodyParser = require('body-parser');  
  var passport  = require('passport');
  var randomToken = require('random-token');
  var crypto = require("crypto");
  
  var mongoose = require('mongoose')
  

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(passport.initialize());

  
  app.post('/signup', function(req, res) {

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

  var flag = true;

  User.find({
    username : req.body.username
  }, function(err, user) {
    console.log(user);
    if (err) {
      console.log("err",err);
      res.send(err);
    }
 
 

          console.log(user.username);
            console.log(req.body.username);


    user.forEach(function(element) {

      if((element.username == req.body.username) && flag) {
        flag = false;
        console.log(flag);
        const id = crypto.randomBytes(16).toString("hex");
        console.log(id);  
        return res.send({success: true, userid : id ,msg: 'Authentication done.', status : '1'});
                
      }
      
    });        
   
        if (flag==true)
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



app.post('/buisness' , function(req,res) { 


  var buisness_details = {

      store_name : req.body.storename,
      retailer_type : req.body.retailer_type,
      sell_type : req.body.sell_type,
      buisness_owner : req.body.buisness_owner,
      people_no : req.body.people_no,
      buisness_age : req.body.buisness_age,
      buisness_track : req.body.buisness_track,
      buisness_interest : req.body.buisness_interest

  }



  User.findById(req.body.username, function (err, user) {
  if (err) return handleError(err);

  console.log("findbyid user",user);
  
  user.buisness_details = buisness_details;
  user.save(function (err, updatedUser) {
    if (err) return handleError(err);
    res.send(updatedUser);
  });

  });
 
 

});

}


/*

app.get("/history", function(req,res) {


  User.findbyId(req.body.username)
}


*/























  
