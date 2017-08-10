




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
  var business_flag = true;

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
      sales :{
        day:0,
        month:0,
        year:0,
        daily_total : 0,
        daily_orders : 0,
        monthly_total : 0,
        monthly_orders : 0,
        annual_total : 0,
        annual_orders : 0
      },
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


     business_flag = false;
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
       return res.send({success : true,business_flag : business_flag,user:authUser,_id : authUser.id,msg: 'login Successful',status:'1'});
      else return res.send({success: false,business_flag :business_flag, msg: 'password does not match',status:'0'});

  });



});



app.post('/business' , function(req,res) {

  var employee_list = req.body.employee_list;

    for(i=0;i < employee_list.length;i++) {
      console.log(employee_list[i]);
      console.log(uuidv4());
       employee_list[i].emp_id = uuidv4();
       employee_list[i].txn_amount = 0;
    }


  var business_details = {

      store_name : req.body.storename,
      retailer_type : req.body.retailer_type,
      sell_type : req.body.sell_type,
      business_owner : req.body.business_owner,
      employee_list : req.body.employee_list,
      business_age : req.body.business_age,
      business_track : req.body.business_track,
      business_interest : req.body.business_interest

  }

  User.findById(req.body.id, function (err, user) {
  if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

  console.log(user);

  user.business_details = business_details;
  user.employee_list = req.body.employee_list;
  business_flag = true;
  user.save(function (err, updatedUser) {
    if(err) {
      console.log(err);
      return res.status(500).send("err");
    }
    res.send({success : true,msg: 'business details have been saved',status:'1'})
  });

  });

});

app.post('/serviceRegister', function(req,res) {
console.log(req.body)
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
    return res.status(404).send({success: false, msg: 'id does not match',status:'0'});
    }

 if (req.body.category){
   console.log("wah")
   if (req.body.category == "hair")
   var cat = "hair"
   else if (req.body.category == "beard")
   cat = "beard"
   else if (req.body.category == "face")
   cat = "face"
   else if (req.body.category == "nails")
   cat = "nails"
   else if (req.body.category == "body")
   cat = "body"
   else
   return res.status(404).send({success: false, msg: 'category does not match',status:'0'});

   var service_list1
   var service_list = [] //= user.service_list //= user.service_list[1]
   var i=j=0
   //console.log (cat)
   //console.log(service_list)
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
    user_id : req.body.id,
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

   var dateObj = new Date();
   var month = dateObj.getUTCMonth() + 1; //months from 1-12
   var day = dateObj.getUTCDate();
   var year = dateObj.getUTCFullYear();
   console.log(day,month,year);
   console.log(user.daily_total);
   if(user.sales.day == day)
     {
       user.sales.daily_orders += 1;
       user.sales.daily_total += txn_amount;
     }
   else
    {
       user.sales.day = day;
       user.sales.daily_orders = 1;
       user.sales.daily_total = txn_amount;
     }
   if(user.sales.month == month)
     {
       user.sales.monthly_orders += 1;
       user.sales.monthly_total += txn_amount;
     }
   else
     {
        user.sales.month = month;
        user.sales.monthly_orders = 1;
        user.sales.monthly_total = txn_amount;
     }
   if(user.sales.year == year)
     {
       user.sales.annual_orders += 1;
       user.sales.annual_total += txn_amount;
     }
   else
     {
       user.sales.year = year;
       user.sales.annual_orders = 1;
       user.sales.annual_total = txn_amount;
     }

   if(req.body.mode_of_payment == 'credit')
      user.credit_total = user.credit_total + req.body.payByCredit;
    console.log(user.credit_total);

  console.log(req.body.employee);
   user.employee_list.forEach(function(employee) {
    console.log(employee);
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

app.post('/transactionlist', function(req,res) {

  if (req.body.emp_id){
    Transaction.find({"user_id" : req.body.id,
                       "emp_id" : req.body.emp_id},
                       function(err, transactionlist){
      if(err) {
         console.log('Employee Transactions');
         console.log(err);
         return res.status(500).send("err");
       }
      return res.send({success: true, 'Employee_Transactions' : transactionlist, msg: 'Employee Transactions', status : '1'});
    });
  }
  else if (req.body.cust_id)
  {
    Transaction.find({"user_id" : req.body.id,
                       "cust_id" : req.body.cust_id},
                       function(err, transactionlist){
      if(err) {
         console.log('Customer Transactions');
         console.log(err);
         return res.status(500).send("err");
       }
      return res.send({success: true, 'Customer_Transactions' : transactionlist, msg: 'Customer Transactions', status : '1'});
    });
  }
  else if (req.body.txn_id)
  {
    Transaction.find({"user_id" : req.body.id,
                       "_id" : req.body.txn_id},
                       function(err, transactionlist){
      if(err) {
         console.log('No such transaction');
         console.log(err);
         return res.status(500).send("err");
       }
      return res.send({success: true, 'Transaction_Details' : transactionlist, msg: 'Transaction_Details', status : '1'});
    });
  }
else
{
  Transaction.find({"user_id" : req.body.id}, function(err, transactionlist){
    if(err) {
       console.log('transactionlist');
       console.log(err);
       return res.status(500).send("err");
     }
    console.log(transactionlist);
    return res.send({success: true, 'transactionist' : transactionlist, msg: 'Transaction List', status : '1'});
  });
 }
});




app.post('/employeelist',function(req,res) {


  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }

  if(!user) {
    return res.status(404).send({success: false, msg: 'id does not match',status:'0'});
    }

  if(req.body.emp_id){
    //var employee_list = [];
    for(i=0;i < user.employee_list.length;i++) {
       if(user.employee_list[i].emp_id == req.body.emp_id)
          return res.send({success : true, employee_details:user.employee_list[i],msg: 'employee details',status:'1'});

    }
    return res.status(404).send({success : false,msg: 'No such employee',status:'0'});
   }
   else {
     var employee_list = [];

     for(i=0;i < user.employee_list.length;i++) {
        if(user.employee_list[i].txn_amount != -1)
           employee_list.push(user.employee_list[i]);
      }

     res.send({success : true, employee_list:employee_list,msg: 'employee list',status:'1'})
   }
    });

});


app.post('/employee_add' , function(req,res) {
  var employee_list = req.body.employee_list;

  for(i=0;i < employee_list.length;i++) {
    //  console.log(employee_list[i]);
      //console.log(uuidv4());
       employee_list[i].emp_id = uuidv4();
       employee_list[i].txn_amount = 0;

  }
  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }
//console.log(user);
    if(!user) {
    return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }
    for(i=0;i < employee_list.length;i++) {
        //console.log(employee_list[i]);
        user.employee_list.push(employee_list[i]);
        console.log(business_flag);
        if(business_flag)
          user.business_details.employee_list.push(employee_list[i]);
  }
  //console.log(user);

    user.save(function (err, updatedUser) {
       if(err) {
          console.log(err);
          return res.status(500).send("err");
        }
    res.send({success : true, employee_list:updatedUser.employee_list,msg: 'new employee list',status:'1'})
    });
  });
});

