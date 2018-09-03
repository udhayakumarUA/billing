/**
 * ExpensesController
 *
 * @description :: Server-side logic for managing Expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getexpenseid:(req,res)=>{
		Expenses.find({sort:'createdAt DESC'})
		.populate('name')
		.exec((err,result)=>{

			if(err){return res.negotiate(err)}
			Expenses.count().exec((err,count)=>{

			if(result.length == 0){
				var expid = 1

				return res.json({result:result,id:expid})
			}
			else{
				var expid = result[0].expid +1
				return res.json({count:count,result:result,id:expid})
			}

		})
	})
	},

  getexpense:(req,res)=>{
    Expenses.find({sort:'expid DESC',limit:5})
      .populate('name')
      .exec((err,expenses)=>{
        return res.json({expenses:expenses})
      })
	},
	singleexpense:(req,res)=>{
    Expenses.findOne({expensesid:req.param('expid')})
      .populate('name')
      .exec((err,expense)=>{
        return res.json({expense:expense})
      })
  },

	getmoreexpenses:(req,res)=>{
	    Expenses.find({skip:req.param('skip'),limit:req.param('row'),sort:'expid DESC'})
	    .populate('name')
	    .exec((err,finded)=>{
	       Expenses.count()
	      .exec((err,count)=>{
	      if(err){return res.negotiate(err)}
	      return res.json({result:finded,count:count})
	      })
	    })
  },
	searchexpenses:(req,res)=>{
		Expenses.find({expensesid:{'contains':req.param('searchtext')}
			,limit:req.param('row')})
		.populate('name')
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Expenses.count({expensesid:{'contains':req.param('searchtext')}}).exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
	},
	 searchgetmore:(req,res)=>{
	  	Expenses.find({expensesid:{'contains':req.param('searchtext')},
				skip:req.param('skip'),limit:req.param('row')})
	  	.populate('name')
	  	.exec((err,result)=>{
			if(err){return res.negotiate(err)}
		Expenses.count({expensesid:{'contains':req.param('searchtext')}})
		.exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
  },
	getbyname:(req,res)=>{
		Expenses.find({sort:'date ASC'}).where({ "date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate') }})
		.sum('amount','tax')
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Expenses.find().where({ "date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate') }})
			.groupBy('expensetype')
			.sum('amount','tax')
			.exec((err,values)=>{

				if(err){return res.negotiate(err)}
				return res.json({result:result,values:values})
			})
		})

	},
	getbydate:(req,res)=>{
		var date=req.param('startdate')
		var date1=req.param('enddate')
		Expenses.find({sort:'date ASC'}).where({ "date" : { ">=" :date, "<=" :date1}})
		.populate('name')
		.populate('clientid')
		.exec((err,dt)=>{
		Expenses.native(function(err, collection) {
			if (err) return res.serverError(err);
			collection.aggregate([
			  {
				$match:{
				 date:{$gte:date,$lte:date1}
				}},
			  { $group: {
				  _id: "$user",
				maintotal:{
					$sum:"$amount"
				},
				totaltax:{
				  $sum:"$tax"
				},
				  total: {
					$sum: 1
				  }
				}
			  },
			  {
				$lookup:
				  {
					from: "contact",
					localField: "name",
					foreignField: "id",
					as: "singleuser"
				  }
			  }
			]).toArray(function (err, results) {
			  if (err) return res.serverError(err);
				return res.json({result:results,dt:dt})
			});
		  });
		})
	},

	getbysinglecategory:(req,res)=>{
		var date=req.param('startdate')
		var date1=req.param('enddate')
		Expenses.find({expensetype:req.param('expensetype'),sort:'date ASC'}).where({ "date" : { ">=" :date, "<=" :date1}})
		.populate('name')
		.exec((err,data)=>{
		Expenses.native(function(err, collection) {
			if (err) return res.serverError(err);
			collection.aggregate([
			  {
				$match:{
					expensetype:req.param('expensetype'),
				 date:{$gte:date,$lte:date1}
				}},
			  { $group: {
				  _id: "$user",
				maintotal:{
					$sum:"$amount"
				},
				totaltax:{
				  $sum:"$tax"
				},
				  total: {
					$sum: 1
				  }
				}
			  },
			  {
				$lookup:
				  {
					from: "contact",
					localField: "name",
					foreignField: "id",
					as: "singleuser"
				  }
			  }
			]).toArray(function (err, expenses) {
			  if (err) return res.serverError(err);
				return res.json({expenses:expenses,data:data})
			});
		  });
		})
	},

	addexpenses:(req,res)=>{

    var autoinc= 0;
    Expenses.find({sort:'expid DESC',limit:1}).exec((err,expensesid)=> {
      if (expensesid.length >= 1) {

        var autoinc = parseInt(expensesid[0].expid) + 1;
        var value = autoinc.toString()
        var expid = 'EXP-' + value.padStart(7, 0);
      }
      if (expensesid.length < 1) {
        var autoinc = 1;
        var value = autoinc.toString()
        var expid = 'EXP-' + value.padStart(7, 0);
      }
      Expenses.create({
        expensetype: req.param('expensetype'),
				amount: req.param('amount'),
				cess:req.param('cess'),
				igst:req.param('igst'),
				cgst:req.param('cgst'),
				sgst:req.param('sgst'),
        tax: req.param('tax'),
        date: req.param('date'),
        paymentmode: req.param('paymentmode'),
        name: req.param('name'),
        expensesid: expid,
        clientid: req.param('clientid'),
        expid: autoinc
      })
        .exec((err, data) => {
          if (err) {return res.negotiate(err)}
					Expenselist.update({type:req.param('expensetype')},{used:true})
					.exec(err=>{
						if (err) {return res.negotiate(err)}
					})
					return res.json({result: data})
        })
    })
	},
	updateexpenses:(req,res)=>{
				Expenses.update({expensesid:req.param('expensesid')},
				{expensetype:req.param('expensetype'),
				amount:req.param('amount'),
				tax:req.param('tax'),
				cess:req.param('cess'),
				igst:req.param('igst'),
				cgst:req.param('cgst'),
				sgst:req.param('sgst'),
				date:req.param('date'),
				paymentmode:req.param('paymentmode'),
				name:req.param('name')})
				.exec((err,data)=>{
					if(err){return res.negotiate(err)}

					return res.json({result:data})
				})
			},
	deleteexpense:(req,res)=>{
		Expenses.destroy({id:req.param('id')}).exec((err,data)=>{
			if(err){return res.negotiate(err)}
			Expenses.findOne({expensetype:req.param('type')}).exec((err,finded)=>{
				if(finded==undefined){
					Expenselist.update({type:req.param('type')},{used:false}).exec((err,updated)=>{
						if(err){return res.negotiate(err)}
					})
				}
			Expenses.find({sort:'expid DESC'})
			.populate('name')
			.exec((err,result)=>{
				return res.json({result:result})
			})
		})
		})
	}

};

