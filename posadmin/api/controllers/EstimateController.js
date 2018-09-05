/**
 * EstimateController
 *
 * @description :: Server-side logic for managing Estimates
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
module.exports = {
  //generating the estimate id
  getid: (req, res) => {

    Estimate.find({userid:req.param('clientid'), sort: 'createdAt DESC' })
      .populate('user')
      .exec((err, result) => {
        if (err) { return res.negotiate(err) }
        Estimate.count({userid:req.param('clientid')}).exec((err, count) => {
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
    // Estimate.destroy().exec((err,result)=>{
    // 	return res.json({result:result})
    // })

  },
  estimatebyid: (req, res) => {
    Estimate.findOne({ id: req.param('id') })
      .populate('user')
      .exec((err, result) => {
        if (err) {
          return res.negotiate(err)
        }
        Defaulttem.findOne({userid:req.param('clientid'),template: 'estimate'}).exec((err, tem) => {
          if (err) return res.negotiate(err);
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
        Userclient.findOne({userid:req.param('clientid')}).exec((err, user) => {
          if (!user) {
            return res.json(401, {err: ' INVALID ID'});
          }

          Bank.find({userid:req.param('clientid')})
            .exec((err,bank)=> {
              Posconfig.find({userid:req.param('clientid')})
                  .exec((err,config)=> {
                      return res.json({config: config,result: result, user: user, bank: bank})
                  })
            })
        })
      })
  },

  addestimate: (req, res) => {
    Estimate.find({userid:req.param('clientid'),sort:'estid DESC'}).exec((err,result)=>{		
			if(result.length == 0){
							var estid = 1
							var value = estid.toString()
							var estimateid = 'EXT-' + value.padStart(7, 0);	
						}
						else{
							var estid = result[0].estid +1
							var value = estid.toString()
							var estimateid = 'EXT-' + value.padStart(7, 0);
						}
    Estimate.create({
      userid:req.param('clientid'),
      roleid:req.param('roleid'),
      user: req.param('user'),
      placeofsuply: req.param('placeofsuply'),
      estimateid: estimateid,
      estid: estid,
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
      Estimate.count({userid:req.param('clientid')}).exec((err, count) => {
        if (err) { return res.negotiate(err) }
        return res.json({ count: count, result: result })
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
      Estimate.count({userid:req.param('clientid')}).exec((err, count) => {
        if (err) { return res.negotiate(err) }
        return res.json({ count: count, result: result })
      })
    })
  },
  getall: (req, res) => {
    if (req.param('category') === 'All') {
      Estimate.find({
        userid:req.param('clientid'),
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({ userid:req.param('clientid'),status: req.param('category') }).exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Estimate.find({
        userid:req.param('clientid'),
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      })
        .populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({userid:req.param('clientid'), status: req.param('category') }).exec((err, count) => {
            if (err) return res.negotiate(err);

            return res.json({ result: result, count: count })
          })
        })
    }
  },
  searchestimate: (req, res) => {
    if (req.param('category') === 'Approved') {
      Estimate.find({userid:req.param('clientid'),
        estimateid: { 'contains': req.param('searchtext') },
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip'),
        status: req.param('category')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({userid:req.param('clientid'),
            estimateid: { 'contains': req.param('searchtext') },
            status: req.param('category')
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
    else {
      Estimate.find({userid:req.param('clientid'),
        estimateid: { 'contains': req.param('searchtext') },
        sort: 'estid DESC',
        limit: req.param('limit'),
        skip: req.param('skip')
      }).populate('user')
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          Estimate.count({userid:req.param('clientid'),
            estimateid: { 'contains': req.param('searchtext') },
          }).exec((err, count) => {
            return res.json({ result: result, count: count })
          })
        })
    }
  },
};

