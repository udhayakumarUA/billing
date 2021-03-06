/**
 * Salereturn.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    username:{
      type:'string'
    },
    referenceid:{
      type:'string'
    },
    billid:{
      type:'string'
    },
    sourceofsuply:{
      type:'string'
    },
    returndate:{
      type:'string'
    },
    note:{
      type:'string'
    },
    maintotal:{
      type:'float'
    },
    taxtotal:{
      type:'string'
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
    items:{
      type:'string'
    },
    balance:{
      type:'float'
    },
    products:{
      collection:'salereturnproduct',
      via:'return'
    },
    status:{
      type:'string'
    },
    refid:{
      type:'integer'
    },
    user:{
      model:'Contact'
    },
    userid:{
      type:'string'
    }

  }
};

