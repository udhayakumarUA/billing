/**
 * PosController
 *
 * @description :: Server-side logic for managing pos
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  //search contact
  searchcontact:(req,res)=>{
      Contact.find({type:'Customer',
        or:[{firstname:{'contains':req.param('searchtext')}},
          {phonenumber:{'contains':req.param('searchtext')}}]
        ,limit:10})
        .populate('pos',{or:[{status:'Partially Paid'},{status:'Draft'}]})
        .exec((err,result)=>{
        if(err){return res.negotiate(err)}
          return res.json({result:result})
      })
  },
  //Dashboard sale and purchase report
  sale: (req, res) => {
    Pos.find({ sum: ['balance'] }).exec((err, rec) => {
      if (err) { return res.negotiate(err) }
      Purchase.find({ sum: ['balance'] }).exec((err, pay) => {
        if (err) { return res.negotiate(err) }
        Pos.find({ where: { "date": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
          .sum('maintotal')
          .exec((err, todaysale) => {
            if (err) { return res.negotiate(err) }
            return res.json({receivables:rec,payables:pay,todaysale:todaysale})
          })
      })
    })
  },

  getpos:(req,res)=>{
    Pos.find({
      sort: 'createdAt DESC',
      limit:5})
      .populate('user')
      .exec((err,pos)=>{
        return res.json({pos:pos})
      })
  },

  //GST sale Report
  salebycustomer:(req,res)=>{
    var date=req.param('startdate')
    var date1=req.param('enddate')
    Pos.find({ where:{"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .sum('maintotal','totalsub','balance','cgst','sgst','igst','cess')
    .exec((err,data)=>{
    Pos.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $match:{
           date:{$gte:date,$lte:date1}
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
  //day book report
  daybookreport: (req, res) => {
    var date = req.param('startdate')
    var date1 = req.param('enddate')
      Paymentreceived.find({where: { "paymentdate": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
      .sum('amount')
      .exec((err, received) => {
        if (err) return res.serverError(err);
      Paymentmade.find({where: { "paymentdate": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
      .sum('amount')
      .exec((err, paid) => {
        if (err) return res.serverError(err);

        Salereturn.find({where: { "returndate": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
        .sum('maintotal')
        .exec((err, salereturn) => {
          if (err) return res.serverError(err);

          Return.find({where: { "returndate": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
          .sum('maintotal')
          .exec((err, purchasereturn) => {
            if (err) return res.serverError(err);
            Expenses.find({where: { "date": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
            .sum('tax')
            .exec((err, expense) => {
              if (err) return res.serverError(err);

      Pos.find({ where: { "date": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
        .sum('maintotal','balance')
        .exec((err, data) => {
          Paymentreceived.native(function (err, collection) {
            if (err) return res.serverError(err);
            collection.aggregate([
              {
                $match: {
                  paymentdate: { $gte: date, $lte: date1 }
                }
              },
              {
                $group: {
                  _id: { paymentmode: "$paymentmode" },
                  name:{
                     $push:  { type: "$paymentmode",amount:'$amount'}
                  },
                  amount: {
                    $sum: "$amount"
                  },
                }
              }
            ]).toArray(function (err, results) {
              if (err) return res.serverError(err);

              Purchase.find({ where: { "purchasedate": { ">=": req.param('startdate'), "<=": req.param('enddate') } } })
              .sum('maintotal','balance')
              .exec((err, totalpurchase) => {
                Paymentmade.native(function (err, collection1) {
                  if (err) return res.serverError(err);
                  collection1.aggregate([
                    {
                      $match: {
                        paymentdate: { $gte: date, $lte: date1 }
                      }
                    },
                    {
                      $group: {
                        _id: { paymentmode: "$paymentmode" },
                        name:{
                           $push:  { type: "$paymentmode",amount:'$amount'}
                        },
                        amount: {
                          $sum: "$amount"
                        },
                      }
                    }
                  ]).toArray(function (err, purchase) {
                    if (err) return res.serverError(err);
                      return res.json({  sale: results,totalsale: data,received: received,purchase:purchase,totalpurchase:totalpurchase,paid:paid,expense:expense,purchasereturn:purchasereturn,salereturn:salereturn })
                  });
                });
              })
            });
          });
        })
      })
    })
  })

      })
    })
  },
//    //Receivables bi bill Report
//    salebybill:(req,res)=>{
//     Pos.find({ where:{"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','balance']})
//     .sum('maintotal','balance')
//     .exec((err,data)=>{
//   })
// },
//sale by the customers
  reportbycustomer:(req,res)=>{
    Pos.find({ where:{"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess'],count:1})
    .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Pos.find({ where:{"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
        .populate('user')
        .exec((err,result)=>{
        if (err) {return res.negotiate(err)}
        return res.json({amount:data,result:result})
    })
  })
  },
  //sale by the user
reportbyuser:(req,res)=>{
  console.log(req.param('id'))
  Pos.find({ where:{'clientid':req.param('id'),"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess'],count:1})
  .exec((err,data)=>{
      if (err) {return res.negotiate(err)}
      Pos.find({ where:{'clientid':req.param('id'),"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .populate('user')
      .exec((err,result)=>{
      if (err) {return res.negotiate(err)}
      return res.json({amount:data,result:result})
  })
})
},
  //sale by the sigle customers
  getreportc:(req,res)=>{
    console.log(req.param('id'))
    Pos.find({ where:{"user":req.param('id'),"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess'],count:1})
      .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Pos.find({where:{"user":req.param('id'),"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
          .populate('user')
          .exec((err,result)=>{
            if (err) {return res.negotiate(err)}
            return res.json({amount:data,result:result})
          })
      })
  },

  getpaymentreportc:(req,res)=>{
    Paymentreceived.find({where:{"user":req.param('id'),"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['amount','totalamount']})
      .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Paymentreceived.find({where:{"user":req.param('id'),"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
          .exec((err,result)=>{
            if (err) {return res.negotiate(err)}
            return res.json({amount:data,result:result})
          })
      })
  },


  getreportvendor:(req,res)=>{
    console.log(req.param('id'))
    console.log(req.param('startdate'))
    console.log(req.param('enddate'))
      Purchase.find({ where:{"user":req.param('id'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['maintotal','totalsub','balance','totalcgst','totalsgst','totaligst','totalcess'],count:1})
      .exec((err,data)=>{
      console.log(data)
        if (err) {return res.negotiate(err)}
        Purchase.find({where:{"user":req.param('id'),"purchasedate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
          .populate('user')
          .exec((err,result)=>{
            console.log(result)
            if (err) {return res.negotiate(err)}
            return res.json({amount:data,result:result})
          })
      })
  },

  getpaymentmadereportc:(req,res)=>{
    Paymentmade.find({where:{"user":req.param('id'),"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['amount','totalamount']})
      .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Paymentmade.find({where:{"user":req.param('id'),"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
          .exec((err,result)=>{
            if (err) {return res.negotiate(err)}
            return res.json({amount:data,result:result})
          })
      })
  },


  //sale by item
  reportbyitem: (req, res) => {
    var date=req.param('startdate')
    var date1=req.param('enddate')
    Posproducts.find({where:{"date" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .sum('sales','subtotal')
      .exec((err, data) => {
        Posproducts.native(function(err, collection) {
          if (err) return res.serverError(err);
          collection.aggregate([
            {
              $match:{
               date:{$gte:date,$lte:date1}
              }},
            { $group: {
                _id:{productid:"$productid"},
              quantity:{
                  $sum:"$quantity"
              },
              rate:{
                $sum: { $multiply: [ "$quantity", "$rate" ] }
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
  //customer Balance

  //get products
  getproducts:(req,res)=>{
    Favourite.find().exec((err,favourites)=>{
      if(err){return res.negotiate(err)}
      var productsid=[];
      _.each(favourites, function (product) {
        productsid.push(product.productid)
      });
    Products.find().exec((err,userproducts)=>{
      if(err){return res.negotiate(err)}
      _.each(userproducts, function (products) {
        products.saved = false;
        if (productsid.indexOf(products.id) != -1) {
          products.saved = true;
        }
      })
      Collection.find().exec((err,collection)=>{
        if(err){return res.negotiate(err)}
        return res.json({userproducts:userproducts,collection:collection,favourites:favourites})
      })
      })
    })
  },
  getuserproducts:(req,res)=>{
    Favourite.find().exec((err,favourites)=> {
      if (err) {
        return res.negotiate(err)
      }
      var productsid = [];
      _.each(favourites, function (product) {
        productsid.push(product.productid)
      });
      Products.find().exec((err, userproducts) => {
        if (err) {
          return res.negotiate(err)
        }
        _.each(userproducts, function (products) {
          products.saved = false;
          if (productsid.indexOf(products.id) != -1) {
            products.saved = true;
          }
        })
        return res.json({userproducts: userproducts})
      })
    })
  },
  getcustomeramount:(req,res)=>{
      Pos.find({user:req.param('id')})
      .sum('maintotal','balance')
      .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Purchase.find({user:req.param('id')})
        .sum('maintotal','balance')
        .exec((err,result)=>{
          if (err) {return res.negotiate(err)}
          return res.json({billed:data,buy:result})

        })

      })
  },
  getfavourites:(req,res)=>{
    Favourite.find().exec((err,favourites)=> {
      if (err) {
        return res.negotiate(err)
      }
      return res.json({favourites: favourites})
    })

  },


  //get customer
  getcustomer: (req, res) => {
    Posconfig.findOne({type: 'one'}).exec((err, result) => {
      if (err) {
        return res.negotiate(err)
      }
      if(result){
        Contact.findOne({id:result.customer}).exec((err,data)=>{
          if(err){return res.negotiate(err)}
          return res.json({user:data})
        })
      }
      else{
        console.log('nothing')
      }
    })
  },


  //search products
  searchproducts:(req,res)=>{
    Products.find({
      or:[{productname:{'contains':req.param('searchtext')}}
        ,{sku:{'contains':req.param('searchtext')}}]
      ,limit:10,
      sort:'productname ASC'
    })
      .exec((err,products)=> {
        if (err) return res.negotiate(err);

          return res.json({products: products})
        })
  },

  //productchange
  productchange:(req,res)=>{
    Products.findOne({id:req.param('id')}).exec((err,products)=>{
        if (err) return res.negotiate(err);
        return res.json({products: products})
      })
  },



  //search all products
  searcallproducts:(req,res)=>{
    if(req.param('collection')=='All'){
      Products.find({
        or:[{productname:{'contains':req.param('searchtext')}}
          ,{sku:{'contains':req.param('searchtext')}}]
        ,limit:12
      })
        .exec((err,products)=> {
          if (err) return res.negotiate(err);
          return res.json({products: products})
        })
    }
    else {
      Products.find({
        or: [{productname: {'contains': req.param('searchtext')}}
          , {sku: {'contains': req.param('searchtext')}}]
        , collection: req.param('collection'), limit: 12
      })
        .exec((err, products) => {
          if (err) return res.negotiate(err);
          return res.json({products: products})
        })
    }
  },



  //category switch
   categoryfilter:(req,res)=>{
    if(req.param('collection')!='All') {
      Products.find({
        collection: req.param('collection'), limit: 12
      }).exec((err, products) => {
        if (err) return res.negotiate(err);
        return res.json({products: products})
      })
    }
    else{
      Products.find({
        limit: 12
      }).exec((err, products) => {
        if (err) return res.negotiate(err);
        return res.json({products: products})
      })
    }
},



  //favourite
  addfavourite:(req,res)=>{
    Favourite.findOne({productid:req.param('id')}).exec((err,found)=>{
      if (err) return res.negotiate(err);
      if(found){
        return res.json({message:'already added'})
      }
      Favourite.create({
        imagename: req.param('imagename'),
        imageurl: req.param('imageurl'),
        imagedir: req.param('imagedir'),
        itemtype: req.param('itemtype'),
        productname: req.param('productname'),
        unit: req.param('unit'),
        collection: req.param('collection'),
        sku: req.param('sku'),
        hsn: req.param('hsn'),
        salesrate: req.param('salesrate'),
        purchaserate: req.param('purchaserate'),
        prices:req.param('prices'),
        taxpreference: req.param('taxpreference'),
        reason: req.param('reason'),
        sgst: req.param('sgst'),
        cgst: req.param('cgst'),
        igst: req.param('igst'),
        cess: req.param('cess'),
        utgst: req.param('utgst'),
        trackinventary: req.param('trackinventary'),
        openingstock:req.param('openingstock'),
        stockinhand:req.param('openingstock'),
        openingstockperrate:req.param('openingstockperrate'),
        barcode:req.param('barcode'),
        productid:req.param('id')
      }).exec((err,created)=>{
        if (err) return res.negotiate(err);
        return res.json({message: 'created'})
      })

    })
  },



  // remove favourite
  removefavourite:(req,res)=>{
    Favourite.destroy({productid:req.param('id')}).exec((err,deleted)=>{
      if (err) return res.negotiate(err);
      return res.json({message: 'deleted'})
    })
  },

  //category filter
  categoryfilter1:(req,res)=>{
    if(req.param('collection')!='All') {
      Favourite.find({
        collection: req.param('collection'), limit: 12
      }).exec((err, products) => {
        if (err) return res.negotiate(err);
        return res.json({favourites: products})
      })
    }
    else{
      Favourite.find({
         limit: 12
      }).exec((err, products) => {
        if (err) return res.negotiate(err);
        return res.json({favourites: products})
      })
    }
  },


  //search favourite
  searchfavourite:(req,res)=> {
    if (req.param('collection') == 'All') {
      Favourite.find({
        or: [{productname: {'contains': req.param('searchtext')}}
          , {sku: {'contains': req.param('searchtext')}}]
        , limit: 12
      })
        .exec((err, products) => {
          if (err) return res.negotiate(err);
          return res.json({favourites: products})
        })
    }
    else {
      Favourite.find({
        or: [{productname: {'contains': req.param('searchtext')}}
          , {sku: {'contains': req.param('searchtext')}}]
        , collection: req.param('collection'), limit: 12
      })
        .exec((err, products) => {
          if (err) return res.negotiate(err);
          return res.json({favourites: products})
        })
    }
  },



  //save bill
  savebill:(req,res)=>{
    var status='';
    var autoinc=0;
    console.log(req.param('product'))
    Pos.find({sort:'autoinc DESC',limit:1}).exec((err,posid)=>{
      if (err) return res.negotiate(err);
      if(posid.length>=1) {
        var autoinc = parseInt(posid[0].autoinc) + 1;
      }
      if(posid.length<1){
        var autoinc=1;
      }
      if (req.param('maintotal') == req.param('totalpaying')) {
        var status = 'Paid'
      }
      else if (req.param('totalpaying') == 0) {
        var status = 'Draft'
      }
      else if (req.param('totalpaying') < req.param('maintotal')) {
        var status = 'Partially Paid'
      }

      Pos.create({
      user:req.param('userid'),
      username:req.param('username'),
      posid:'#'+autoinc,
      autoinc:autoinc,
      maintotal:req.param('maintotal'),
      taxtotal:req.param('taxtotal'),
      discount:req.param('discount'),
      items:req.param('items'),
      type:'pos',
      date:req.param('date'),
      balance:req.param('balance'),
      totalpaying:req.param('totalpaying'),
      tenderedamount:req.param('tenderedamount'),
      paymentmode:req.param('paymentmode'),
      status:status,
        singlepostax:req.param('singlepostax'),
      totalcgst:req.param('totalcgst'),
      totalsgst:req.param('totalsgst'),
      totaligst:req.param('totaligst'),
      totalcess:req.param('totalcess'),
      totalsub:req.param('totalsub'),
      totalquantity:req.param('totalquantity'),
      clientid:req.param('clientid')
    }).exec((err,poscreated)=> {
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function (el) {
            var o = Object.assign({}, el);
            o.pos = poscreated.id;
            o.date=req.param('date')
            o.posid=poscreated.posid;
            o.clientid=req.param('clientid');
            return o;
          });
          Posproducts.create(result).exec((err, posproductcreated) => {
            if (err) return res.negotiate(err);
        Defaulttem.findOne({template:'pos'}).exec((err,postem)=> {
          if (err) return res.negotiate(err);
          var socket=req.socket;
          var io=sails.io;
          if(postem) {
            var defaulturl = postem.url + poscreated.posid.substr(1, poscreated.posid.length)
          io.emit('loadurl', { url: defaulturl });
          }
          else{
            var defaulturl1='http://localhost:1349/posa4/%23'+poscreated.posid.substr(1, poscreated.posid.length)
          io.emit('loadurl', { url: defaulturl1 });
          }
          if (status != 'Draft') {
            Paymentreceived.find({sort: 'autoinc DESC', limit: 1}).exec((err, payid) => {
              if (err) return res.negotiate(err);
              if (payid.length >= 1) {
                var count = parseInt(payid[0].count) + 1;
              }
              if (payid.length < 1) {
                var count = 1;
              }

              Paymentreceived.create({
                user: req.param('userid'),
                paymentdate: req.param('date'),
                paymentmode: req.param('paymentmode'),
                paymentid: 'REC-' + count,
                billid: poscreated.posid,
                amount: req.param('totalpaying'),
                totalamount: req.param('maintotal'),
                username: req.param('username'),
                count: count,
                clientid:req.param('clientid'),
                posid: poscreated.id,
              }).exec((err, received) => {
                if (err) return res.negotiate(err);
              })
            })
          }

            Posproducts.find({pos: poscreated.id, groupBy: ['productid'], sum: ['quantity']})
              .exec((err, grouped) => {
                if (err) return res.negotiate(err);
                async.each(grouped, function (group, callback) {
                  console.log(group)
                  var populateTasks = {
                    productfind: function (cb) {
                      Products.native(function (err, collection) {
                        collection.findOne({_id: group.productid},function (err, result1) {
                            cb(err, result1);
                          });
                      })
                    }
                }

                  async.parallel(populateTasks, function (err, resultSet) {
                    if (err) {
                      return next(err);
                    }
                    console.log(resultSet.productfind._id)
                    var balanceproduct = parseFloat(isNaN(resultSet.productfind.stockinhand) ? 0 : resultSet.productfind.stockinhand) - parseFloat(group.quantity)
                    console.log(balanceproduct)
                    Products.native(function (err, collection1) {
                      collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                        if (err) return res.negotiate(err);
                      });
                    })
                    callback();
                  });
                });


               if(err) return res.negotiate(err);
                return res.json({pos: poscreated.posid,postem:postem})
              })
          })
        })
      })
    })
  },


//save invoice
  saveinvoice:(req,res)=>{
    Pos.find({sort:'autoinc DESC',limit:1}).exec((err,posid)=>{
      if (err) return res.negotiate(err);
      if(posid.length>=1) {
        console.log(req.param('invoicenumber'));
        var autoinc = parseInt(posid[0].autoinc) + 1;
      }
      if(posid.length<1){
        console.log(req.param('invoicenumber'));
        if(req.param('invoicenumber'))
        {
          console.log(req.param('invoicenumber'));
          var autoinc = req.param('invoicenumber');
        }
        else {
          var autoinc=1;
        }
      }
      Pos.create({
        user:req.param('userid'),
        username:req.param('username'),
        posid:'#'+autoinc,
        autoinc:autoinc,
        type:'invoice',
        balance:req.param('maintotal'),
        maintotal:req.param('maintotal'),
        paymentmode:req.param('paymentmode'),
        transportmode:req.param('transportmode'),
        taxtotal:req.param('taxtotal'),
        discount:req.param('discount'),
        adjustment:req.param('adjustment'),
        vehicleno:req.param('vehicleno'),
        invoicedate:req.param('invoicedate'),
        date:req.param('date'),
        duedate:req.param('duedate'),
        orderdate:req.param('orderdate'),
        orderno:req.param('orderno'),
        items:req.param('items'),
        status:'Draft',
        notes:req.param('noteforcustomer'),
        singlepostax:req.param('singlepostax'),
        totalcgst:req.param('totalcgst'),
        totalsgst:req.param('totalsgst'),
        totaligst:req.param('totaligst'),
        totalcess:req.param('totalcess'),
        totalsub:req.param('totalsub'),
        clientid:req.param('clientid')
      }).exec((err,poscreated)=> {
        if (err) return res.negotiate(err);
        var result = req.param('product').map(function (el) {
          var o = Object.assign({}, el);
          o.pos = poscreated.id;
          o.date=req.param('date')
          o.posid=poscreated.posid;
          o.clientid=req.param('clientid')
          return o;
        });
        Posproducts.create(result).exec((err, posproductcreated) => {
          if (err) return res.negotiate(err);
          Posproducts.find({pos: poscreated.id, groupBy: ['productid'], sum: ['quantity']})
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

                  var balanceproduct = parseFloat(isNaN(resultSet.productfind.stockinhand) ? 0 : resultSet.productfind.stockinhand) - parseFloat(group.quantity)
                  Products.native(function (err, collection1) {
                    collection1.update({_id: resultSet.productfind._id}, {$set:{stockinhand: balanceproduct}},function (err,updated1) {

                      if (err) return res.negotiate(err);
                    });
                  })
                  callback();
                });
              });
              return res.json({pos: poscreated.posid})
            })
        })
      })
    })
  },

//update invoice
      updateinvoice:(req,res)=>{
        Posproducts.find({pos: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
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

                var balanceproduct1 = parseFloat(isNaN(resultSet.productfind1.stockinhand) ? 0 : resultSet.productfind1.stockinhand) + parseFloat(group.quantity)
                Products.native(function (err, collection1) {
                  collection1.update({_id: resultSet.productfind1._id}, {$set:{stockinhand: balanceproduct1}},function (err,updated1) {

                    if (err) return res.negotiate(err);
                  });
                })
                callback();
              });
            });
          })
        Posproducts.destroy({pos:req.param('id')}).exec((err,destroyed)=>{
          if(err) return res.negotiate(err);
        })
        Pos.update({id:req.param('id')},{
          user:req.param('userid'),
          username:req.param('username'),
          type:'invoice',
          paymentmode:req.param('paymentmode'),
          transportmode:req.param('transportmode'),
          balance:req.param('maintotal'),
          maintotal:req.param('maintotal'),
          taxtotal:req.param('taxtotal'),
          discount:req.param('discount').toFixed(2),
          adjustment:req.param('adjustment'),
          vehicleno:req.param('vehicleno'),
          invoicedate:req.param('invoicedate'),
          duedate:req.param('duedate'),
          items:req.param('items'),
          status:'Draft',
          notes:req.param('noteforcustomer'),
          singlepostax:req.param('singlepostax'),
          totalcgst:req.param('totalcgst'),
          totalsgst:req.param('totalsgst'),
          totaligst:req.param('totaligst'),
          totalcess:req.param('totalcess'),
          totalsub:req.param('totalsub'),
          orderdate:req.param('orderdate'),
          orderno:req.param('orderno')
        }).exec((err,poscreated)=> {
          if (err) return res.negotiate(err);
          var result = req.param('product').map(function (el) {
            var o = Object.assign({}, el);
            o.pos = req.param('id');
            return o;
          });
          Posproducts.create(result).exec((err, posproductcreated) => {
            if (err) return res.negotiate(err);
            Posproducts.find({pos: req.param('id'), groupBy: ['productid'], sum: ['quantity']})
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

  //delete bill
  deletebill:(req,res)=>{
    Posproducts.find({pos:req.param('id'),groupBy:['productid'],sum:['quantity']}).exec((err,products)=>{
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
      Pos.destroy({id:req.param('id')}).exec((err,deleted)=>{
        if (err) return res.negotiate(err);
     Posproducts.destroy({pos:req.param('id')}).exec((err,deleted1)=> {
       if (err) return res.negotiate(err);
       Paymentreceived.destroy({posid:req.param('id')}).exec((err, deleted1) => {
         if (err) return res.negotiate(err);
         return res.json({message: 'deleted'})
       })
     })
      })
    })
  },



//all data
  getall:(req,res)=>{
    if(req.param('category')==='All') {
      Pos.find({
        sort: 'autoinc DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, pointofsales) => {
          if (err) return res.negotiate(err);
          Pos.count().exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({pointofsales: pointofsales,count:count})
          })
        })
    }
    else{
      Pos.find({
        sort: 'autoinc DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, pointofsales) => {
          if (err) return res.negotiate(err);
         Pos.count({status: req.param('category')}).exec((err,count)=>{
       if (err) return res.negotiate(err);

          return res.json({pointofsales: pointofsales,count:count})
    })
        })
    }
  },
  getposcount:(req,res)=>{
    Pos.count().exec((err,count)=>{
      return res.json({count:count})
    })
  },



  //search pos
  searchpos:(req,res)=> {
    if(req.param('category')!=='All') {
      Pos.find({
        or: [{posid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'autoinc DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, pointofsales) => {
        if (err) return res.negotiate(err);
        Pos.count({
          or: [{posid: {'contains': req.param('searchtext')}},
            {username: {'contains': req.param('searchtext')}}],
          status: req.param('category')
        }).exec((err, count) => {
          return res.json({pointofsales: pointofsales, count: count})
        })
      })
    }
    else{
      Pos.find({
        or: [{posid: {'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'autoinc DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, pointofsales) => {
        if (err) return res.negotiate(err);
        Pos.count({
          or: [{posid: {'contains': req.param('searchtext')}},
            {username: {'contains': req.param('searchtext')}}]
        }).exec((err, count) => {
          return res.json({pointofsales: pointofsales, count: count})
        })
      })
    }
  },
  singlepos:(req,res)=>{
    Posproducts.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $match : {posid:req.param('posid')}
        },
        {
          $group : {
            _id:"$singletax",
            singlecess:{$sum:"$singlecess"},
            singlecgst:{$sum:"$singlecgst"},
            singlesgst:{$sum:"$singlesgst"},
            singleigst:{$sum:"$singleigst"},
            totalproductrate:{
              $sum:{ $multiply: [ "$rate", "$quantity" ] }
            }

          }
        }

      ]).toArray(function (err, results) {
          console.log(results)
     Defaulttem.findOne({template:'pos'}).exec((err,tem)=>{
        if (err) return res.negotiate(err);

    Pos.findOne({posid:req.param('posid')})
      .populate('user')
      .populate('products')
      .exec((err,pos)=>{
      if (err) return res.negotiate(err);

        User.findOne({key:req.param('key')}).exec((err,mainuser)=>{
          if (err) return res.negotiate(err);

          return res.json({pos:pos,mainuser:mainuser,template:tem,result:results})
    })
      })

      })
      })

    })
  },
  singlepostemp:(req,res)=>{
    Posproducts.native(function(err, collection) {
      if (err) return res.serverError(err);
      collection.aggregate([
        {
          $match : {posid:req.param('posid')}
      },
      {
          $group : {
              _id:"$singletax",
              singlecess:{$sum:"$singlecess"},
              singlecgst:{$sum:"$singlecgst"},
              singlesgst:{$sum:"$singlesgst"},
              singleigst:{$sum:"$singleigst"},
              totalproductrate:{
                $sum:{ $multiply: [ "$rate", "$quantity" ] }
              }

          }
      }

      ]).toArray(function (err, results) {
        console.log(results)
    Pos.findOne({posid:req.param('posid')})
      .populate('user')
      .populate('products')
      .exec((err,pos)=> {
        if (err) return res.negotiate(err);
        User.findOne({key: req.param('key')}).exec((err, mainuser) => {
          if (err) return res.negotiate(err);
          Posconfig.find()
            .exec((err,config)=>{
              Bank.find()
                .exec((err,bank)=> {
                console.log(bank)
                  return res.json({config: config, pos: pos, mainuser: mainuser,bank:bank,result:results})
                })
            })
        })
      })
    })
  })
  },
  setdefault:(req,res)=>{
    Defaulttem.findOne({template:req.param('template')}).exec((err,found)=>{
      if (err) return res.negotiate(err);
      if(found){
        console.log(found.id)
        console.log(req.param('url'))
        Defaulttem.update({id:found.id},{template:req.param('template'),url:req.param('url'),size:req.param('size')}).exec((err,updated)=>{
          if (err) return res.negotiate(err);
          return res.json({message:'Template update'})
        })
      }
      else{
        Defaulttem.create({template:req.param('template'),url:req.param('url'),size:req.param('size')}).exec((err,created)=>{
          if (err) return res.negotiate(err);
          return res.json({message:'Template created'})
        })
      }
    })
  },
  gettemplates:(req,res)=>{
    Defaulttem.findOne({template:'pos'}).exec((err,possize)=> {
      if (err) return res.negotiate(err);
      Defaulttem.findOne({template: 'purchase'}).exec((err, purchasesize) => {
        if (err) return res.negotiate(err);
        Defaulttem.findOne({template: 'estimate'}).exec((err, estimatesize) => {
          if (err) return res.negotiate(err);
          return res.json({possize:possize,purchasesize:purchasesize,estimatesize:estimatesize})
        })
      })
    })
  },
  getretail:(req,res)=>{
      var date=req.param('date')
      var date1=req.param('date1')
    console.log(req.param('tax'))
          Posproducts.native(function(err, collection) {
            if (err) return res.serverError(err);
            collection.aggregate([
              {
                $match: {
                  singletax:parseInt(req.param('tax')),
                  date: { $gte: date, $lte: date1}
                }},
              { $group: {
                _id: {date:"$date"},
                maintotal:{
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
                firstposid: { $first: "$posid" },
                lastposid: { $last: "$posid" },

                total: {
                  $sum: 1
                }
              }
              }

            ]).toArray(function (err, results) {
              if (err) return res.serverError(err);
              return res.json({result:results})
            });
          });

  }

}

