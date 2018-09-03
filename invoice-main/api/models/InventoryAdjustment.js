/**
 * InventoryAdjustment.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    refid:{
      type:'integer'
    },
    referenceNumber:{
      type:'string'
    },
    quantity:{
      type:'integer'
    },
    date:{
      type:'date'
    },
    reason:{
      type:'string'
    },
    description:{
      type:'string'
    },
    user:{
      model:'user'
    },
    item:{
      model:'products'
    },
    username:{
      type:'string'
    },
    itemname:{
      type:'string'
    }
    

  }
};

