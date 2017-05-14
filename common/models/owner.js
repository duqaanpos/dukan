'use strict';
 

 var mongoose = require("mongoose");
 var Schema = mongoose.Schema;
 mongoose.connect('mongodb://localhost/duqaan');

 console.log("mongoose connected");
 var userSchema = new Schema({

 	"username": {
      "type": "string",
      "id": true,
      "required": true,      
      "isArray": false,
      "unique" :true
    },
    "password": {
      "type": "string",
      "id": true,
      "required": true,
      "unique" : false,
      "isArray": false
    },
    "mobile": {
      "type": "number",
      "id": true,
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
    "buisness_details": {
      "type": [
        "object"
      ],
      "required": false,
      "index": true,
      "isArray": true
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
    "monthly_total": {
      "type": "number",
      "id": false,
      "required": false,
      "isArray": false
    },
    "daily_total": {
      "type": "number",
      "id": false,
      "required": false,
      "isArray": false
    },
    "annual_total": {
      "type": "number",
      "id": false,
      "required": false,
      "isArray": false
    },
    "credit_totoal": {
      "type": "number",
      "id":false,
      "required": false,
      "isArray": false
    },
    "email": {
      "type": "string",
      "required": false
    }
  




   });


 var owner = mongoose.model('owner', userSchema);

 
module.exports  = owner;  	 



