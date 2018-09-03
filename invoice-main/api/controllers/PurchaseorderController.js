/**
 * PurchaseorderController
 *
 * @description :: Server-side logic for managing purchaseorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getid: (req, res) => {
    Purchaseorder.find({ sort: 'porid DESC' })
    .populate('user')
        .exec((err, result) => {
            if (err) { return res.negotiate(err) }
            Purchaseorder.count().exec((err, count) => {
                if (result.length < 1) {
                    var soid = 1
                }
                else {
                    var soid = result[0].porid + 1
                }
                return res.json({ count: count, result: result, id: soid })
            })
        })
  },
  checkid:(req,res)=>{
    Purchaseorder.findOne({ porid: req.param('id')})
    .exec((err, PurchaseorderId) => {
        if (err) { return res.negotiate(err) }
        if(PurchaseorderId)
        return res.json(401, { err: 'Purchaseorder ID Already Exist' });
        else
        return res.json({ msg: 'ok' });
      })
  },
  purchasebyid: (req, res) => {
    Defaulttem.findOne({template: 'purchaseorder'}).exec((err, tem) => {
      if (err) return res.negotiate(err);
      var socket=req.socket;
      var io=sails.io;
      if(tem) {
        var defaulturl = tem.url + req.param('id')
        io.emit('loadurl', { url: defaulturl });
      }
      else{
        var defaulturl1='http://localhost:1349/purordera4/'+req.param('id')
        io.emit('loadurl', { url: defaulturl1 });
      }
      Purchaseorder.findOne({ id: req.param('id') })
        .populate('user')
        .exec((err, result) => {
          if (err) {
            return res.negotiate(err)
          }
          return res.json({result: result,template:tem})
        })
    })
  },

  singlepurchasetemp:(req,res)=>{
    Purchaseorder.findOne({id:req.param('id')})
      .populate('user')
      // .populate('products')
      .exec((err,purchaseorder)=> {
        if (err) return res.negotiate(err);
        User.findOne({key:req.param('key')}).exec((err,user)=>{
          if (!user) {
            return res.json(401, {err: ' INVALID VALIDATION KEY'});
          }
          Bank.find()
            .exec((err,bank)=> {
              Posconfig.find()
                .exec((err, config) => {
                  return res.json({purchaseorder: purchaseorder, user: user,config: config,bank: bank})
                })
            })
        })
      })
  },

  singlepurchase:(req,res)=>{
    Purchaseorder.findOne({ id: req.param('id') })
      .populate('user')
      .exec((err, result) => {
        if (err) {
          return res.negotiate(err)
        }
        User.findOne({key: req.param('key')}).exec((err, user) => {
          if (!user) {
            return res.json(401, {err: ' INVALID VALIDATION KEY'});
          }
          return res.json({result: result, user: user})
        })
      })
  },

  addpurchase: (req, res) => {
    if(!req.param('orderid')){
      return res.json(401, { err: 'The Purchase Order Number field should not be empty' });              
    }
    let ordernumber;
    Purchaseorder.findOne({porid:req.param('orderid'),limit:1}).exec((err,est)=>{
      if (err) return res.negotiate(err);
      if(est){
        return res.json(401, { err: 'Purchase Order ID Already Exist' });        
      }
      else{
      let autoinc = req.param('orderid');
      let value = autoinc.toString()
      ordernumber= 'PO-' + value.padStart(7, 0);
      }
      Purchaseorder.create({
        user: req.param('user'),
        username:req.param('username'),
        sourceofsupply: req.param('sourceofsupply'),
        purchaseorderid: ordernumber,
        porid: req.param('orderid'),
        purchasedate: req.param('purchasedate'),
        notes: req.param('notes'),
        purchase: req.param('product'),
        subtotal: req.param('subtotal'),
        cgstprice: req.param('cgstprice'),
        sgstprice: req.param('sgstprice'),
        igstprice: req.param('igstprice'),
        cessprice: req.param('cessprice'),
        maintotal: req.param('maintotal'),
        clientid: req.param('clientid')
      }).exec((err, result) => {
        if (err) {
          return res.negotiate(err)
        }
        Purchaseorder.count().exec((err, count) => {
          if (err) {
            return res.negotiate(err)
          }
          return res.json({count: count, result: result})
        })
      })
    })
  },
  deletepurchase: (req, res) => {
    Purchaseorder.destroy({ id: req.param('id') }).exec((err, result) => {
      if (err) { return res.negotiate(err) }
      return res.json({ result: result })
    })
  },
  updatepurchase: (req, res) => {
    if(!req.param('orderid')){
      return res.json(401, { err: 'The Purchaseorder Number field should not be empty' });              
    }
    let ordernumber
    Purchaseorder.findOne({porid:req.param('orderid'),limit:1}).exec((err,est)=>{
      if (err) return res.negotiate(err);
      if(est){
        ordernumber = est.purchaseorderid
        if(est.porid!=req.param('orginalid')){
          return res.json(401, { err: 'Purchaseorder ID Already Exist' });        
        }
      }
      else{
      let autoinc = req.param('orderid');
      let value = autoinc.toString()
      ordernumber = 'PO-' + value.padStart(7, 0);
      }

    Purchaseorder.update({ id: req.param('id') }, {
      user: req.param('user'),
      sourceofsupply: req.param('sourceofsupply'),
      purchasedate: req.param('purchasedate'),
      notes: req.param('notes'),
      purchaseorderid: ordernumber,
      porid: req.param('orderid'),
      purchase: req.param('product'),
      subtotal: req.param('subtotal'),
      cgstprice: req.param('cgstprice'),
      sgstprice: req.param('sgstprice'),
      igstprice: req.param('igstprice'),
      cessprice: req.param('cessprice'),
      maintotal: req.param('maintotal')
    }).exec((err, result) => {
      if (err) { return res.negotiate(err) }
      Purchaseorder.count().exec((err, count) => {
        if (err) { return res.negotiate(err) }
        return res.json({ count: count, result: result })
      })
    })
  })
  },
  getall: (req, res) => {
    if (req.param('category') === 'All') {
      Purchaseorder.find({
        sort: 'porid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Purchaseorder.count().exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Purchaseorder.find({
        sort: 'porid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Purchaseorder.count({ status: req.param('category') }).exec((err, count) => {
            if (err) return res.negotiate(err);

            return res.json({ result: result, count: count })
          })
        })
    }
  },
  searchpurchase: (req, res) => {
    if (req.param('category') === 'Approved') {
      Purchaseorder.find({
         or: [{purchaseorderid: { 'contains': req.param('searchtext')}},
          {username: {'contains': req.param('searchtext')}}],
        sort: 'porid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Purchaseorder.count({
            purchaseorderid: { 'contains': req.param('searchtext') },
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Purchaseorder.find({
        or: [{purchaseorderid: { 'contains': req.param('searchtext')}},
        {username: {'contains': req.param('searchtext')}}],
        sort: 'porid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Purchaseorder.count({
            purchaseorderid: { 'contains': req.param('searchtext') },
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
  },

};

