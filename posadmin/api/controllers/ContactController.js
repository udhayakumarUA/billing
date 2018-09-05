/**
 * ContactController
 *
 * @description :: Server-side logic for managing Contacts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	addcontact:(req,res)=>{

		Contact.create({pannumber:req.param('pannumber'),userid:req.param('userid'),taxtype:req.param('taxtype'),type:req.param('type'),salutation:req.param('salutation'),firstname:req.param('firstname'),lastname:req.param('lastname'),company:req.param('company'),email:req.param('email'),phonenumber:req.param('phonenumber'),
		mobilenumber:req.param('mobilenumber'),address:req.param('address'), gsttype:req.param('gsttype'),gstin:req.param('gstin'),plos:req.param('pos'),sos:req.param('sos'),statecode:req.param('statecode')})
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			return res.json({result:result})
		})
	},
	getcontact:(req,res)=>{
		Contact.find({userid:req.param('userid'),limit:req.param('limit'),sort:'createdAt DESC'}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Contact.count({userid:req.param('userid')}).exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
	},
	getmorecontact:(req,res)=>{
	    Contact.find({userid:req.param('userid'),skip:req.param('skip'),limit:req.param('limit'),sort:'createdAt DESC'})
	    .exec((err,finded)=>{
	       Contact.count({userid:req.param('userid'),skip:req.param('skip')})
	      .exec((err,count)=>{
	      if(err){return res.negotiate(err)}
	      return res.json({result:finded,count:count})
	      })
	    })
  },
	getsinglecontact:(req,res)=>{
		Contact.findOne({id:req.param('id')})
		.populate('estimate',{sort:'createdAt DESC',limit:1000})
		.populate('pos',{sort:'createdAt DESC',limit:1000})
		.populate('paymentreceived',{sort:'createdAt DESC',limit:1000})
		.populate('purchase',{sort:'createdAt DESC',limit:1000})
		.populate('paymentmade',{sort:'createdAt DESC',limit:1000})
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			return res.json({result:result})
		})
	},
	searchcontact:(req,res)=>{
		Contact.find({userid:req.param('userid'),
			or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}},
				{company:{'contains':req.param('searchtext')}}]
			,limit:req.param('limit')}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Contact.count({userid:req.param('userid'),or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}},
				{company:{'contains':req.param('searchtext')}}]}).exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
	},
	searchcontacttype:(req,res)=>{
		Contact.find({type:req.param('type'),userid:req.param('userid'),
			or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}}]
			,limit:req.param('limit')}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Contact.count({type:req.param('type'),userid:req.param('userid'),or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}}]}).exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
	},
	 searchgetmore:(req,res)=>{
	  	Contact.find({userid:req.param('userid'),
			or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}},
				{company:{'contains':req.param('searchtext')}}],
				skip:req.param('skip'),limit:req.param('limit')})
	  	.exec((err,result)=>{
			if(err){return res.negotiate(err)}
		Contact.count({userid:req.param('userid'),
			or:[{firstname:{'contains':req.param('searchtext')}},
				{phonenumber:{'contains':req.param('searchtext')}},
				{company:{'contains':req.param('searchtext')}}]})
		.exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
  },
  	updatecontact:(req,res)=>{
		Contact.update({id:req.param('id')},{pannumber:req.param('pannumber'),taxtype:req.param('taxtype'),type:req.param('type'),salutation:req.param('salutation'),firstname:req.param('firstname'),lastname:req.param('lastname'),company:req.param('company'),email:req.param('email'),phonenumber:req.param('phonenumber'),
		mobilenumber:req.param('mobilenumber'),address:req.param('address'), gsttype:req.param('gsttype'),gstin:req.param('gstin'),plos:req.param('pos'),sos:req.param('sos'),statecode:req.param('statecode')})
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			return res.json({result:result})
		})
	},
	deletecontact:(req,res)=>{
		Contact.destroy({id:req.param('id')}).exec((err,result)=>{
			if(err){return res.negotiate(err)}
			return res.json({result:result})
		})
	},
	getbills:(req,res)=>{
		Contact.findOne({id:req.param('id')})
		.populate('pos',{posid:{'contains':req.param('searchtext')},limit:10,sort:'createdAt ASC'})
		.exec((err,result)=>{
			return res.json({result:result})
		})	
	}


};

