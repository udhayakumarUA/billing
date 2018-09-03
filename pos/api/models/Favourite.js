/**
 * Favourite.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    itemtype:{
      type:'string'
    },
    productname:{
      type:'string'
    },
    unit:{
      type:'string'
    },
    collection:{
      model:'collection'
    },
    imagename:{
      type:'string'
    },
    imageurl:{
      type:'string'
    },
    imagedir:{
      type:'string'
    },
    sku:{
      type:'string'
    },
    hsn:{
      type:'string'
    },
    salesrate:{
      type:'string'
    },
    purchaserate:{
      type:'string'
    },
    prices:{
      type:'array'
    },
    taxpreference:{
      type:'string'
    },
    trackinventary:{
      type:'boolean'
    },
    openingstock:{
      type:'string'
    },
    openingstockperrate:{
      type:'string'
    },
    barcode:{
      type:'string'
    },
    reason:{
      type:'string'
    },
    sgst:{
      type:'string'
    },
    cgst:{
      type:'string'
    },
    igst:{
      type:'string'
    },
    cess:{
      type:'string'
    },
    utgst:{
      type:'string'
    },
    productno:{
      type:'integer'
    },
    stockinhand:{
      type:'string'
    }
  }
};

