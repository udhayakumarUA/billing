/**
 * Pos.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user:{
      model:'contact'
    },
    username:{
      type:'string'
    },
    posid:{
      type:'string'
    },
    maintotal:{
      type:'float'
    },
    taxtotal:{
      type:'float'
    },
    totalcgst:{
      type:'float'
    },
    totalsgst:{
      type:'float'
    },
    totaligst:{
      type:'float'
    },
    totalcess:{
      type:'float'
    },
    totalsub:{
      type:'float'
    },
    discount:{
      type:'string'
    },
    items:{
      type:'string'
    },
    balance:{
      type:'float'
    },
    totalpaying:{
      type:'string'
    },
    products:{
      collection:'posproducts',
      via:'pos'
    },
    autoinc:{
      type:'integer'
    },
    status:{
      type:'string'
    },
    vehicleno:{
      type:'string'
    },
    invoicedate:{
      type:'date'
    },
    duedate:{
      type:'date'
    },
    date:{
      type:'string'
    },
    singlepostax:{
      type:'integer'
    },
    notes:{
      type:'string'
    },

  }
};

