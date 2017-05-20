




module.exports = function(app) {
  
  var User = app.models.owner;
 // var Services = app.models.services;
  var bodyParser = require('body-parser');  
  var passport  = require('passport');
//var randomToken = require('random-token');
//  var crypto = require("crypto");
  
  var mongoose = require('mongoose');
//  var hash = require("password-hash");
  var crypto = require("crypto");


  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  const uuidV1 = require('uuid/v1');
  var buisness_flag = false;  

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(passport.initialize());

  
  app.post('/signup', function(req, res) {

    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    var hash = bcrypt.hashSync(req.body.password, salt);

    var _id = uuidV1(); 

      var newUser = new User({
      id : _id,
      username: req.body.username.toLowerCase(),
      password: hash,
      mobile : req.body.mobile,
      fullName : req.body.fullName,
      shopNo : req.body.shopNo,
      street : req.body.street,
      state : req.body.state,
      city : req.body.city,
      pincode : req.body.pincode,


    }); // Generate a salt

      
    // save the user
    newUser.save(function(err, createdUserObject) {
      if (err) {
        console.log("err in signup", err);
        if(err.code == 11000)
          return res.send("duplicate key error")
        else
        return res.send(err);
      }

    res.json({user:createdUserObject,_id : _id,success: true, msg: 'user is being registered',status : "1"});

    }); 
    
    
  
  });


  app.post('/signup/checkUsername',function(req,res) {

    var flag = true;
    console.log(req.body.username);

    if(!req.body.username)
      return res.send("undefined username");

    if(!req.body.username)
      res.json({success: false, msg: 'Please fill details again',status : '0'});

    User.find({
    username : req.body.username
    },function(err, user) {

   console.log(user);

    if (err) {
        console.log("err", err);
         return res.send(err);
      } 
 
    user.forEach(function(element) {

      if((element.username == req.body.username.toLowerCase()) && flag) {
        flag = false;
        console.log(flag);
        return res.send({success: true, msg: 'Username exists', status : '1'});
                
      }
              
    });    
      
      if(flag == true)
        return res.send({success: false, msg: 'Username does not exists', status : '0'});

   });

  });  



app.post('/authenticate' , function(req,res) { 
 

 console.log(req.body.password);

 var flag = true;
 var authUser = {};

 // var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
   //var hash1 = bcrypt.hashSync(req.body.password, salt);

  // console.log(hash1);

   console.log(req.body.username);

   User.find({username:req.body.username.toLowerCase()}, function (err, user) {

    if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }

    //console.log(user);

    user.forEach(function(element) {

      
      if((element.username == req.body.username.toLowerCase()) && flag) {
                
       
       console.log(element.password);
       //console.log(hash);
       var result  = bcrypt.compareSync(req.body.password,element.password);
      
         if(result) {

          flag = false;
          authUser = element;
          console.log(flag);
          
      }
     }
           
    });

    if(!flag)      
       return res.send({success : true,buisness_flag : buisness_flag,user:authUser,_id : authUser.id,msg: 'login Successful',status:'1'});
      else return res.send({success: false,buisness_flag :buisness_flag, msg: 'password not matched',status:'0'});

  });    
   
 

});



app.post('/business' , function(req,res) { 


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


  User.findById(req.body.id, function (err, user) {
  if (err) return handleError(err);

  console.log(user);
  
  user.buisness_details = buisness_details;
  buisness_flag = true;
  user.save(function (err, updatedUser) {
    if (err) return handleError(err);
    res.send({success : true,msg: 'buisness details have been saved',status:'1'})
  });

  });
 
 

});



app.post('/serviceRegister', function(req,res) {

 var _id = uuidV1(); 
/*
      var newService = new Services({
      id : _id,
      category : req.body.category,
      sub_category1 : req.body.sub_category1,
      sub_category2 : req.body.sub_category2,
      rate :req.body.rate,
      volume : req.body.volume

    }); // Generate a salt

      
    // save 
    newService.save(function(err, createdServiceObject) {
      if (err) {
        console.log("err in signup", err);
        if(err.code == 11000)
          return res.send("duplicate key error")
        else
        return res.send(err);
      }

//    res.json({service:createdServiceObject,_id : _id,success: true, msg: 'service created',status : "1"});

    }); 
*/

   var service =  {
      id : _id,
      category : req.body.category,
      sub_category1 : req.body.sub_category1,
      sub_category2 : req.body.sub_category2,
      rate :req.body.rate,
      volume : req.body.volume

    }


  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }

   console.log(user);  

   if(user.service_list[0] != null)
    user.service_list.push(service);
   else user.service_list = [service];


  user.save(function (err, updatedUser) {
     if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    res.send({success : true,user:updatedUser,msg: 'service is being saved',status:'1'})
  });

  });



});


app.post('/servicelist',function(req,res) {


  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

  if(!user) {
    return res.status(404).send({success: false, msg: 'id does not matched',status:'0'});
    }

 res.send({success : true, service_list:user.service_list,msg: 'service list',status:'1'})
  



});


});




}






















  
