use strict';

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var employeeSchema = new Schema({

	 "id" : {
      "type" : "string",
      "id" : "true"
  	},
  	"employeeName": {
      "type": "string",
      "required": true
    },
    "contact_no" : {
      "type": "number",
      "required": true 
    },
    "payableAmount"
    "contact_no": {
      "type": "number",
      "required": true      
    },
    "discount": {
      "type": "number",
      "required": false
    },
    "totalBill": {
      "type": "string",
      "required": true
    },
    "payByCash": {
      "type": "number",
      "required": false
    },
    "payByCredit" : {
      "type" : "number",
      "required" :false
    }
    
   });

// console.log("mongoose connected in employee");
 var employee = mongoose.model('customer', employeeSchema);

 
module.exports  = employee;