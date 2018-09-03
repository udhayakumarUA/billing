/**
 * Collection.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    collectiontitle:{
      type:'string'
    },
    description:{
      type:'string'
    },
    collectioncode:{
      type:'string',
      unique:true
    },
    product:{
      collection:'products',
      via:'collection'
    },
    used:{
      type:'boolean',
      defaultsTo:false
    }

  }
};

