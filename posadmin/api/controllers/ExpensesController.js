/**
 * ExpensesController
 *
 * @description :: Server-side logic for managing Expenses
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	getexpenseid:(req,res)=>{
		Expenses.find({userid:req.param('userid'),sort:'createdAt DESC'})
		.populate('name')
		.exec((err,result)=>{

			if(err){return res.negotiate(err)}
			Expenses.count({userid:req.param('userid')}).exec((err,count)=>{

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
    Expenses.find({userid:req.param('userid'),sort:'expid DESC',limit:5})
      .populate('name')
      .exec((err,expenses)=>{
        return res.json({expenses:expenses})
      })
	},
	singleexpense:(req,res)=>{
    Expenses.findOne({userid:req.param('userid'),expensesid:req.param('expid')})
      .populate('name')
      .exec((err,expense)=>{
        return res.json({expense:expense})
      })
  },

	getmoreexpenses:(req,res)=>{
	    Expenses.find({userid:req.param('userid'),skip:req.param('skip'),limit:req.param('row'),sort:'createdAt DESC'})
	    .populate('name')
	    .exec((err,finded)=>{
	       Expenses.count({userid:req.param('userid')})
	      .exec((err,count)=>{
	      if(err){return res.negotiate(err)}
	      return res.json({result:finded,count:count})
	      })
	    })
  },
	searchexpenses:(req,res)=>{
		Expenses.find({userid:req.param('userid'),expensesid:{'contains':req.param('searchtext')}
			,limit:req.param('row')})
		.populate('name')
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Expenses.count({userid:req.param('userid'),expensesid:{'contains':req.param('searchtext')}}).exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
	},
	 searchgetmore:(req,res)=>{
	  	Expenses.find({userid:req.param('userid'),expensesid:{'contains':req.param('searchtext')},
				skip:req.param('skip'),limit:req.param('row')})
	  	.populate('name')
	  	.exec((err,result)=>{
			if(err){return res.negotiate(err)}
		Expenses.count({userid:req.param('userid'),expensesid:{'contains':req.param('searchtext')}})
		.exec((err,count)=>{
				if(err){return res.negotiate(err)}
				return res.json({count:count,result:result})
			})
		})
  },
	getbyname:(req,res)=>{
		Expenses.find({userid:req.param('userid'),sort:'date ASC'}).where({ "date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate') }})
		.sum('amount','tax')
		.exec((err,result)=>{
			if(err){return res.negotiate(err)}
			Expenses.find({userid:req.param('userid')}).where({ "date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate') }})
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
		var userid = req.param('userid')
		Expenses.find({userid:req.param('userid'),sort:'date ASC'}).where({ "date" : { ">=" :date, "<=" :date1}})
		.populate('name')
		.exec((err,dt)=>{
		Expenses.native(function(err, collection) {
			if (err) return res.serverError(err);
			collection.aggregate([
			  {
				$match:{
					userid:userid,
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
	addexpenses:(req,res)=>{
		var value = "0000000"
		Expenses.find({userid:req.param('userid'),sort:'expid DESC'}).exec((err,expense)=>{
			console.log(expense)		
			if(expense.length == 0){
							var expid = 1
							var str=""+expid
							var expenseid ='EXP-'+(value.substring(str.length)+str);	
						}
						else{
							var expid = expense[0].expid +1
							var str=""+expid
							var expenseid = 'EXP-' + (value.substring(str.length) + (str));
						}
			Expenses.create({
				userid:req.param('userid'),
				roleid:req.param('roleid'),
			expensetype:req.param('expensetype'),
			amount:req.param('amount'),
			tax:req.param('tax'),
			date:req.param('date'),
			paymentmode:req.param('paymentmode'),
			name:req.param('name'),
			expensesid:expenseid,expid:expid
		})
			.exec((err,data)=>{
				if(err){return res.negotiate(err)}
				return res.json({result:data})
			})
		})
	},
	updateexpenses:(req,res)=>{
				Expenses.update({expensesid:req.param('expensesid')},{expensetype:req.param('expensetype'),amount:req.param('amount'),tax:req.param('tax'),date:req.param('date'),
					paymentmode:req.param('paymentmode'),name:req.param('name')})
				.exec((err,data)=>{
					if(err){return res.negotiate(err)}
		
					return res.json({result:data})
				})
			},
	deleteexpense:(req,res)=>{
		Expenses.destroy({id:req.param('id')}).exec((err,data)=>{
			if(err){return res.negotiate(err)}
			Expenses.find({userid:req.param('userid'),sort:'expid DESC'})
			.populate('name')
			.exec((err,result)=>{
				return res.json({result:result})
			})
		})
	}

};

