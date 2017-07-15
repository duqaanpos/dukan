




module.exports = function(app) {

  var User = app.models.owner;
  var Transaction = require('../../common/models/transaction.js');
  var Customer = require('../../common/models/customer.js');
 // var employee =  app.models.employee;
  var bodyParser = require('body-parser');
  var passport  = require('passport');
//var randomToken = require('random-token');
//  var crypto = require("crypto");

  var mongoose = require('mongoose');
//  var hash = require("password-hash");
  var crypto = require("crypto");
  var mongoose = require("mongoose");
  mongoose.Promise = require('bluebird');


  var bcrypt = require('bcryptjs');
  var SALT_WORK_FACTOR = 10;
  const uuidV1 = require('uuid/v1');
  var   uuidv4 = require('uuid-v4');
  var buisness_flag = true;

  app.use(bodyParser.json()); // for parsing application/json
  app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
  app.use(passport.initialize());



  app.post('/signup', function(req, res) {

    var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    var hash = bcrypt.hashSync(req.body.password, salt);

    var _id = uuidv4();

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
      service_list : [],
      monthly_total : 0,
      daily_total : 0,
      annual_total : 0,
      credit_total : 0

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


     buisness_flag = false;
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

  var employee_list = req.body.employee_list;

    for(i=0;i < employee_list.length;i++) {
      console.log(employee_list[i]);
      console.log(uuidv4());
       employee_list[i].id = uuidv4();
    }


  var buisness_details = {

      store_name : req.body.storename,
      retailer_type : req.body.retailer_type,
      sell_type : req.body.sell_type,
      buisness_owner : req.body.buisness_owner,
      employee_list : req.body.employee_list,
      buisness_age : req.body.buisness_age,
      buisness_track : req.body.buisness_track,
      buisness_interest : req.body.buisness_interest

  }

  User.findById(req.body.id, function (err, user) {
  if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

  console.log(user);

  user.buisness_details = buisness_details;
  user.employee_list = req.body.employee_list;
  buisness_flag = true;
  user.save(function (err, updatedUser) {
    if(err) {
      console.log(err);
      return res.status(500).send("err");
    }
    res.send({success : true,msg: 'buisness details have been saved',status:'1'})
  });

  });

});

app.post('/serviceRegister', function(req,res) {

  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }

console.log(req.body)

 var _id = uuidV1();

 var service =  {
      id : _id,
      category : req.body.category.toLowerCase(),
      sub_category : req.body.sub_category.toLowerCase(),
      rate :req.body.rate,
      volume : req.body.volume

    }


//console .log(req.body)
//console.log(service)
//console.log(user);

   if(user.service_list == [])
    user.service_list = [service];
   else
    user.service_list.push(service);

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

 if (req.body.category){
   console.log("wah")
   if (req.body.category == "hair")
   var cat = "hair"
   else if (req.body.category == "beard")
   cat = "beard"
   else if (req.body.category == "face")
   cat = "face"
   else if (req.body.category == "body")
   cat = "body"
   else
   return res.status(404).send({success: false, msg: 'category does not match',status:'0'});

   var service_list1
   var service_list = [] //= user.service_list //= user.service_list[1]
   var i=j=0
   console.log (cat)
   console.log(service_list)
   for(i = 0; i < user.service_list.length ; i++){
     if (user.service_list[i].category == cat){
       service_list.push(user.service_list[i])
     }
   }
  res.send({success : true, service_list:service_list,msg: 'service list',status:'1'})
 }
else
 res.send({success : true, service_list:user.service_list,msg: 'service list',status:'1'})

  });


});


