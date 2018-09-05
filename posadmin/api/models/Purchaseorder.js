/**
 * Purchaseorder.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    placeofsuply:{
  		type:'string'
  	},
  	purchaseorderid:{
  		type:'string'
  	},
  	purchasedate:{
  		type:'date'
  	},
    porid:{
      type:'integer'
    },
    purchase:{
      type:'json'
    },
    notes:{
      type:'string'
    },
    username:{
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
    user:{
      model:'contact'
    },
  }
};

