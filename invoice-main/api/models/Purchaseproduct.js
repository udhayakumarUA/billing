/**
 * Purchaseproduct.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    purchase:{
      model:'purchase'
    },
    referenceid:{
      type:'string'
    },
    productid:{
      model:'Products'
    },
    sales:{
      type:'float'
    },
    subtotal:{
      type:'float'
    },
    purchasedate:{
      type:'string'
    }

  }
};

