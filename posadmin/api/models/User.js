/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

var bcrypt = require('bcrypt-nodejs');
module.exports = {

  attributes: {
    company:{
      type:'string'
    },
    fistname:{
      type:'string'
    },
    lastname:{
      type:'string'
    },
    email:{
      type:'string'
    },
    username:{
      type:'string'
    },
    password:{
      type:'string'
    },
    phoneno:{
      type:'string'
    },
    mobileno:{
      type:'string'
    },
    expiredate:{
      type:'datetime'
    },
    address:{
      type:'string'
    },
    city:{
      type:'string'
    },
    country:{
      type:'string'
    },
    postalcode:{
      type:'string'
    },
    key:{
      type:'string'
    },
    type:{
      type:'string'
    },
    role:{
      type:'string'
    },
    ordid:{
      type:'string'
    },
    keyused:{
      type:'boolean',
      defaultsTo:false
    }
  }
};

