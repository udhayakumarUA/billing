/**
 * PosconfigController
 *
 * @description :: Server-side logic for managing Posconfigs
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {


	getconfig:(req,res)=>{
		console.log('enter')
		Posconfig.findOne({type:'one'}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			if(result){
				Contact.findOne({id:result.customer}).exec((err,data)=>{
					if(err){return res.negotiate(err)}
			 return res.json({
         result:data,
         description:result.description,
         terms:result.terms,
         header:result.header
			 })
				})
			}
			else{
				console.log('nothing')
			}
		})
	},

  getposconfig:(req,res)=>{
    Posconfig.find()
      .exec((err,config)=>{
        return res.json({config:config})
      })
  },

	adddisc:(req,res)=>{
		Posconfig.findOne({type:'one'}).exec((err, found)=>{
			if(err){console.log(err)}
			if(found){
				Posconfig.update({type:'one'},{description:req.param('description'),terms:req.param('terms'),customer:req.param('id')
			 }).exec((err,update)=>{
			 	if(err){return res.negotiate(err)}
			 		return res.json({result:update})
			 })
			}
			else{
				Posconfig.create({description:req.param('description'),terms:req.param('terms'),customer:req.param('id'),type:'one'})
					.exec((newfaq)=>{
						return res.json({result:newfaq})
					})
			}
		})
	},
  poscount:(req,res)=> {
    Pos.find({sort: 'autoinc DESC', limit: 1}).exec((err, posid) => {
      if (err) return res.negotiate(err);
      return res.json({poscount: posid.length})
    })
  },
  startinvoice:(req,res)=>{
    Posconfig.findOne({type:'one'}).exec((err, found)=>{
      console.log(found)
      if(err){console.log(err)}
      if(found){
        Posconfig.update({type:'one'},{header:req.param('header')
        }).exec((err,update)=>{
          if(err){return res.negotiate(err)}
          return res.json({result:update})
        })
      }
      else{
        Posconfig.create({type:'one',header:req.param('header')})
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

