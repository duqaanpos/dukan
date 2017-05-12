'use strict';

module.exports = function(Owner) {
 
Owner.compareMobileNo = function (password, cb) {
    if (this.password == password)         
    	return cb(null,true);
    else 
    	return cb(false,false)    
     
    };
};


