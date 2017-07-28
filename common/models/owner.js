'use strict';


 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 var bcrypt = require("bcryptjs");
 var SALT_WORK_FACTOR = 10;

 var userSchema = new Schema({

 	"id" : {

      "type" : "string",
      "id" : true
  },

 	"username": {
      "type": "string",
      "id": false,
      "required": true,
      "isArray": false,
      "unique" :true
    },
    "password": {
      "type": "string",
      "id": false,
      "required": true,
      "unique" : false,
      "isArray": false
    },
    "mobile": {
      "type": "number",
      "id": false,
      "required": true,
      "isArray": false,
      "unique" : true
    },
    "fullName" : {
      "type" : "string",
      "id" : false,
      "required" : true,
      "isArray" : false,
      "unique" : false
    },
    "shopNo" : {
      "type" : "number",
      "id" : false,
      "required" : false,
      "unique" : false
     },
    "street" : {
      "type" : "string",
      "id" : false,
      "required" : true,
      "unique" : false
    },
    "state" : {

      "type" : "string",
      "id" : false,
      "required" : true,
      "unique" : false
    },
    "city" : {
      "type" : "string",
      "id" : false,
      "required" : true,
      "unique" : false
    },
    "pincode" : {
      "type" : "number",
      "id" : false,
      "required" : true,
      "unique" : false
    },
    "business_details": {
      "type":"object",
      "required": false
    },
    "service_list": {
      "type": [
        "object"
      ],
      "required": false,
      "index": true,
      "isArray": true
    },
    "txn_ref": {
      "type": "object",
      "required": false,
      "index": true,
      "isArray": false
    },
    "sales" :{
      "type":"object",
      "required": false
    },
    "credit_total": {
      "type": "number",
      "required": true,
      "isArray": false
    },
    "email": {
      "type": "string",
      "required": false
    },

    "employee_list" : {
      "type": [
        "object"
      ],
      "required": false,
      "index": true,
      "isArray": true
    }

});

/*
userSchema.pre('save', function(next) {
    var user = this;

// only hash the password if it has been modified (or is new)
if (!user.isModified('password')) return next();

// generate a salt
bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
        if (err) return next(err);

        // override the cleartext password with the hashed one
        user.password = hash;
        next();
    });
});


});

userSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


*/
mongoose.Promise = require('bluebird');
mongoose.connect('mongodb://duqaandb:duqaandb@ds031257.mlab.com:31257/duqaandb');
 console.log("mongoose connected");
 var owner = mongoose.model('owner', userSchema);


module.exports  = owner;
