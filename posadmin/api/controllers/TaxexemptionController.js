/**
 * taxexeexemptionController
 *
 * @description :: Server-side logic for managing taxexeexemptions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addtaxexe:(req,res)=>{
		Taxexemption.create({userid:req.param('userid'),reason:req.param('reason'),paragraph:req.param('paragraph'),type:req.param('type')}).exec((err,result)=>{
			if(err) return res.negotiate(err);
			Taxexemption.find({userid:req.param('userid'),sort:'createdAt DESC'}).exec((err,data)=>{	
        	return res.json({data:data,message:'created'})
			})
		})
	},
	gettaxexees:(req,res)=>{

		Taxexemption.find({userid:req.param('userid'),sort:'createdAt DESC',limit:10}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Taxexemption.count({userid:req.param('userid')})
	      .exec((err,count)=>{
        	return res.json({result:result,count:count})
        	})
		})
	},
	getsingletaxexe:(req,res)=>{
		Taxexemption.findOne({id:req.param('id')}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
        	return res.json({result:result})
		})
		
	},
	getmoretaxexe:(req,res)=>{
	    Taxexemption.find({userid:req.param('userid'),sort:'createdAt DESC',skip:req.param('skip'),limit:10})
	    .exec((err,finded)=>{
	       Taxexemption.count({userid:req.param('userid')})
	      .exec((err,count)=>{
	      if(err){return res.negotiate(err)}
	      return res.json({result:finded,count:count})
	      })
	    })
  	},
	updatetaxexe:(req,res)=>{
		Taxexemption.update({id:req.param('id')},{reason:req.param('reason'),paragraph:req.param('paragraph'),type:req.param('type')}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Taxexemption.find({userid:req.param('userid'),sort:'createdAt DESC',limit:10}).exec((err,result)=>{	
				if(err) return res.negotiate(err);

        		return res.json({result:result})
			})
		})
		
	},
	 deletetaxexe:(req,res)=>{
	        Taxexemption.destroy({id: req.param('id')}).exec((err, deleted) => {
	          if (err) {
	            return res.negotiate(err)
	          }
	          Taxexemption.find({userid:req.param('userid'),sort:'createdAt DESC'})
	            .exec((err, result) => {
	              if (err) {
	                return res.negotiate(err)
	              }
	              return res.json({result:result})
	            })
	        })
  	},
	
};

