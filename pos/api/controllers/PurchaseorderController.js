/**
 * PurchaseorderController
 *
 * @description :: Server-side logic for managing purchaseorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

  getid: (req, res) => {

    Purchaseorder.find({ sort: 'createdAt DESC' })
      .populate('user')
      .exec((err, result) => {
        if (err) { return res.negotiate(err) }
        Purchaseorder.count().exec((err, count) => {
          /*if (result.length == 0) {
            var porid = 1

            return res.json({ result: result, id: porid })
          }
          else {
            var porid = result[0].porid + 1
            return res.json({ count: count, result: result, id: porid })
          }*/
          console.log(result)
          if(result.length>=1) {
            var autoinc = parseInt(result[0].porid) + 1;
            var value = autoinc.toString()
            var porid ='PO-'+value.padStart(7,0);
            return res.json({count:count,result:result,id:porid,porid:autoinc})
          }
          if(result.length<1){
            var autoinc=1;
            var value = autoinc.toString()
            var porid ='PO-'+value.padStart(7,0);
            return res.json({result:result,id:porid,porid:autoinc})
          }

        })
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

    var autoinc= 0;
    Purchaseorder.find({sort:'porid DESC',limit:1}).exec((err,purchaseid)=> {
      if (purchaseid.length >= 1) {

        var autoinc = parseInt(purchaseid[0].porid) + 1;
        var value = autoinc.toString()
        var porid = 'PO-' + value.padStart(7, 0);
      }
      if (purchaseid.length < 1) {
        var autoinc = 1;
        var value = autoinc.toString()
        var porid = 'PO-' + value.padStart(7, 0);
      }

      Purchaseorder.create({
        user: req.param('user'),
        username:req.param('username'),
        sourceofsupply: req.param('sourceofsupply'),
        purchaseorderid: porid,
        porid: autoinc,
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
    Purchaseorder.update({ id: req.param('id') }, {
      user: req.param('user'),
      sourceofsupply: req.param('sourceofsupply'),
      purchasedate: req.param('purchasedate'),
      notes: req.param('notes'),
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

