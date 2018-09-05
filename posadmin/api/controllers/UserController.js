/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt-nodejs');
module.exports = {

  adduser:(req,res)=>{

    var token=crypto.token(new Date().getTime()+req.param('username'));
    User.findOne({storeid:req.param('storeid')}).exec((err,found)=>{
      if(err) return res.negotiate(err);
      if(found){
        return res.json(401,{err:'Storeid exists'})
      }
    User.create({company:req.param('company'),
      fistname:req.param('fistname'),
      lastname:req.param('lastname'),
      email:req.param('email'),
      username:req.param('username'),
      password:bcrypt.hashSync(req.param('password')),
      phoneno:req.param('phoneno'),
      mobileno:req.param('mobileno'),
      expiredate:req.param('expiredate'),
      address:req.param('address'),
      city:req.param('city'),
      country:req.param('country'),
      postalcode:req.param('postalcode'),
      type:req.param('type'),
      storeid:req.param('storeid'),
      key:token})
  .exec((err,created)=>{

  if(err) return res.negotiate(err);
    return res.json({message:'created'})
})
    })

},
  checkstoreid:function(req,res){
    User.findOne({storeid:req.body.storeid}).then(function(user) {

      if(user){
        return res.ok({
          message: 'true'
        })
      }
      else{
        return res.ok({
          message: ''
        })
      }
    });
  },

  adduser1:(req,res)=>{
    User.findOne({storeid:req.param('storeid1')}).exec((err,found)=> {
      if (err) return res.negotiate(err);
      if (found) {
        return res.json(401, {err: 'Storeid exists'})
      }
      User.create({
        company: req.param('company1'),
        fistname: req.param('fistname1'),
        lastname: req.param('lastname1'),
        email: req.param('email1'),
        username: req.param('username1'),
        password:bcrypt.hashSync(req.param('password1')),
        phoneno: req.param('phoneno1'),
        mobileno: req.param('mobileno1'),
        expiredate: req.param('expiredate1'),
        address: req.param('address1'),
        city: req.param('city1'),
        country: req.param('country1'),
        postalcode: req.param('postalcode1'),
        storeid:req.param('storeid1'),
        type: req.param('type'),
        role:'SA'
      })
        .exec((err, created) => {
          Userclient.create({
            company: req.param('company1'),
            fistname: req.param('fistname1'),
            lastname: req.param('lastname1'),
            email: req.param('email1'),
            username: req.param('username1'),
            password:bcrypt.hashSync(req.param('password1')),
            phoneno: req.param('phoneno1'),
            mobileno: req.param('mobileno1'),
            expiredate: req.param('expiredate1'),
            address: req.param('address1'),
            city: req.param('city1'),
            country: req.param('country1'),
            postalcode: req.param('postalcode1'),
            storeid:req.param('storeid1'),
            onlineid:created.id,
            role:'SA'
          }) .exec((err,done) => {
          if (err) return res.negotiate(err);
          return res.json({message: 'created'})
          })
        })
    })
  },
  getusercount:(req,res)=>{
    var date = new Date();
    User.count().exec((err,total)=>{
      User.count({type:'offline'}).exec((err,offline)=>{
        User.count({type:'online'}).exec((err,online)=>{
        User.count({where: { "expiredate": { "<": date }}}).exec((err,expired)=>{
          if(err) return res.negotiate(err);
          return res.json({total:total,offline:offline,online:online,expired:expired})
        })
      })
    })
    })
  },
  updata:(req,res)=>{
    User.update({id:req.param('id')},{
      expiredate:req.param('expiredate')
      })
      .exec((err,created)=>{
        Userclient.findOne({onlineid:req.param('id')}).exec((err,found)=>{
        if(found){
        Userclient.update({onlineid:req.param('id')},{
      expiredate:req.param('expiredate')
      })
      .exec((err,updated)=>{
        })
    }
        if(err) return res.negotiate(err);
        return res.json({date:created})
      
    })
      })

  },
  renewals: (req, res) => {
    var date = new Date();
    User.find({ where: { "expiredate": { ">=": date }, sort: 'expiredate ASC', limit: 10 } })
      .exec((err, result) => {
        User.count().exec((err, count) => {
          if (err) { return }
          return res.json({ result: result, count: count })
        })
      })
  },
  getmore:(req,res)=>{
    User.find({where: { "expiredate": { ">=": date },skip:req.param('skip'),sort: 'expiredate ASC',limit:10}})
    .exec((err,result)=>{
      User.count().exec((err, count) => {
        if (err) { return }
        return res.json({ result: result, count: count })
      })
    })
  },
  offlineusers:(req,res)=>{
    User.find({sort:'createdAt DESC',type:'offline'})
      .exec((err,result)=>{
        if(err){return}
        return res.json({offline:result})
      })
  },

  onlineusers:(req,res)=>{
    User.find({sort:'createdAt DESC',type:'online'})
      .exec((err,result)=>{
        if(err){return}
        return res.json({online:result})
      })
  },

  getuser:(req,res)=>{
    User.findOne({id:req.param('id')})
      .exec((err, result)=>{
        if(err){return}
        return res.json({suser:result})
      })
  },
  getuser1:(req,res)=>{
    User.findOne({key:req.param('key')})
      .exec((err, result)=>{
        if(err){return}
        return res.json({suser:result})
      })
  },

  verifyuser:(req,res)=>{
    User.findOne({key:req.param('key'),keyused:false}).exec((err,user)=>{
      if(err){res.negotiate(err)}
      if(!user){
        return res.json(401,{message:'Invalid Key'})
      }
      User.update({id:user.id},{keyused:true})
        .exec((err,used)=>{
          return res.json({message:'user verified',user:user})
        })
    })
  },
  adminlogin:(req, res)=>{

    var username = req.param('username');
    var password = req.param('password');
    if (!username || !password) {
      return res.json(401, {err: 'username and password required'});
    }

    Admin.findOne({username: username}).exec((err, user)=>{

      if (!user) {
        return res.json(401, {err: 'User is not registered'});
      }

      if (!crypto.comparePassword(password, user)){
        return res.json(401, {err: 'invalid  password'});
      }
      else {
        req.session.adminId = user.id;

        res.json({
          me: user,message:'Login Successfully'
        });
      }

    })
  },
  adminlogout:(req, res)=>{

    // log the user-agent out.
    req.session.adminId = null;

    return res.ok();

  },
  deleteuser:(req,res)=>{
    User.destroy({id:req.param('id')}).exec((err,result)=>{
      return res.json({message:'ok'});
    })
  }
};

