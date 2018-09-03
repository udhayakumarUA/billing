/**
 * Estimate.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {

  	placeofsuply:{
  		type:'string'
  	},
  	estimateid:{
  		type:'string'
  	},
  	status:{
  		type:'string'
  	},
  	startdate:{
  		type:'string'
  	},
  	enddate:{
  		type:'string'
  	},
    estid:{
      type:'integer'
    },
    estimate:{
      type:'json'
    },
    notes:{
      type:'string'
    },
    subtotal:{
      type:'float'
    },
    cgstprice:{
      type:'float'
    },
    sgstprice:{
      type:'float'
    },
    igstprice:{
      type:'float'
    },
    cessprice:{
      type:'float'
    },
    maintotal:{
      type:'float'
    },
    username:{
      type:'string'
    },
    user:{
      model:'contact'
    },
    salesperson:{
      model:'Salesperson'
    }

  }
};

