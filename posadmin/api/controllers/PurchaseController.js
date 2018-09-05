/**
 * PurchaseController
 *
 * @description :: Server-side logic for managing purchases
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  tax:(req,res)=>{
    Tax.find({userid:req.param('userid'),type: 'UTGST'}).exec((err, utgsts) => {
    if (err) return res.negotiate(err)
      Tax.find({userid:req.param('userid'),type: 'CESS'}).exec((err, cesss) => {
      if (err) return res.negotiate(err)
        Tax.find({userid:req.param('userid'),type: 'IGST'}).exec((err, igsts) => {
        if (err) return res.negotiate(err)
          Tax.find({userid:req.param('userid'),type: 'CGST'}).exec((err, cgsts) => {
          if (err) return res.negotiate(err)
            Tax.find({userid:req.param('userid'),type: 'SGST'}).exec((err, sgsts) => {
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

addbill:(req,res)=>{
  var value = "0000000"
var refid='';
var referenceid='';
    Purchase.find({userid:req.param('id'),sort:'refid DESC',limit:1}).exec((err,purchaseid)=>{
      console.log(purchaseid[0])
      if (err) return res.negotiate(err);
      if(purchaseid.length>=1) {
        var refid = parseInt(purchaseid[0].refid)+1
        var str=""+refid
       var referenceid ='REF-'+(value.substring(str.length) + (str));
      }
      if(purchaseid.length<1){
        var refid = 1
        var str=""+refid
       var referenceid ='REF-'+(value.substring(str.length)+str);
      }

      Purchase.create({
        userid:req.param('id'),
        roleid:req.param('roleid'),
        user:req.param('userid'),
        username:req.param('username'),
        purchaseid:referenceid,
        billid:req.param('billid'),
        sourceofsuply:req.param('sourceofsuply'),
        purchasedate:req.param('purchasedate'),
        duedate:req.param('duedate'),
        notes:req.param('notes'),
        maintotal:req.param('maintotal'),
        taxtotal:req.param('taxtotal'),
        items:req.param('items'),
        balance:req.param('balance'),
        status:req.param('status'),
        totalcgst:req.param('totalcgst'),
        totalsgst:req.param('totalsgst'),
        totaligst:req.param('totaligst'),
        totalcess:req.param('totalcess'),
        refid:refid,
        totalsub:req.param('totalsub'),
        adjustment:req.param('adjustment')
      }).exec((err,purchasecreated)=>{
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function(el) {
          var o = Object.assign({}, el);
          o.purchase = purchasecreated.id;
          o.purchasedate =req.param('purchasedate')
          o.userid=req.param('id')
          o.roleid=req.param('roleid')
          return o;
        });
        Purchaseproduct.create(result).exec((err,purchaseproductcreated)=>{
          if (err) return res.negotiate(err);
          Purchaseproduct.find({userid:req.param('userid'),purchase:purchasecreated.id,groupBy:['productid'],sum:['quantity']})
            .exec((err,grouped)=>{
              if (err) return res.negotiate(err);
              async.each(grouped, function (group, callback) {
                var populateTasks = {
                  productfind: function (cb) {
                    Products.native(function (err, collection) {
                      collection.findOne({_id: group.productid},function (err, result1) {
                        // console.log(result1)
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
              return res.json({message:'created',pid:purchasecreated.purchaseid})
            })
        })
      })
    })
  },
  getsid:(req,res)=>{
    Purchase.find({userid:req.param('userid'),sort:'createdAt DESC'})
      .exec((err,result)=>{
        if(err){return res.negotiate(err)}
        Purchase.count({userid:req.param('userid')}).exec((err,count)=>{
         
          if(result.length == 0){
            var refid = 1

            return res.json({result:result,id:refid})
          }
          else{
            var refid = result[0].refid +1
            
            return res.json({count:count,result:result,id:refid})
          }

        })
      })
    /*Purchaseproduct.destroy().exec((err,result)=>{
    	return res.json({result:result})
    })*/
  },

  getpurchasecount:(req,res)=>{
    Purchase.count({userid:req.param('userid')}).exec((err,count)=>{
      return res.json({count:count})
    })
  },

  getpurchase:(req,res)=>{
    Purchase.find({
      userid:req.param('userid'),
      sort: 'refid DESC',
      limit:5})
      .populate('user')
      .exec((err,purchase)=>{
      return res.json({purchase:purchase})
    })
  },

  getall:(req,res)=>{
    if(req.param('category')==='All') {
      Purchase.find({
        userid:req.param('userid'),
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, purchases) => {
          if (err) return res.negotiate(err);
          Purchase.count({userid:req.param('userid'),status: req.param('category')}).exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({purchases: purchases,count:count})
          })
        })
    }
    else{
      Purchase.find({
        userid:req.param('userid'),
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, purchases) => {
          if (err) return res.negotiate(err);
          Purchase.count({userid:req.param('userid'),status: req.param('category')}).exec((err,count)=>{
            if (err) return res.negotiate(err);

            return res.json({purchases: purchases,count:count})
          })
        })
    }
  },

  searchpurchase:(req,res)=> {
    if(req.param('category')==='Paid') {
      Purchase.find({userid:req.param('userid'),
        or: [{purchaseid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, purchases) => {
          if (err) return res.negotiate(err);
          Purchase.count({userid:req.param('userid'),
            or: [{purchaseid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}],
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({Purchases: Purchases, count: count})
          })
        })
    }
    else{
      Purchase.find({userid:req.param('userid'),
        or: [{purchaseid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'refid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, purchases) => {
          if (err) return res.negotiate(err);
          Purchase.count({userid:req.param('userid'),
            or: [{purchaseid: {'contains': req.param('searchtext')}},
              {username: {'contains': req.param('searchtext')}}]
          }).exec((err, count) => {
            return res.json({purchases: purchases, count: count})
          })
        })
    }
  },

  singlepurchase:(req,res)=>{
    Purchase.findOne({userid:req.param('userid'),purchaseid:req.param('pid')})
      .populate('user')
      .populate('products')
      .exec((err,purchase)=> {
        if (err) return res.negotiate(err);
        Defaulttem.findOne({userid:req.param('userid'),template: 'purchase'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
          return res.json({purchase: purchase,template:tem})
        })
      })
  },
  singlepurchasetemp:(req,res)=>{
    Purchase.findOne({purchaseid:req.param('pid')})
      .populate('user')
      .populate('products')
      .exec((err,purchase)=> {
        if (err) return res.negotiate(err);
        User.findOne({userid:req.param('userid')}).exec((err,user)=>{
          if (!user) {
            return res.json(401, {err: ' INVALID ID'});
          }
            Bank.find({userid:req.param('userid')})
                .exec((err,bank)=> {
                    Posconfig.find({userid:req.param('userid')})
                        .exec((err, config) => {
                            return res.json({purchase: purchase, user: user,config: config,bank: bank})
                        })
                })
        })
      })
  },
//-------------------------------------------------
  deletebill:(req,res)=>{
    Purchaseproduct.find({userid:req.param('userid'),purchase:req.param('id'),groupBy:['productid'],sum:['quantity']}).exec((err,products)=>{
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
      Purchase.destroy({id:req.param('id')}).exec((err,deleted)=>{
        if (err) return res.negotiate(err);
        Purchaseproduct.destroy({purchase:req.param('id')}).exec((err,deleted1)=> {
          if (err) return res.negotiate(err);
          Paymentmade.destroy({purchaseid:req.param('id')}).exec((err, deleted1) => {
            if (err) return res.negotiate(err);
            return res.json({message: 'deleted'})
          })
        })
      })
    })
  },

  updatebill:(req,res)=>{
      Purchaseproduct.find({userid:req.param('clientid'),purchase: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
        .exec((err, grouped1) => {
          if (err) return res.negotiate(err);
          async.each(grouped1, function (group, callback) {
            var populateTasks1 = {
              productfind1: function (cb) {
                Products.native(function (err, collection) {
                  collection.findOne({_id: group.productid},function (err, result1) {
                    console.log(result1)
                      cb(err, result1);
                    });
                })
              }
            };

            async.parallel(populateTasks1, function (err, resultSet) {
              if (err) {
                return next(err);
              }

              var balanceproduct1 = parseFloat(isNaN(resultSet.productfind1.stockinhand) ? 0 : resultSet.productfind1.stockinhand) - parseFloat(group.quantity)
              Products.native(function (err, collection1) {
                collection1.update({_id: resultSet.productfind1._id}, {$set:{stockinhand1: balanceproduct1}},function (err,updated1) {

                  if (err) return res.negotiate(err);
                });
              })
              callback();
            });
          });
        })
      Purchaseproduct.destroy({purchase:req.param('id')}).exec((err,destroyed)=>{

        if(err) return res.negotiate(err);
      })
      Purchase.update({id:req.param('id')},{
        userid:req.param('clientid'),
        user:req.param('userid'),
        username:req.param('username'),
        billid:req.param('billid'),
        sourceofsuply:req.param('sourceofsuply'),
        purchasedate:req.param('purchasedate'),
        duedate:req.param('duedate'),
        notes:req.param('notes'),
        maintotal:req.param('maintotal'),
        taxtotal:req.param('taxtotal'),
        items:req.param('items'),
        balance:req.param('balance'),
        status:req.param('status'),
        totalcgst:req.param('totalcgst'),
        totalsgst:req.param('totalsgst'),
        totaligst:req.param('totaligst'),
        totalcess:req.param('totalcess'),
        totalsub:req.param('totalsub'),
        adjustment:req.param('adjustment')
      }).exec((err,poscreated)=> {
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function (el) {
          var o = Object.assign({}, el);
          o.purchase = req.param('id');
          o.purchasedate =req.param('purchasedate')
          o.userid=req.param('clientid')
          return o;
        });
        console.log(result)
        Purchaseproduct.create(result).exec((err, posproductcreated) => {
          if (err) return res.negotiate(err);
          Purchaseproduct.find({userid:req.param('clientid'),purchase: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
            .exec((err, grouped) => {
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

  searchcontact:(req,res)=>{
    Contact.find({type:'Vendor',userid:req.param('userid'),
      or:[{firstname:{'contains':req.param('searchtext')}},
        {phonenumber:{'contains':req.param('searchtext')}}]
      ,limit:10})
      .populate('purchase',{or:[{status:'Partially Paid'},{status:'Draft'}]})
      .exec((err,result)=>{
        if(err){return res.negotiate(err)}
        return res.json({result:result})
      })
  },

  reportbycustomer:(req,res)=>{
    Purchase.find({where:{ userid:req.param('userid'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess'],count:1})
      .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Purchase.find({where:{userid:req.param('userid'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
          .populate('user')
          .exec((err,result)=>{
            if (err) {return res.negotiate(err)}
            return res.json({amount:data,result:result})
          })
      })
  },


  purchasesbycustomer:(req,res)=>{
    var date=req.param('startdate')
    var date1=req.param('enddate')
    Purchase.find({ where:{userid:req.param('userid'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .sum('maintotal','totalsub','balance')
      .exec((err,data)=>{
        Purchase.native(function(err, collection) {
          if (err) return res.serverError(err);
          collection.aggregate([
            {
              $match:{
                userid:req.param('userid'),
                purchasedate:{$gte:date,$lte:date1}
              }},
            { $group: {
              _id: {user:"$user"},
              maintotal:{
                $sum:"$maintotal"
              },
              totalsub:{
                $sum:"$totalsub"
              },
              balance:{
                $sum:"$balance"
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
                  localField: "_id.user",
                  foreignField: "_id",
                  as: "singleuser"
                }
            },{$match: {singleuser: {$ne: []}}}

          ]).toArray(function (err, results) {
            if (err) return res.serverError(err);
            return res.json({result:results,data:data})
          });
        });
      })
  },
  //purchase by item
  purchasebyitem: (req, res) => {
    var date=req.param('startdate')
    var date1=req.param('enddate')
    Purchaseproduct.find({ where:{userid:req.param('userid'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .sum('subtotal')
    .exec((err, data) => {
        Purchaseproduct.native(function(err, collection) {
          if (err) return res.serverError(err);
          collection.aggregate([
            {
              $match:{
                userid:req.param('userid'),
                purchasedate:{$gte:date,$lte:date1}
              }},
            { $group: {
                _id:{productid:"$productid"},
              quantity:{
                $sum:"$quantity"
              },
              totalwithtax:{
                $sum:"$subtotal"
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

};

