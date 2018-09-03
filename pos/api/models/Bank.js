/**
 * Bank.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    bankname:{
      type:'string'
    },
    branchname:{
      type:'string'
    },
    accountno:{
      type:'string'
    },
    accountname:{
      type:'string'
    },
    ifsccode:{
      type:'string'
    }
  }
};

