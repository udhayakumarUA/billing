/**
 * Contact.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	type:{
  		type:'string'
  	},
  	salutation:{
  		type:'string'
  	},
  	firstname:{
  		type:'string'
  	},
  	lastname:{
  		type:'string'
  	},
  	company:{
  		type:'string'
  	},
  	email:{
  		type:'string'
  	},
  	phonenumber:{
  		type:'string'
  	},
  	mobilenumber:{
  		type:'string'
  	},
  	address:{
  		type:'string'
  	},
  	gsttype:{
  		type:'string'
  	},
  	gstin:{
  		type:'string'
  	},
  	plos:{
  		type:'string'
  	},
  	sos:{
  		type:'string'
  	},
  	statecode:{
  		type:'string'
  	},
    estimate:{
      collection:'Estimate',
      via:'user'
    },
    pos:{
  	  collection:'Pos',
      via:'user'
    },
    purchase:{
  	  collection:'Purchase',
      via:'user'
	},
	paymentmade:{
		collection:'Paymentmade',
		via:'user'
	},
    paymentreceived:{
  	  collection:'Paymentreceived',
      via:'user'
	},
	purchase:{
		collection:'Purchase',
		via:'user'
	}


  }
};

