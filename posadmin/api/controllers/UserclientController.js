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
  adduser:(req,res)=>{
    var username = req.param('username');
    var password = req.param('password');
    if (!username || !password) {
      return res.json(401, {err: 'username and password required'});
    }
    Userclient.findOne({id:req.param('userid')}).exec((err,suser)=>{
        if (err) {
            return res.negotiate(err)
        }
        Userclient.findOne({username:req.body.username,storeid:suser.storeid}).exec((err, user)=>{
      if (user) {
        return res.json(401, {err: 'User is already exists'});
      }
            var token = crypto.token(new Date().getTime() + username);
            Userclient.create({
              username: username,
              password: bcrypt.hashSync(password),
              role: req.param('role'),
              key: token,
              userid:req.param('userid'),
              storeid:suser.storeid
            }).exec((err, added) => {
              if (err) {
                return res.negotiate(err)
              }
                Userclient.find({role: {'!': ['SA']},userid:req.param('userid')}).exec((err, user) => {
                if (err) return res.negotiate(err);
                return res.json({users: user});
              })
            })
    })
          })
  },
  updatepassword:(req,res)=>{
    var newpassword = bcrypt.hashSync(req.body.password);
      Userclient.update({id:req.param('id')},{password:newpassword}).exec((err,pass)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'updated'})
    })
  },
  updateexpiredate:(req,res)=>{
    Userclient.update({userid:req.param('userid')},{expiredate:req.param('expiredate')}).exec((err,updated)=>{
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

      Userclient.findOne({username: email}).exec((err, user)=> {

      if (!user) {
        return res.json(401, {err: 'User is not registered'});
      }

          Userclient.findOne({storeid: storeid}).exec((err, user1) => {

        if (!user1 || storeid!=user.storeid) {
          return res.json(401, {err: 'Invalid organisation ID'});
        }
        if (!crypto.comparePassword(password, user)) {
          return res.json(401, {err: 'invalid  password'});
        }
        else {
          res.json({
            me: user, message: 'Login Successfully', id: user.id
          });
        }

      })
    })
  },
  checkuser:(req,res)=>{
        Userclient.findOne({id:req.param('id')}).exec((err, user) => {

          if (user) {
            return res.json({user:user,id:user.id,date:user.expiredate,date1:new Date(Date.now())})
          }
          else {
            return res.json({verify: false, date: '',date1:''})
          }
        })
},

   getallusers:(req,res)=>{
    if(req.param('type')=='All'){
      Userclient.find({storeid:req.param('storeid')}).exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
     }
     else{
       Userclient.find({ userid:req.param('userid'),role: { '!' : ['SA'] }}).exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
    }
   },
   deleteuser:(req,res)=>{
       Userclient.destroy({id:req.param('id')}).exec((err,deleted)=>{
      if(err) return res.negotiate(err);
           Userclient.find({ userid:req.param('userid'),role: { '!' : ['SA'] }}).exec((err,user)=>{
        if(err) return res.negotiate(err);
        return res.json({users:user})
      })
    })
   },
   updateroleuser:(req,res)=>{
       Userclient.update({id:req.param('id')},{password:bcrypt.hashSync(req.param('password'))}).exec((err,updated)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'updated'})
     })
   },
  getuser:(req,res)=>{
    console.log('getuser')
    Userclient.findOne({id:req.param('userid')}).exec((err,user)=>{
       if (!user) {
         console.log('not a user')
        return res.json(401, {err: ' INVALID ID'});
      }
      return res.json({user:user})
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

          Userclient.findOne({id: req.param('id')}).then(function (found) {
            console.log(found.imageurl);
            if (found.imageurl !== undefined) {
              fs.unlink('assets/' + found.imagedir, function (err) {
                if (err) throw err;
              });
            }
            Userclient.update({id: req.param('id')}, {
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
        Userclient.update({id: req.param('id')}, {
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

