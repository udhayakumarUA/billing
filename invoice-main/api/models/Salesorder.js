/**
 * Salesorder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	placeofsuply:{
  		type:'string'
  	},
  	salesorderid:{
  		type:'string'
  	},
  	status:{
  		type:'string'
  	},
  	startdate:{
  		type:'date'
  	},
    soid:{
      type:'integer'
    },
    salesorder:{
      type:'json'
    },
    notes:{
      type:'string'
    },
    subtotal:{
      type:'float'
    },
    cgstprice:{
      type:'float'
    },
    sgstprice:{
      type:'float'
    },
    igstprice:{
      type:'float'
    },
    cessprice:{
      type:'float'
    },
    maintotal:{
      type:'float'
    },
    discount:{
      type:'string'
    },
    shipping:{
      type:'float'
    },
    adjustment:{
      type:'float'
    },
    username:{
      type:'string'
    },
    user:{
      model:'contact'
    },
    salesperson:{
      model:'Salesperson'
    },
    salespersonname:{
      type:'string'
    }

  }
};

