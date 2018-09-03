/**
 * Hold.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    products:{
      type:'array'
    },
    maintotal:{
      type:'string'
    },
    taxtotal:{
      type:'string'
    },
    discount:{
      type:'string'
    },
    items:{
      type:'string'
    },
    user:{
      type:'json'
    }

  }
};

