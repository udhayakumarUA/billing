/**
 * Expenses.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
  	expensetype:{
  		type:'string'
  	},
  	amount:{
  		type:'float'
	},
	cess:{
		type:'float'
	},
	igst:{
		type:'float'
	},
	cgst:{
		type:'float'
	},
	sgst:{
		type:'float'
	},  

  	tax:{
  		type:'float'
  	},
  	date:{
  		type:'string'
  	},
  	paymentmode:{
  		type:'string'
  	},
  	name:{
  		model:'contact'
  	},
  	expensesid:{
  		type:'string'
  	},
  	expid:{
  		type:'integer'
	  },
	clientid:{
		model:'user'
	}

  }
};

