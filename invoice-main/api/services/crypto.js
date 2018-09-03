var bcrypt = require('bcrypt-nodejs');
var Crypto = require('crypto');
module.exports = {
  hashPassword: function (user) {
    if (user.password) {
      user.password = bcrypt.hashSync(user.password);
    }
  },
  token: function(input){
    var hash = Crypto.createHash('md5').update(input).digest('hex');
    return hash;
  },

  comparePassword: function(password, user){
    return bcrypt.compareSync(password, user.password);
  },

};