app.post('/employee_update' , function(req,res) {

  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }
    if(!user) {
       return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }
    for(i=0;i < user.employee_list.length;i++) {
      if(user.employee_list[i].emp_id == req.body.employee.emp_id){
         user.employee_list[i] = req.body.employee;
         console.log(business_flag);
         if(business_flag)
            user.business_details.employee_list[i] = req.body.employee;
      }
  }

    user.save(function (err, updatedUser) {
       if(err) {
          console.log(err);
          return res.status(500).send("err");
        }
    res.send({success : true, employee_list:updatedUser.employee_list,msg: 'updated employee list',status:'1'})
    });
  });
});

app.post('/employee_rm' , function(req,res) {
  User.findById(req.body.id, function (err, user) {
   if(err) {
      console.log(err);
      return res.status(500).send("err");
    }
    //console.log(user);
    if(!user) {
       return res.status(404).send({success: false, msg: 'username not found',status:'0'});
    }
    for(i=0;i < user.employee_list.length;i++) {
        //console.log(user.employee_list[i]);
        if(user.employee_list[i].emp_id == req.body.emp_id){
            user.employee_list[i].txn_amount = -1;
            if(business_flag)
              user.business_details.employee_list[i].txn_amount = -1;
            //console.log(user.employee_list[i]);
        }
    }
    user.save(function (err, updatedUser) {
       if(err) {
          console.log(err);
          return res.status(500).send("err");
        }
    res.send({success : true, employee_list:updatedUser.employee_list,msg: 'updated employee list',status:'1'})
    });

  });
});

app.post('/customerinfo', function(req,res) {

  Customer.findOne(
      { "user_id": req.body.id,
        "contact_no" : req.body.contact_no})
      .then(function(person){
        if (person)
          return res.send({success: true, 'customerinfo' : person, msg: 'Customer Info', status : '1'});
        else
          return res.send({success: false, msg: 'No such customer', status : '0'});

      });
    });

app.post('/customerInfo', function(req,res) {


  var cust_id = uuidV1();

  var newCustomer = new customer({
    id : cust_id,
    user_id : req.body.id,
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


app.post('/customerlist', function(req,res) {
  Customer.find({"user_id" : req.body.id}, function(err, customerlist){
    if(err) {
       console.log(err);
       console.log('customerlist');
       return res.status(500).send("err");
     }
    //console.log(customerlist);
    return res.send({success: true, 'Customer_List' : customerlist, msg: 'Customer List', status : '1'});
    //customerlist.toArray(res);
  });

});




app.post('/home_screen', function(req,res) {

  User.findById(req.body.id, function (err, user) {
     if(err) {
        console.log(err);
        return res.status(500).send("err");
      }

    if(!user) {
      return res.status(404).send({success: false, msg: 'id does not match',status:'0'});
      }
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    console.log(day,month,year);
    console.log(user.sales.daily_total);
    console.log(user.sales.monthly_total);
    res.send({success : true, daily_total:user.sales.daily_total, daily_orders:user.sales.daily_orders, monthly_total:user.sales.monthly_total, monthly_orders:user.sales.monthly_orders, annual_total:user.sales.annual_total, annual_orders:user.sales.annual_orders, msg: 'home screen details',status:'1'})

  });
 });
}
