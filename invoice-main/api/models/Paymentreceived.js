/**
 * Paymentreceived.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    user:{
      model:'Contact'
    },
    paymentdate:{
      type:'string'
    },
    paymentmode:{
      type:'string'
    },
    paymentid:{
      type:'string'
    },
    billid:{
      type:'string'
    },
    amount:{
      type:'float'
    },
    username:{
      type:'string'
    },
    count:{
      type:'integer'
    },
    posid:{
      type:'string'
    }
  }
};

