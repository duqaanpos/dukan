'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var customerSchema = new Schema({

	 "id" : {

      "type" : "string",
      "id" : true
  	}, 

  	"cust_name": {
      "type": "string",
      "required": true
    },
    "contact_no": {
      "type": "number",
      "required": true
    },
    "totalCredit": {
      "type": "number",
      "required": true
    },
    "email": {
      "type": "string",
      "required": true
    }
    
   });

//mongoose.connect('mongodb://duqaandb:duqaandb@ds031257.mlab.com:31257/duqaandb');
 //console.log("mongoose connected");
 var customer = mongoose.model('customer', customerSchema);

 
module.exports  = customer;