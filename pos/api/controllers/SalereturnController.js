/**
 * SalereturnController
 *
 * @description :: Server-side logic for managing salereturns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	 gettax:(req,res)=>{
	 	var refid='';
	 	async.parallel({
        cesss: function(cesss){
        Tax.find({type: 'CESS'}).exec(cesss);
        },
        igsts: function(igsts){
        Tax.find({type: 'IGST'}).exec(igsts);
        },
        cgsts: function(cgsts){
        Tax.find({type: 'CGST'}).exec(cgsts);
        },
        sgsts: function(sgsts){
        Tax.find({type: 'SGST'}).exec(sgsts);
        },
        result:function(callback){
    	Salereturn.find({sort:'createdAt DESC'})
         .exec((err,result)=>{
        if(err){return res.negotiate(err)}
        	if(result.length == 0){
            refid = 1;
          }
          else{
            refid = result[0].refid +1;
      		 }
        	callback(null,result)
    	})
       },
       count:function(callback){
       	Salereturn.count().exec((err,count)=>{
      		 callback(null,count)
          });
		       }
			},
		function(err, data) {
		    console.log(data)
		    return res.json({cesss:data.cesss,
		    	igsts:data.igsts,
		    	cgsts:data.cgsts,
		    	sgsts:data.sgsts,
		    	count:data.count,
		    	result:data.result,
		    	id:refid
		    })
		});
    },
    addbill:(req,res)=>{

    Salereturn.find({sort:'refid DESC',limit:1}).exec((err,returnid)=>{
      if(returnid.length>=1) {

        var autoinc = parseInt(returnid[0].refid) + 1;
        var value = autoinc.toString()
        var refid ='SRT-'+value.padStart(7,0);
      }
      if(returnid.length<1){
        var autoinc=1;
        var value = autoinc.toString()
        var refid ='SRT-'+value.padStart(7,0);
      }
      Salereturn.create({
        user:req.param('userid'),
        reason:req.param('reason'),
        username:req.param('username'),
        returnid:refid,
        billid:req.param('billid'),
        sourceofsuply:req.param('sourceofsuply'),
        returndate:req.param('returndate'),
        maintotal:req.param('maintotal'),
        taxtotal:req.param('taxtotal'),
        items:req.param('items'),
        balance:req.param('balance'),
        status:req.param('status'),
        totalcgst:req.param('totalcgst'),
        totalsgst:req.param('totalsgst'),
        totaligst:req.param('totaligst'),
        totalcess:req.param('totalcess'),
        refid:autoinc,
        totalsub:req.param('totalsub'),
        clientid:req.param('clientid')
      }).exec((err,returncreated)=>{
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function(el) {
          var o = Object.assign({}, el);
          o.return = returncreated.id;
          o.returndate =req.param('returndate')
          return o;
        });
        Salereturnproduct.create(result).exec((err,returnproductcreated)=>{
          if (err) return res.negotiate(err);
          Salereturnproduct.find({return:returncreated.id,groupBy:['productid'],sum:['quantity']})
            .exec((err,grouped)=>{
              if (err) return res.negotiate(err);
              async.each(grouped, function (group, callback) {
                var populateTasks = {
                  productfind: function (cb) {
                    Products.native(function (err, collection) {
                      collection.findOne({_id: group.productid},function (err, result1) {
                        console.log(result1)
                        cb(err, result1);
                      });
                    })
                  }
                };

                async.parallel(populateTasks, function (err, resultSet) {
                  if (err) { return next(err); }

                  var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)+parseFloat(group.quantity)
                  Products.native(function (err, collection1) {
                    collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                      if (err) return res.negotiate(err);
                    });
                  })
                  callback();
                });
              });
              return res.json({message:'created'})
            })
        })
      })
    })
  },

  returnbyitem:(req,res)=>{
    var date=req.param('startdate')
    var date1=req.param('enddate')
    console.log('returnbyitem')
    Salereturnproduct.find({ where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .sum('subtotal')
      .exec((err, data) => {
        Salereturnproduct.native(function(err, collection) {
          if (err) return res.serverError(err);
          collection.aggregate([
            {
              $match:{
                returndate:{$gte:date,$lte:date1}
              }},
            { $group: {
              _id:{productid:"$productid"},
              quantity:{
                $sum:"$quantity"
              },
              totalwithtax:{
                $sum:"$subtotal"
              },
              totalsub:{
                $sum:{ $multiply: [ "$rate", "$quantity" ] }
              },
              totalcgst:{
                $sum:"$singlecgst"
              },
              totalsgst:{
                $sum:"$singlesgst"
              },
              totaligst:{
                $sum:"$singleigst"
              },
              totalcess:{
                $sum:"$singlecess"
              },
              total: {
                $sum: 1
              }
            }
            },
            {
              $lookup:
                {
                  from: "products",
                  localField: "_id.productid",
                  foreignField: "_id",
                  as: "productname"
                }
            }

          ]).toArray(function (err, results) {
            if (err) return res.serverError(err);
            return res.json({ amount: data,result:results })
          });
        });
      })
  },
  singlereturn:(req,res)=>{
    Salereturn.findOne({returnid:req.param('sid')})
      .populate('user')
      .populate('products')
      .exec((err,returns)=> {
        if (err) return res.negotiate(err);
        Pos.findOne({posid:returns.billid}).exec((err,posid)=>{
        Defaulttem.findOne({template: 'return'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
          return res.json({returns: returns,template:tem,posid:posid})
        })
        })
      })
  },
  deletebill:(req,res)=>{
    Salereturnproduct.find({return:req.param('id'),groupBy:['productid'],sum:['quantity']}).exec((err,products)=>{
      if (err) return res.negotiate(err);
      async.each(products, function (group, callback) {
        var populateTasks = {
          productfind: function (cb) {
            Products.native(function (err, collection) {
              collection.findOne({_id: group.productid},function (err, result1) {
                console.log(result1)
                cb(err, result1);
              });
            })
          }
        };

        async.parallel(populateTasks, function (err, resultSet) {
          if (err) { return next(err); }

          var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)-parseFloat(group.quantity)
          Products.native(function (err, collection1) {
            collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

              if (err) return res.negotiate(err);
            });
          })
          callback();
        });
      });
      Salereturn.destroy({id:req.param('id')}).exec((err,deleted)=>{
        if (err) return res.negotiate(err);
        Salereturnproduct.destroy({return:req.param('id')}).exec((err,deleted1)=> {
          if (err) return res.negotiate(err);
          Paymentmade.destroy({returnid:req.param('id')}).exec((err, deleted1) => {
            if (err) return res.negotiate(err);
            return res.json({message: 'deleted'})
          })
        })
      })
    })
  },
  getreturncount:(req,res)=>{
    Salereturn.count().exec((err,count)=>{
      return res.json({count:count})
    })
  },
   getall:(req,res)=>{
    if(req.param('category')==='All') {
      Salereturn.find({
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Salereturn.count().exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({returns: returns,count:count})
          })
        })
    }
    else{
      Salereturn.find({
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Salereturn.count({status: req.param('category')}).exec((err,count)=>{
            if (err) return res.negotiate(err);

            return res.json({returns: returns,count:count})
          })
        })
    }
  },
  salereport:(req,res)=>{
    Salereturn.find({where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .populate('user')
    .exec((err, data) => {
        if (err) return res.negotiate(err);
      Salereturn.find({where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
     .sum('maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess')
        .exec((err, totalreturn) => {
          return res.json({data: data, totalreturn: totalreturn})
        })
      })
  },
   searchreturn:(req,res)=> {
    if(req.param('category')==='Paid') {
      Salereturn.find({
        or: [{Returnid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Salereturn.count({
            or: [{returnid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}],
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({returns: returns, count: count})
          })
        })
    }
    else{
      Salereturn.find({
        or: [{returnid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Salereturn.count({
            or: [{returnid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}]
          }).exec((err, count) => {
            return res.json({returns: returns, count: count})
          })
        })
    }
  },
  updatebill:(req,res)=>{
console.log(req.param('product'))
    Salereturnproduct.find({return: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
      .exec((err, products) => {
        if (err) return res.negotiate(err);
        async.each(products, function (group, callback) {
          var populateTasks = {
            productfind: function (cb) {
              Products.native(function (err, collection) {
                collection.findOne({_id: group.productid},function (err, result1) {
                  cb(err, result1);
                });
              })
            }
          };

          async.parallel(populateTasks, function (err, resultSet) {
            if (err) { return next(err); }

            var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)-parseFloat(group.quantity)
            Products.native(function (err, collection1) {
              collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                if (err) return res.negotiate(err);
              });
            })
            callback();
          });
        });
      })
    Salereturnproduct.destroy({return:req.param('id')}).exec((err,destroyed)=>{
      if(err) return res.negotiate(err);
    })
    Salereturn.update({id:req.param('id')},{
      user:req.param('userid'),
      reason:req.param('reason'),
      username:req.param('username'),
      billid:req.param('billid'),
      sourceofsuply:req.param('sourceofsuply'),
      returndate:req.param('returndate'),
      maintotal:req.param('maintotal'),
      taxtotal:req.param('taxtotal'),
      items:req.param('items'),
      balance:req.param('balance'),
      status:req.param('status'),
      totalcgst:req.param('totalcgst'),
      totalsgst:req.param('totalsgst'),
      totaligst:req.param('totaligst'),
      totalcess:req.param('totalcess'),
      totalsub:req.param('totalsub')
    }).exec((err,poscreated)=> {
      if (err) return res.negotiate(err);
      var result = req.param('product').map(function (el) {
        var o = Object.assign({}, el);
        o.return = req.param('id');
        o.returndate =req.param('returndate')
        return o;
      });
      Salereturnproduct.create(result).exec((err, posproductcreated) => {
        if (err) return res.negotiate(err);
        Salereturnproduct.find({return: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
          .exec((err, grouped) => {
            if (err) return res.negotiate(err);
            async.each(grouped, function (group, callback) {
              var populateTasks = {
                productfind: function (cb) {
                  Products.native(function (err, collection) {
                    collection.findOne({_id: group.productid},function (err, result1) {
                      
                      cb(err, result1);
                    });
                  })
                }
              };

              async.parallel(populateTasks, function (err, resultSet) {
                if (err) {
                  return next(err);
                }

                var balanceproduct = parseFloat(isNaN(resultSet.productfind.stockinhand) ? 0 : resultSet.productfind.stockinhand) + parseFloat(group.quantity)
                Products.native(function (err, collection1) {
                  collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                    if (err) return res.negotiate(err);
                  });
                })
                callback();
              });
            });
            return res.json({message: 'created'})
          })
      })
    })
  },

};

