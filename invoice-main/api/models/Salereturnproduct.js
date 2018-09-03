/**
 * Salereturnproduct.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    return:{
      model:'salereturn'
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
    returndate:{
      type:'string'
    },
    singletax:{
      type:'integer'
    },
    singlecgst:{
      type:'float'
    },
    singlesgst:{
      type:'float'
    },
    singleigst:{
      type:'float'
    },
    singlecess:{
      type:'float'
    }

  }
};

