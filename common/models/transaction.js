'use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var transactionSchema = new Schema({


	 "id" : {

      "type" : "string",
      "id" : "true"
  	},
  	"txn_amount" : {
      "type" : "number",
      "required" : true
    },
	"uid": {
    "type": "string",
     "required": true
    },
    "cust_id": {
      "type": "string",
      "required": false
    },
    "txn_details": {
      "type": "object",
      "required": false
    },
    "timestamp": {
      "type": "number",
      "required": true
    },
    "mode_of_payment" : {
      "type" : "string",
      "required" : true
    },
    "employee" : {
      "type" : "object",
      "required" : true
    }

 });

var transaction = mongoose.model('transaction', transactionSchema);

 
module.exports  = transaction;

