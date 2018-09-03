/**
 * SalesorderController
 *
 * @description :: Server-side logic for managing salesorders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    //for generating the estimate id
    getid: (req, res) => {
        Salesorder.find({ sort: 'soid DESC' })
        .populate('user')
            .exec((err, result) => {
                if (err) { return res.negotiate(err) }
                Salesorder.count().exec((err, count) => {
                    if (result.length < 1) {
                        var soid = 1
                    }
                    else {
                        var soid = result[0].soid + 1
                    }
                    return res.json({ count: count, result: result, id: soid })
                })
            })

    },
    //for getting the single sales order
    Salesorderbyid: (req, res) => {
        Defaulttem.findOne({template: 'salesorder'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
          var socket=req.socket;
          var io=sails.io;
          if(tem) {
          var defaulturl = tem.url + req.param('id')
          io.emit('loadurl', { url: defaulturl });
          }
          else{
          var defaulturl1='http://localhost:1349/salesordera4/'+req.param('id')
            io.emit('loadurl', { url: defaulturl1 });
        }
        Salesorder.findOne({ id: req.param('id') })
        .populate('user')
        .populate('salesperson')
        .exec((err, result) => {
          if (err) {
            return res.negotiate(err)
          }
           return res.json({result: result,template:tem})
          })
      })
    },

    singlesalesorder:(req,res)=>{
      Salesorder.findOne({ id: req.param('id') })
        .populate('user')
        .exec((err, result) => {
          if (err) {
            return res.negotiate(err)
          }
          User.findOne({key: req.param('key')}).exec((err, user) => {
            if (!user) {
              return res.json(401, {err: ' INVALID VALIDATION KEY'});
            }
            Bank.find()
              .exec((err,bank)=> {
                Posconfig.find()
                  .exec((err,config)=> {
                    return res.json({config: config,result: result, user: user, bank: bank})
                  })
              })
          })
        })
    },
  //for adding the data to the database
    addSalesorder: (req, res) => {
      let autoinc;
      Salesorder.find({sort:'soid DESC',limit:1})
      .exec((err,salesorderid)=> {
          if (err) {return res.negotiate(err)}
              console.log(salesorderid)
              if(salesorderid.length>0)
               autoinc =  parseInt(salesorderid[0].soid) + 1;
      })
        Salesorder.findOne({soid:req.param('soid')})
        .exec((err,findedid)=> {
            if (err) {return res.negotiate(err)}
            if(findedid){
                console.log('ok')
            }
            else{
                console.log('else')
                autoinc = req.param('soid')
            }
        console.log(autoinc)
        let value = autoinc.toString()
        let estid = 'SO-' + value.padStart(7, 0);
        Salesorder.create({
          user: req.param('user'),
          username: req.param('username'),
          placeofsuply: req.param('placeofsuply'),
          salesorderid: estid,
          soid: autoinc,
          status: req.param('status'),
          startdate: req.param('startdate'),
          notes: req.param('notes'),
          salesorder: req.param('product'),
          subtotal: req.param('subtotal'),
          cgstprice: req.param('cgstprice'),
          sgstprice: req.param('sgstprice'),
          igstprice: req.param('igstprice'),
          cessprice: req.param('cessprice'),
          maintotal: req.param('maintotal'),
          discount:req.param('discount'),
          adjustment:req.param('adjustment'),
          shipping:req.param('shipping'),
          salesperson:req.param('salesperson'),
          clientid: req.param('clientid'),
          salespersonname:req.param('salespersonname')
        }).exec((err, result) => {
          if (err) {return res.negotiate(err)}
          Salesorder.count().exec((err, count) => {
            if (err) {return res.negotiate(err)}
            return res.json({count: count, result: result})
          })
        })
        })
    },

    deleteSalesorder: (req, res) => {
      Salesorder.destroy({ id: req.param('id') }).exec((err, result) => {
        if (err) { return res.negotiate(err) }
        return res.json({ result: result })
      })
    },
    updateSalesorder: (req, res) => {
     let autoinc;
      Salesorder.findOne({soid:req.param('soid')})
        .exec((err,findedid)=> {
          if (err) { return res.negotiate(err) }
          console.log(findedid)
            if (err) {return res.negotiate(err)}
            if(findedid){
              if(findedid.soid != req.param('oldid'))
               return res.json(401,{err:'Sales Order ID already exist'})
            }

            autoinc = req.param('soid')
            let value = autoinc.toString()
            let estid = 'SO-' + value.padStart(7, 0);
      Salesorder.update({ id: req.param('id') }, {
        user: req.param('user'),
        placeofsuply: req.param('placeofsuply'),
        salesorderid: estid,
        soid: autoinc,
        status: req.param('status'),
        startdate: req.param('startdate'),
        notes: req.param('notes'),
        salesorder: req.param('product'),
        subtotal: req.param('subtotal'),
        cgstprice: req.param('cgstprice'),
        sgstprice: req.param('sgstprice'),
        igstprice: req.param('igstprice'),
        cessprice: req.param('cessprice'),
        maintotal: req.param('maintotal'),
        discount:req.param('discount'),
        adjustment:req.param('adjustment'),
        shipping:req.param('shipping'),
        salesperson:req.param('salesperson'),
        salespersonname:req.param('salespersonname')
      }).exec((err, result) => {
        if (err) { return res.negotiate(err) }
        Estimate.count().exec((err, count) => {
          if (err) { return res.negotiate(err) }
          return res.json({ count: count, result: result })
        })
      })
    })
    },
    getall: (req, res) => {
      if (req.param('category') === 'All') {
        Salesorder.find({
          sort: 'createdAt DESC',
          limit: req.param('limit'),
          skip: req.param('skip')
        })
          .populate('user')
          .exec((err, result) => {
            if (err) return res.negotiate(err);
            Salesorder.count({}).exec((err, count) => {
              if (err) return res.negotiate(err);
              return res.json({ result: result, count: count })
            })
          })
      }
      else {
        Salesorder.find({
          sort: 'createdAt DESC',
          limit: req.param('limit'),
          skip: req.param('skip'),
          status: req.param('category')
        })
          .populate('user')
          .exec((err, result) => {
            if (err) return res.negotiate(err);
            Salesorder.count({ status: req.param('category') }).exec((err, count) => {
              if (err) return res.negotiate(err);

              return res.json({ result: result, count: count })
            })
          })
      }
    },
    searchSalesorder: (req, res) => {
      if (req.param('category') === 'All') {
        Salesorder.find({
          or: [{salesorderid: { 'contains': req.param('searchtext') }},
          {username: {'contains': req.param('searchtext')}}],
          sort: 'createdAt DESC',
          limit: req.param('limit'),
          skip: req.param('skip'),

        }).populate('user')
          .exec((err, result) => {
            if (err) return res.negotiate(err);
            Salesorder.count({
              or: [{salesorderid: { 'contains': req.param('searchtext') }},
          {username: {'contains': req.param('searchtext')}}],

            }).exec((err, count) => {
              return res.json({ result: result, count: count })
            })
          })
      }
      else {
        Salesorder.find({
          or: [{salesorderid: { 'contains': req.param('searchtext') }},
          {username: {'contains': req.param('searchtext')}}],
          sort: 'createdAt DESC',
          limit: req.param('limit'),
          skip: req.param('skip'),
          status: req.param('category')
        }).populate('user')
          .exec((err, result) => {
            if (err) return res.negotiate(err);
            Salesorder.count({
              or: [{salesorderid: { 'contains': req.param('searchtext') }},
          {username: {'contains': req.param('searchtext')}}],
              status: req.param('category')
            }).exec((err, count) => {
              return res.json({ result: result, count: count })
            })
          })
      }
    },

    salesorderreport:(req,res)=>{
      console.log('enters')
      Salesorder.find({where:{"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .populate('salesperson')
      .populate('user')
      .exec((err, data) => {
          if (err) return res.negotiate(err);
          Salesorder.find({where:{"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
       .sum('maintotal','subtotal','cgstprice','sgstprice','igstprice','cessprice')
          .exec((err, totalreturn) => {
            return res.json({data: data, totalreturn: totalreturn})
          })
        })
    },

//Sales Order report By Salesperson

getreportsalesorder:(req,res)=>{
    console.log('enters')
    Salesorder.find({where:{"salesperson":req.param('id'),"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .populate('salesperson')
      .populate('user')
      .exec((err, result) => {
      if (err) return res.negotiate(err);
    Salesorder.find({where:{"salesperson":req.param('id'),"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
      .sum('maintotal')
      .exec((err, data) => {
      return res.json({amount:data,result:result})
    })
  })
  },



    checkid:(req,res)=>{
        Salesorder.findOne({ soid: req.param('id')})
        .exec((err, salesorderId) => {
            if (err) { return res.negotiate(err) }
            if(salesorderId)
            return res.json(401, { err: 'salesorder ID Already Exist' });
            else
            return res.json({ msg: 'ok' });

        })
    },
  };

