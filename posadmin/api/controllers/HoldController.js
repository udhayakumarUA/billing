/**
 * HoldController
 *
 * @description :: Server-side logic for managing holds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  addhold:(req,res)=>{
    Hold.create({
      userid:req.param('clientid'),
      products:req.param('products'),
      maintotal:req.param('maintotal'),
      taxtotal:req.param('taxtotal'),
      discount:req.param('discount'),
      items:req.param('items'),
      totalquantity:req.param('totalquantity'),
      user:req.param('user')
    }).exec((err,poscreated)=>{
      if(err) return res.negotiate(err);
      return res.json({message:'hold created'})
    })
  },
  restoreholdbills:(req,res)=>{
    Hold.findOne({id:req.param('id')}).exec((err,holds)=> {
      if (err) return res.negotiate(err);
      Hold.destroy({id: req.param('id')}).exec((err, deleted) => {
        if (err) return res.negotiate(err);
        return res.json({holds:holds})
      })
    })
  },
  getholdbills:(req,res)=>{
    Hold.find({userid:req.param('clientid')}).exec((err,holds)=> {
      if (err) return res.negotiate(err);
      return res.json({holds: holds})
    })
  }
};

