/**
 * PagesController
 *
 * @description :: Server-side logic for managing pages
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt-nodejs');
module.exports = {
  index: function(req, res) {
    Admin.find().exec((err,users)=>{
      if(users.length<=0){
        let pass = bcrypt.hashSync('password');
        Admin.create({username:'admin',password:pass,role:'SA'}).exec((err,usercreate)=>{
          req.session.adminId = usercreate.id;
          console.log(usercreate)
        })
      }
    })

    if (!req.session.adminId) {
      return res.view('homepage', {
        me: null
      });
    }

    Admin.findOne(req.session.adminId, function (err, user) {
      if (err) {
        return res.negotiate(err);
      }

      if (!user) {
        sails.log.verbose('Session refers to a user who no longer exists- did you delete a user, then try to refresh the page with an open tab logged-in as that user?');
        return res.view('homepage', {
          me: null
        });
      }

      return res.view('homepage', {
        me: {
          id:user.id
        },
      });
    });
  }
};


