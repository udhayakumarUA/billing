/**
 * Posconfig.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	customer:{
  		type:'string'
  	},
  	description:{
  		type:'string'
  	},
    header:{
      type:'string'
    },
    terms:{
      type:'string'
    },
    invoicenumber:{
      type:'integer'
    },
  	type:{
  		type:'string'
  	}
  }
};

