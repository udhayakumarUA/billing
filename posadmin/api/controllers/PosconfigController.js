/**
 * PosconfigController
 *
 * @description :: Server-side logic for managing Posconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	getconfig:(req,res)=>{
		Posconfig.findOne({userid:req.param('userid'),type:'one'}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			if(result){
				Contact.findOne({userid:req.param('userid'),id:result.customer}).exec((err,data)=>{
					if(err){return res.negotiate(err)}
			 return res.json({result:data,description:result.description,terms:result.terms})
				})
			}
			else{
				console.log('nothing')
			}
		})
	},

  getposconfig:(req,res)=>{
    Posconfig.find({userid:req.param('userid')})
      .exec((err,config)=>{
        return res.json({config:config})
      })
  },

	adddisc:(req,res)=>{
		Posconfig.findOne({userid:req.param('userid'),type:'one'}).exec((err, found)=>{
			if(err){console.log(err)}
			if(found){
				console.log('found');
				Posconfig.update({userid:req.param('userid'),type:'one'},{description:req.param('description'),terms:req.param('terms'),customer:req.param('id')
			 }).exec((err,update)=>{
			 	if(err){return res.negotiate(err)}
			 		return res.json({result:update})
			 })
			}
			else{
				Posconfig.create({userid:req.param('userid'),description:req.param('description'),terms:req.param('terms'),customer:req.param('id'),type:'one'})
					.exec((newfaq)=>{

						return res.json({result:newfaq})
					})
			}
		})
	},
	// addcustomer:(req,res)=>{
	// 	Posconfig.update({description:req.param('description')}).exec((err,result)=>{
	// 		if(err){return res.negotiate(err)}
	// 		 return res.json({result:result})
	// 	})
	// },

};