app.post('/transaction', function(req,res) {

  var txn_amount =req.body.totalBill;
  var txn_id = uuidv4();
 // console.log(txn_id);
  var cust_id = uuidv4();
 // console.log(cust_id);

 var id = mongoose.Types.ObjectId();
 var ObjectID = require('mongodb').ObjectID;
 console.log(id);
 var ifCustomerExists = "false";

  var newTransaction = new Transaction({
      _id : txn_id,
      user_id : req.body.id,
      itemsList : req.body.itemsList,
      txn_amount : req.body.totalBill,
      cust_id : cust_id,
      timestamp : req.body.timestamp,
      emp_id : req.body.employee.emp_id,
      mode_of_payment : req.body.mode_of_payment,
      payableAmount : req.body.payableAmount,
      discount : req.body.discount,
      totalBill : req.body.totalBill,
      payByCash : req.body.payByCash,
      payByCredit : req.body.payByCredit

    });



  var newCustomer = new Customer({
    _id : id,
    txn_id : txn_id,
    cust_name : req.body.customerInfo.name,
    contact_no : req.body.customerInfo.contact_no,
    age : req.body.customerInfo.age,
    gender : req.body.customerInfo.gender,
    totalCredit : 0

  });

  Customer.findOne(
      {"contact_no" : req.body.customerInfo.contact_no})
      .then(function(person){

    if(person){
        ifCustomerExists = "true";
      //  console.log(ifCustomerExists);
        person.totalCredit = person.totalCredit + req.body.payByCredit;
     //   console.log(person.totalCredit);
        person.save(function (err, updatedperson) {
          if(err) {
            console.log(err);
            return res.status(500).send("err");
         }
        // console.log(updatedperson);
      });
    }

   if(ifCustomerExists == "false") {

    newCustomer.save()
    .then(function(createdCustomerObject){
     // console.log("createdCustomerObject");
     // console.log(createdCustomerObject);

       if(createdCustomerObject) {
        Customer.findById(id, function(err, customer) {

        if(err) {
        console.log(err);
        return res.status(500).send("err");
        }
    //    console.log("in customer by id");
      //  console.log(customer);


      if(!customer) {
       return res.status(404).send({success: false, msg: 'customer not found',status:'0'});
      }

       if(req.body.mode_of_payment == 'credit') {

        customer.totalCredit = customer.totalCredit + req.body.payByCredit;

      //  console.log(customer.totalCredit);

       customer.save(function (err, updatedCustomer) {
          if(err) {
            console.log(err);
            return res.status(500).send("err");
         }
       //  console.log(updatedCustomer);
    //  res.send({success : true,user:updatedUser,msg: 'service is being saved',status:'1'})
       });
      }

       });
      }
    });
  }
});


  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

    if(!user) {
    return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }

 //  console.log(user);

   user.daily_total += txn_amount;
   user.monthly_total += txn_amount;

   if(req.body.mode_of_payment == 'credit')
      user.credit_total = user.credit_total + req.body.payByCredit;
    console.log(user.credit_total);

   user.employee_list.forEach(function(employee) {

    if(req.body.employee.emp_id == employee.emp_id)
      employee.txn_amount += txn_amount;

   });


    user.save(function (err, updatedUser) {
       if(err) {
        console.log(err);
        return res.status(500).send("err");
     }

   //  console.log(updatedUser);
  //  res.send({success : true,user:updatedUser,msg: 'service is being saved',status:'1'})
    });

  });

  newTransaction.save(function(err, createdTransObject) {
      if (err) {
        console.log("err in signup", err);
        if(err.code == 11000)
          return res.send("duplicate key error")
        else
        return res.send(err);
      }

     res.json({user:createdTransObject,success: true, msg: 'Transaction saved',status : "1"});

  });


});


app.post('/employeelist',function(req,res) {


  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

  if(!user) {
    return res.status(404).send({success: false, msg: 'id does not matched',status:'0'});
    }

 res.send({success : true, employee_list:user.employee_list,msg: 'employee list',status:'1'})

    });

});

app.post('/customerInfo', function(req,res) {


  var cust_id = uuidV1();

  var newCustomer = new customer({
    id : cust_id,
    txn_id : req.body.txn_id,
    cust_name : req.body.name,
    contact_no : req.body.contact_no,
    age : req.body.age,
    gender : req.body.gender,
    totalCredit : 0

  });

  newCustomer.save(function(err, createdCustomerObject) {

        if (err) {
        console.log("err in signup", err);
        if(err.code == 11000)
          return res.send("duplicate key error")
        else
        return res.send(err);
      }
     res.json({user:createdCustomerObject,success: true, msg: 'Customer saved',status : "1"});

  });




});


}
