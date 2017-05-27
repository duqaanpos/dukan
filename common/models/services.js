var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var serviceSchema = new Schema({

	 "id" : {

      "type" : "string",
      "id" : true
  	},
    "category": {
      "type": "object",
      "required": true
    },
    "sub_category1": {
      "type": "object",
      "required": false
    },
    "sub_category2": {
      "type": "object",
      "required": false
    },
    "rate": {
      "type": "number",
      "required": true
    },
    "volume" : {
      "type" : "number",
      "required" : true
    }

   });

//mongoose.connect('mongodb://duqaandb:duqaandb@ds031257.mlab.com:31257/duqaandb');
 //console.log("mongoose connected");
 var services = mongoose.model('services', serviceSchema);

 
module.exports  = services;