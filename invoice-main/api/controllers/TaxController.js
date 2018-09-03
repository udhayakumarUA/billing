/**
 * TaxController
 *
 * @description :: Server-side logic for managing Taxes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	generatetax:(req,res)=>{
		const taxes = [
			{name:'SGST (2.5)',type:'SGST',rate:2.5},{name:'CGST (2.5)',type:'CGST',rate:2.5},{name:'IGST (5)',type:'IGST',rate:5},
			{name:'SGST (6)  ',type:'SGST',rate:6 },{name:'CGST (6)',type:'CGST',rate:6 },{name:'IGST (12)',type:'IGST',rate:12},
			{name:'SGST (9)  ',type:'SGST',rate:9 },{name:'CGST (9)',type:'CGST',rate:9 },{name:'IGST (18)',type:'IGST',rate:18 },
			{name:'SGST (14) ',type:'SGST',rate:14},{name:'CGST (14)',type:'CGST',rate:14},{name:'IGST (28)',type:'IGST',rate:28},
			{name:'CESS (1)',type:'CESS',rate:1},{name:'CESS (3)',type:'CESS',rate:3},{name:'CESS (15)',type:'CESS',rate:15},
		]
		Tax.create(taxes).exec((err,api)=>{
			if(err) return res.negotiate(err);
			return res.json({data:api})
		})
	},
	addtax:(req,res)=>{
		Tax.create({name:req.param('taxname'),type:req.param('taxtype'),rate:req.param('taxrate')}).exec((err,result)=>{
			if(err) return res.negotiate(err);
			Tax.find({sort:'createdAt DESC',limit:20}).exec((err,data)=>{	
				Tax.count({sort:'createdAt DESC'}).exec((err,count)=>{	
						if(err) return res.negotiate(err);			
        	return res.json({data:data,message:'created',count:count})
			})
		})
	})
	},
	gettaxes:(req,res)=>{
		Tax.find({sort:'createdAt DESC',limit:20}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Tax.count({sort:'createdAt DESC'}).exec((err,count)=>{	
				if(err) return res.negotiate(err);
        	return res.json({result:result,count:count})
		})
	})
	},

	getmoretax:(req,res)=>{
		console.log(req.param('skip'))
		Tax.find({sort:'createdAt DESC',skip:req.param('skip'),limit:20}).exec((err,result)=>{	
			if(err) return res.negotiate(err);
			Tax.count({sort:'createdAt DESC'}).exec((err,count)=>{	
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
        	Tax.find({sort:'createdAt DESC'}).exec((err,result)=>{	
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
	          Tax.find({sort:'createdAt DESC'})
	            .exec((err, result) => {
	              if (err) {
	                return res.negotiate(err)
	              }
	              return res.json({result:result})
	            })
	        })
  	},
	
};

