'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;


var customerSchema = new Schema({

	

  	"cust_name": {
      "type": "string",
      "required": true
    },
    "contact_no": {
      "type": "number",
      "required": false
    },
    "totalCredit": {
      "type": "number",
      "required": false
    },
    "email": {
      "type": "string",
      "required": false
    },

    "age" : {
      "type" : "number",
      "required" : false
    },
    "gender" : {
      "type" : "string",
      "required" : false
    },
    "txn_id" : {
    	"type" : "string",
    	"required" : false

    }
    
   });

//mongoose.connect('mongodb://duqaandb:duqaandb@ds031257.mlab.com:31257/duqaandb');
 //console.log("mongoose connected");
 var customer = mongoose.model('customer', customerSchema);

 
module.exports  = customer;