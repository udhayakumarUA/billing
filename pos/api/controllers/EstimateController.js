/**
 * EstimateController
 *
 * @description :: Server-side logic for managing Estimates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  //generating the estimate id
  getid: (req, res) => {

    Estimate.find({ sort: 'createdAt DESC' })
      .populate('user')
      .exec((err, result) => {
        if (err) { return res.negotiate(err) }
        Estimate.count().exec((err, count) => {
          if (result.length == 0) {
            var estid = 1

            return res.json({ result: result, id: estid })
          }
          else {
            var estid = result[0].estid + 1
            return res.json({ count: count, result: result, id: estid })
          }

        })
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
    console.log('estimate enters')
    var autoinc= 0;
    Estimate.find({sort:'estid DESC',limit:1}).exec((err,estimateid)=> {
      if (estimateid.length >= 1) {
        var autoinc = parseInt(estimateid[0].estid) + 1;
        var value = autoinc.toString()
        var estid = 'EST-' + value.padStart(7, 0);
      }
      if (estimateid.length < 1) {
        var autoinc = 1;
        var value = autoinc.toString()
        var estid = 'EST-' + value.padStart(7, 0);
      }
      console.log(estid)
      Estimate.create({
        user: req.param('user'),
        username: req.param('username'),        
        placeofsuply: req.param('placeofsuply'),
        estimateid: estid,
        estid: autoinc,
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
    Estimate.update({ id: req.param('id') }, {
      user: req.param('user'),
      placeofsuply: req.param('placeofsuply'),
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
      maintotal: req.param('maintotal')
    }).exec((err, result) => {
      if (err) { return res.negotiate(err) }
      Estimate.count().exec((err, count) => {
        if (err) { return res.negotiate(err) }
        return res.json({ count: count, result: result })
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
};

