'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var transactionSchema = new Schema({


	 "_id" : {
 
      "type" : "string",
      "id" : "true"
  	},
  	"txn_amount" : {
      "type" : "number",
      "required" : true
    },
	"user_id": {
    "type": "string",
     "required": true
    },
    "cust_id": {
      "type": "string",
      "required": false
    },
    "itemsList": {
      "type": "object",
      "required": true
    },
    "timestamp": {
      "type": "number",
      "required": true
    },
    "mode_of_payment" : {
      "type" : "string",
      "required" : true
    },
    "emp_id" : {
      "type" : "string",
      "required" : false
    },        
    "payByCash" : {
    	"type" : "number",
    	"required" : false
    },
    "payByCredit" : {
    	"type" : "number",
    	"required" : false
    },
    "totalBill" : {
    	"type" : "number",
    	"required" : true
    },
    "discount" : {
    	"type" : "number",
    	"required" : false
    },
    "payableAmount" : {
    	"type" : "number",
    	"required" : false
    }

 });

var transaction = mongoose.model('transaction', transactionSchema);

 
module.exports  = transaction;

