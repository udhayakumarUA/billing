/**
 * ReturnController
 *
 * @description :: Server-side logic for managing returns
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  tax:(req,res)=>{
    Tax.find({type: 'UTGST'}).exec((err, utgsts) => {
      if (err) return res.negotiate(err)
      Tax.find({type: 'CESS'}).exec((err, cesss) => {
        if (err) return res.negotiate(err)
        Tax.find({type: 'IGST'}).exec((err, igsts) => {
          if (err) return res.negotiate(err)
          Tax.find({type: 'CGST'}).exec((err, cgsts) => {
            if (err) return res.negotiate(err)
            Tax.find({type: 'SGST'}).exec((err, sgsts) => {
              if (err) return res.negotiate(err)
              return res.json({
                utgsts: utgsts,
                cesss: cesss,
                igsts: igsts,
                cgsts: cgsts,
                sgsts: sgsts,
              })
            })
          })
        })
      })
    })
  },

  getsid:(req,res)=>{
    Return.find({sort:'createdAt DESC'})
      .exec((err,result)=>{
        if(err){return res.negotiate(err)}
        Return.count().exec((err,count)=>{
          // console.log(result)
          if(result.length == 0){
            var refid = 1;
            return res.json({result:result,id:refid});
          }
          else{
            var refid = result[0].refid +1;
            return res.json({count:count,result:result,id:refid});
          }
        });
      });
    /*Purchaseproduct.destroy().exec((err,result)=>{
    	return res.json({result:result})
    })*/
  },

  addbill:(req,res)=>{
    var autoinc= 0;
    Return.find({sort:'refid DESC',limit:1}).exec((err,returnid)=>{

      if(returnid.length>=1) {

        var autoinc = parseInt(returnid[0].refid) + 1;
        var value = autoinc.toString()
        var refid ='RET-'+value.padStart(7,0);
      }
      if(returnid.length<1){
        var autoinc=1;
        var value = autoinc.toString()
        var refid ='RET-'+value.padStart(7,0);
      }
      Return.create({
        user:req.param('userid'),
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
        reason:req.param('reason'),
        totalcgst:req.param('totalcgst'),
        totalsgst:req.param('totalsgst'),
        totaligst:req.param('totaligst'),
        totalcess:req.param('totalcess'),
        refid:autoinc,
        totalsub:req.param('totalsub')
      }).exec((err,returncreated)=>{
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function(el) {
          var o = Object.assign({}, el);
          o.return = returncreated.id;
          o.returndate =req.param('returndate')
          return o;
        });
        Returnproduct.create(result).exec((err,returnproductcreated)=>{
          if (err) return res.negotiate(err);
          Returnproduct.find({return:returncreated.id,groupBy:['productid'],sum:['quantity']})
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

                  var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)-parseFloat(group.quantity)
                  Products.native(function (err, collection1) {
                    collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                      if (err) return res.negotiate(err);
                    });
                  })
                  callback();
                });
              });
              return res.json({message:'created',refid:refid})
            })
        })
      })
    })
  },


  getreturncount:(req,res)=>{
    Return.count().exec((err,count)=>{
      return res.json({count:count})
    })
  },


  getall:(req,res)=>{
    if(req.param('category')==='All') {
      Return.find({
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Return.count().exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({returns: returns,count:count})
          })
        })
    }
    else{
      Return.find({
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, Returns) => {
          if (err) return res.negotiate(err);
          Return.count({status: req.param('category')}).exec((err,count)=>{
            if (err) return res.negotiate(err);

            return res.json({returns: returns,count:count})
          })
        })
    }
  },

  searchreturn:(req,res)=> {
    if(req.param('category')==='Paid') {
      Return.find({
        or: [{Returnid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Return.count({
            or: [{returnid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}],
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({returns: returns, count: count})
          })
        })
    }
    else{
      Return.find({
        or: [{returnid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, returns) => {
          if (err) return res.negotiate(err);
          Return.count({
            or: [{returnid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}]
          }).exec((err, count) => {
            return res.json({returns: returns, count: count})
          })
        })
    }
  },

  singlereturn:(req,res)=>{
    Return.findOne({returnid:req.param('pid')})
      .populate('user')
      .populate('products')
      .exec((err,returns)=> {
        if (err) return res.negotiate(err);
        Defaulttem.findOne({template: 'return'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
          return res.json({returns: returns,template:tem})
        })
      })
  },
  singlereturntemp:(req,res)=>{
    Return.findOne({returnid:req.param('pid')})
      .populate('user')
      .populate('products')
      .exec((err,returns)=> {
        if (err) return res.negotiate(err);
        User.findOne({key:req.param('key')}).exec((err,user)=>{
          if (!user) {
            return res.json(401, {err: ' INVALID VALIDATION KEY'});
          }
          return res.json({returns: returns,user:user})
        })
      })
  },

  deletebill:(req,res)=>{
    Returnproduct.find({return:req.param('id'),groupBy:['productid'],sum:['quantity']}).exec((err,products)=>{
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

          var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)+parseFloat(group.quantity)
          Products.native(function (err, collection1) {
            collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

              if (err) return res.negotiate(err);
            });
          })
          callback();
        });
      });
      Return.destroy({id:req.param('id')}).exec((err,deleted)=>{
        if (err) return res.negotiate(err);
        Returnproduct.destroy({return:req.param('id')}).exec((err,deleted1)=> {
          if (err) return res.negotiate(err);
          Paymentmade.destroy({returnid:req.param('id')}).exec((err, deleted1) => {
            if (err) return res.negotiate(err);
            return res.json({message: 'deleted'})
          })
        })
      })
    })
  },
  salereport:(req,res)=>{
    Return.find({where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .populate('user')
    .exec((err, data) => {
        if (err) return res.negotiate(err);
        Return.find({where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
     .sum('maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess')
        .exec((err, totalreturn) => {
          return res.json({data: data, totalreturn: totalreturn})
        })
      })
  },

  returnbyitem:(req,res)=>{
    var date=req.param('startdate')
    var date1=req.param('enddate')
    console.log('returnbyitem')
    Returnproduct.find({ where:{"returndate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .sum('subtotal')
      .exec((err, data) => {
        Returnproduct.native(function(err, collection) {
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

  updatebill:(req,res)=>{
    console.log('enters')
    Returnproduct.find({return: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
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

            var balanceproduct=parseFloat(isNaN(resultSet.productfind.stockinhand)?0:resultSet.productfind.stockinhand)+parseFloat(group.quantity)
            Products.native(function (err, collection1) {
              collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                if (err) return res.negotiate(err);
              });
            })
            callback();
          });
        });
      })
    Returnproduct.destroy({return:req.param('id')}).exec((err,destroyed)=>{
      if(err) return res.negotiate(err);
    })
    Return.update({id:req.param('id')},{
      user:req.param('userid'),
      username:req.param('username'),
      billid:req.param('billid'),
      sourceofsuply:req.param('sourceofsuply'),
      returndate:req.param('returndate'),
      maintotal:req.param('maintotal'),
      taxtotal:req.param('taxtotal'),
      items:req.param('items'),
      balance:req.param('balance'),
      status:req.param('status'),
      reason:req.param('reason'),
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
      Returnproduct.create(result).exec((err, posproductcreated) => {
        if (err) return res.negotiate(err);
        Returnproduct.find({return: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
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

                var balanceproduct = parseFloat(isNaN(resultSet.productfind.stockinhand) ? 0 : resultSet.productfind.stockinhand) - parseFloat(group.quantity)
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

  searchcontact:(req,res)=>{
    Contact.find({type:'Vendor',
      or:[{firstname:{'contains':req.param('searchtext')}},
        {phonenumber:{'contains':req.param('searchtext')}}]
      ,limit:10})
      .populate('return',{or:[{status:'Partially Paid'},{status:'Draft'}]})
      .exec((err,result)=>{
        if(err){return res.negotiate(err)}
        return res.json({result:result})
      })
  },






};

