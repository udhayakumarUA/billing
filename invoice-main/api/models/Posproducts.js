/**
 * Posproducts.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    pos:{
      model:'pos'
    },
    posid:{
      type:'string'
    },
    quantity:{
      type:'float'
    },
    rate:{
      type:'float'
    },
    subtotal:{
      type:'float'
    },
    sales:{
      type:'float'
    },
    productid:{
      model:'Products'
    },
    groupid:{
      type:'string'
    },
    singletax:{
      type:'float'
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

