/**
 * EstimateController
 *
 * @description :: Server-side logic for managing Estimates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  //generating the estimate id
  getid: (req, res) => {
    Estimate.update({enddate: { "<=": req.param('enddate')},status:'Draft'},{
      status:'Expired'
    })
      .exec((err, statusupdate) => {
        if (err) return res.negotiate(err);

    Estimate.find({ sort: 'estid DESC' })
    .populate('user')
        .exec((err, result) => {
            if (err) { return res.negotiate(err) }
            Estimate.count().exec((err, count) => {
                if (result.length < 1) {
                    var soid = 1
                }
                else {
                    var soid = result[0].estid + 1
                }
                return res.json({ count: count, result: result, id: soid })
            })
        })
      })

  },

  checkid:(req,res)=>{
    Estimate.findOne({ estid: req.param('id')})
    .exec((err, estimateId) => {
        if (err) { return res.negotiate(err) }
        if(estimateId)
        return res.json(401, { err: 'Estimate ID Already Exist' });
        else
        return res.json({ msg: 'ok' });
      })
  },
  estimatebyid: (req, res) => {
    Defaulttem.findOne({template: 'estimate'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
     var socket=req.socket;
          var io=sails.io;
          if(tem) {
        var defaulturl = tem.url + req.param('id')
        io.emit('loadurl', { url: defaulturl });
      }
      else{
        var defaulturl1='http://localhost:1349/estimatea4/'+req.param('id')
        io.emit('loadurl', { url: defaulturl1 });
      }
    Estimate.findOne({ id: req.param('id') })
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
  singleestimate:(req,res)=>{
    Estimate.findOne({ id: req.param('id') })
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

  addestimate: (req, res) => {
    if(!req.param('estimateid')){
      return res.json(401, { err: 'The Estimate Number field should not be empty' });              
    }
    let estnumber;
    Estimate.findOne({estid:req.param('estimateid'),limit:1}).exec((err,est)=>{
      if (err) return res.negotiate(err);
      if(est){
        return res.json(401, { err: 'Estimate ID Already Exist' });        
      }
      else{
      let autoinc = req.param('estimateid');
      let value = autoinc.toString()
      estnumber= 'EST-' + value.padStart(7, 0);
      }

      Estimate.create({
        user: req.param('user'),
        username: req.param('username'),
        placeofsuply: req.param('placeofsuply'),
        estimateid: estnumber,
        estid: req.param('estimateid'),
        status: req.param('status'),
        startdate: req.param('startdate'),
        enddate: req.param('enddate'),
        notes: req.param('notes'),
        estimate: req.param('product'),
        subtotal: req.param('subtotal'),
        cgstprice: req.param('cgstprice'),
        sgstprice: req.param('sgstprice'),
        igstprice: req.param('igstprice'),
        cessprice: req.param('cessprice'),
        maintotal: req.param('maintotal'),
        salesperson:req.param('salesperson'),
        clientid: req.param('clientid')
      }).exec((err, result) => {
        if (err) {
          console.log(err)
          return res.negotiate(err)
        }
        Estimate.count().exec((err, count) => {
          if (err) {
            return res.negotiate(err)
          }
          return res.json({count: count, result: result})
        })
      })
    })
  },
  deleteestimate: (req, res) => {
    Estimate.destroy({ id: req.param('id') }).exec((err, result) => {
      if (err) { return res.negotiate(err) }
      return res.json({ result: result })
    })
  },
  updateestimate: (req, res) => {
    if(!req.param('estimateid')){
      return res.json(401, { err: 'The Estimate Number field should not be empty' });              
    }
    let estnumber
    Estimate.findOne({estid:req.param('estimateid'),limit:1}).exec((err,est)=>{
      if (err) return res.negotiate(err);
      if(est){
        estnumber = est.estimateid
        if(est.estid!=req.param('orginalid')){
          return res.json(401, { err: 'Estimate ID Already Exist' });        
        }
      }
      else{
      let autoinc = req.param('estimateid');
      let value = autoinc.toString()
      estnumber = 'EST-' + value.padStart(7, 0);
      }

    Estimate.update({ id: req.param('id') }, {
      user: req.param('user'),
      placeofsuply: req.param('placeofsuply'),
      status: req.param('status'),
      startdate: req.param('startdate'),
      enddate: req.param('enddate'),
      notes: req.param('notes'),
      estimateid: estnumber,
      estid: req.param('estimateid'),
      estimate: req.param('product'),
      subtotal: req.param('subtotal'),
      cgstprice: req.param('cgstprice'),
      sgstprice: req.param('sgstprice'),
      igstprice: req.param('igstprice'),
      cessprice: req.param('cessprice'),
      maintotal: req.param('maintotal'),
      salesperson:req.param('salesperson')
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
      Estimate.find({
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({ status: req.param('category') }).exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Estimate.find({
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({ status: req.param('category') }).exec((err, count) => {
            if (err) return res.negotiate(err);

            return res.json({ result: result, count: count })
          })
        })
    }
  },
  searchestimate: (req, res) => {
    if (req.param('category') === 'Approved') {
      Estimate.find({
        or: [{estimateid: { 'contains': req.param('searchtext') }},
        {username: {'contains': req.param('searchtext')}}],
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({
            estimateid: { 'contains': req.param('searchtext') },
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Estimate.find({
        or: [{estimateid: { 'contains': req.param('searchtext') }},
        {username: {'contains': req.param('searchtext')}}],
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({
            estimateid: { 'contains': req.param('searchtext') },
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
  },

////Estimate Order report By Salesperson

getreportestimate:(req,res)=>{
  console.log('enters')
  Estimate.find({where:{"salesperson":req.param('id'),"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .populate('salesperson')
    .populate('user')
    .exec((err, result) => {
    if (err) return res.negotiate(err);
  Estimate.find({where:{"salesperson":req.param('id'),"startdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
    .sum('maintotal')
    .exec((err, data) => {
    return res.json({amount:data,result:result})
  })
})
},


};

