var bcrypt = require("./node_modules/bcrypt");

var salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    var hash1 = bcrypt.hashSync("1234", salt);

console.log(hash1);


var hash2 = bcrypt.hashSync("1234", salt);

console.log(hash2);


