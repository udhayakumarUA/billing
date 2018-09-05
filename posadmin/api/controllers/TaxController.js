/**
 * TaxController
 *
 * @description :: Server-side logic for managing Taxes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addtax:(req,res)=>{
		Tax.create({userid:req.param('userid'),name:req.param('taxname'),type:req.param('taxtype'),rate:req.param('taxrate')}).exec((err,result)=>{
			if(err) return res.negotiate(err);
			Tax.find({userid:req.param('userid'),sort:'createdAt DESC',limit:20}).exec((err,data)=>{	
				Tax.count({userid:req.param('userid'),sort:'createdAt DESC'}).exec((err,count)=>{	
						if(err) return res.negotiate(err);			
        	return res.json({data:data,message:'created',count:count})
			})
		})
		})
	},
	gettaxes:(req,res)=>{
		Tax.find({userid:req.param('userid'),sort:'createdAt DESC',limit:20}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Tax.count({userid:req.param('userid'),sort:'createdAt DESC'}).exec((err,count)=>{	
				if(err) return res.negotiate(err);
        	return res.json({result:result,count:count})
				})
			})
	},
	getmoretax:(req,res)=>{
		Tax.find({userid:req.param('userid'),sort:'createdAt DESC',skip:req.param('skip'),limit:20}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Tax.count({userid:req.param('userid'),sort:'createdAt DESC'}).exec((err,count)=>{	
				if(err) return res.negotiate(err);
        	return res.json({result:result,count:count})
				})
			})
	},
	getsingletax:(req,res)=>{
		Tax.findOne({id:req.param('id')}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
        	return res.json({result:result})
		})
		
	},
	updatetax:(req,res)=>{
		Tax.update({id:req.param('id')},{name:req.param('taxname'),type:req.param('taxtype'),rate:req.param('taxrate')}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
        	Tax.find({userid:req.param('userid'),sort:'createdAt DESC'}).exec((err,result)=>{	
				if(err) return res.negotiate(err);
        		return res.json({result:result})
			})
		})
		
	},
	 deletetax:(req,res)=>{
	        Tax.destroy({id: req.param('id')}).exec((err, deleted) => {
	          if (err) {
	            return res.negotiate(err)
	          }
	          Tax.find({userid:req.param('userid'),sort:'createdAt DESC'})
	            .exec((err, result) => {
	              if (err) {
	                return res.negotiate(err)
	              }
	              return res.json({result:result})
	            })
	        })
  	},
	
};

