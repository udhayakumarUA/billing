/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var fs = require('fs');
var util = require('util');
var mkdirp = require('mkdirp');
var path = require('path');
var bcrypt = require('bcrypt-nodejs');
module.exports = {
  createuser:(req,res)=>{
    User.create({
      company:req.param('company'),
      fistname:req.param('fistname'),
      lastname:req.param('lastname'),
      email:req.param('email'),
      username:req.param('username'),
      password:req.param('password'),
      phoneno:req.param('phoneno'),
      mobileno:req.param('mobileno'),
      expiredate:req.param('expiredate'),
      address:req.param('address'),
      city:req.param('city'),
      country:req.param('country'),
      postalcode:req.param('postalcode'),
      key:req.param('key'),
      storeid:req.param('storeid'),
      keyused:req.param('keyused'),
      role:'SA'
    })
      .exec((err,created)=>{
        if(err) return res.negotiate(err);
      Verify.create({keyused:true,key:req.param('key')}).exec((err,keycreated)=>{
        if(err) return res.negotiate(err);
        return res.json({message:'created'})
      })
      })
  },
  adduser:(req,res)=>{
    var username = req.param('username');
    var password = req.param('password');
    if (!username || !password) {
      return res.json(401, {err: 'username and password required'});
    }
    User.findOne({username:req.body.username}).exec((err, user)=>{
      if (user) {
        return res.json(401, {err: 'User is already exists'});
      }
      Verify.find({limit:1}).exec((err,verify)=>{
        if(err) return res.negotiate(err);
          User.findOne({key: verify[0].key}).exec((err, suser) => {
            if (err) return res.negotiate(err);
            var token = crypto.token(new Date().getTime() + username);
            User.create({
              username: username,
              password: bcrypt.hashSync(password),
              role: req.param('role'),
              key: token,
              storeid:suser.storeid
            }).exec((err, added) => {
              if (err) {
                return res.negotiate(err)
              }
              User.find({role: {'!': ['SA']}}).exec((err, user) => {
                if (err) return res.negotiate(err);
                return res.json({users: user});
              })
            })
          })
      })
    })
  },
  updatepassword:(req,res)=>{
    var newpassword = bcrypt.hashSync(req.body.password);
    User.update({key:req.param('key')},{password:newpassword}).exec((err,pass)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'updated'})
    })
  },
  updateexpiredate:(req,res)=>{
    User.update({key:req.param('key')},{expiredate:req.param('expiredate')}).exec((err,updated)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'updated'})
    })
  },
  signinuser:(req, res)=>{

    var email = req.param('username');
    var password = req.param('password');
    var storeid = req.param('storeid');
    if (!email || !password) {
      return res.json(401, {err: 'username and password required'});
    }

    User.findOne({username: email}).exec((err, user)=> {

      if (!user) {
        return res.json(401, {err: 'User is not registered'});
      }

      User.findOne({storeid: storeid}).exec((err, user1) => {

        if (!user1) {
          return res.json(401, {err: 'Invalid organisation ID'});
        }
        if (!crypto.comparePassword(password, user)) {
          return res.json(401, {err: 'invalid  password'});
        }
        else {
          res.json({
            me: user, message: 'Login Successfully', key: user.key
          });
        }

      })
    })
  },
  checkuser:(req,res)=>{
    Verify.find({limit:1}).exec((err,verify)=>{
      if(err) return res.negotiate(err);
      if(verify.length>=1) {
        User.findOne({key: verify[0].key}).exec((err, user) => {
          if (verify.length > 0) {
            verify[0].date = user.expiredate;
            return res.json(verify[0])
          }
          else {
            return res.json({verify: false, date: ''})
          }
        })
      }
      else{
        return res.json({verify: false, date: ''})
      }

    })
},

   getallusers:(req,res)=>{
     if(req.param('type')=='All'){
      User.find().exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
     }
     else{
      User.find({ role: { '!' : ['SA'] }}).exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
    }
   },
   deleteuser:(req,res)=>{
    User.destroy({id:req.param('id')}).exec((err,deleted)=>{
      if(err) return res.negotiate(err);
      User.find({ role: { '!' : ['SA'] }}).exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
    })
   },
   updateroleuser:(req,res)=>{
     User.update({id:req.param('id')},{password:bcrypt.hashSync(req.param('password'))}).exec((err,updated)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'updated'})
     })
   },
  getuser:(req,res)=>{
    User.findOne({key:req.param('key')}).exec((err,user)=>{
       if (!user) {
        return res.json(401, {err: ' INVALID VALIDATION KEY'});
      }
      return res.json({user:user,message:'Login Successfully'})
    })
  },
  updateuser:(req,res)=> {
    if (req.method === 'POST') {
      var tempLocation = process.cwd() + '/.tmp/public/images/uploads/';

      mkdirp(tempLocation, function (err) {
        if (err) return res.send(500, err);
        // Start uploading the image
        req.file('avatar').upload({
          maxBytes: 1000000,
          dirname: process.cwd() + '/assets/images/uploads/'
        }, function (err, uploadedFiles) {
          if (err) {
            if (req._fileparser.form.bytesExpected > 1000000) {
              return res.json(500, {err: 'max file size is 1mb'});
            }
            return sails.log.error(err);
          }

          // If no files were uploaded, respond with an error.
          if (uploadedFiles.length === 0) return res.badRequest('No file was uploaded');
          var filename = path.basename(uploadedFiles[0].fd);
          // var filename = uploadedFiles[0].fd.substring(uploadedFiles[0].fd.lastIndexOf('/') + 1);
          var uploadLocation = process.cwd() + '/assets/images/uploads/';
          var protocol = req.connection.encrypted ? 'https' : 'http';
          var baseURL = protocol + '://' + req.headers.host;
          var avatarUrl = util.format('%s/images/uploads/%s', baseURL, filename);
          var imagedir = '/images/uploads/' + filename;
          //Copy the file to the temp folder so that it becomes available immediately
          var stream = fs.createReadStream(uploadLocation + filename)
            .pipe(fs.createWriteStream(tempLocation + filename));

          // Handle errors from the file stream
          stream.on('error', function (error) {
            console.log("Caught", error);
          });

          User.findOne({id: req.param('id')}).then(function (found) {
            console.log(found.imageurl);
            if (found.imageurl !== undefined) {
              fs.unlink('assets/' + found.imagedir, function (err) {
                if (err) throw err;
              });
            }
            User.update({id: req.param('id')}, {
              imagename: filename,
              imageurl: avatarUrl,
              imagedir: imagedir,
              company: req.param('company'),
              fistname: req.param('fistname'),
              lastname: req.param('lastname'),
              email: req.param('email'),
              phoneno: req.param('phoneno'),
              mobileno: req.param('mobileno'),
              address: req.param('address'),
              city: req.param('city'),
              country: req.param('country'),
              postalcode: req.param('postalcode'),
              bussinessloc: req.param('bussinessloc'),
              address1: req.param('address1'),
              statecode: req.param('statecode'),
              website: req.param('website'),
              fax: req.param('fax'),
              gstin: req.param('gstin')
            }).exec((err, updated) => {
              if (err) {
                return res.negotiate(err)
              }
              return res.json({message: 'updated'})

            });
          });

          })
        })
    }
  },
  updateuser1:(req,res)=>{
        User.update({id: req.param('id')}, {
          company: req.param('company'),
          fistname: req.param('fistname'),
          lastname: req.param('lastname'),
          email: req.param('email'),
          phoneno: req.param('phoneno'),
          mobileno: req.param('mobileno'),
          address: req.param('address'),
          city: req.param('city'),
          country: req.param('country'),
          postalcode: req.param('postalcode'),
          bussinessloc: req.param('bussinessloc'),
          address1: req.param('address1'),
          statecode: req.param('statecode'),
          website: req.param('website'),
          fax: req.param('fax'),
          gstin: req.param('gstin')
        }).exec((err, updated) => {
          if (err) {
            return res.negotiate(err)
          }
          return res.json({message: 'updated'})

        });
      }

};

