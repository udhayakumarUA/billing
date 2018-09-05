/**
 * UomController
 *
 * @description :: Server-side logic for managing uoms
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  adduom:(req,res)=>{
    Uom.create({userid:req.param('userid'),
      uomname:req.param('uomname'),
      uomcode:req.param('uomcode'),
      type:'C'
    }).exec((err,created)=>{
      if(err) return res.negotiate(err);
        Uom.find({userid:req.param('userid'),type:'C',sort:'createdAt DESC'}).exec((err,uoms)=> {
          if (err) return res.negotiate(err)
          return res.json({uoms: uoms})
        })
    })
  },
  edituom:(req,res)=>{
    Uom.update({
      id:req.param('id')},
      {uomname:req.param('uomname'),
        uomcode:req.param('uomcode')
      }).exec((err,updated)=>{
      if(err) return res.negotiate(err)
      Uom.find({userid:req.param('userid'),type:'C'}).exec((err,uoms)=> {
        if (err) return res.negotiate(err)
        return res.json({uoms: uoms})
      })
    })
  },
  getsingleuom:(req,res)=>{
    Uom.findOne({id:req.param('id')}).exec((err,uom)=>{
      if(err) return res.negotiate(err)
      return res.json({uom:uom})
    })
  },
  deleteuom:(req,res)=>{
    Uom.destroy({id:req.param('id')}).exec((err,deleted)=>{
      if(err) return res.negotiate(err)
      Uom.find({userid:req.param('userid'),type:'C'}).exec((err,uoms)=> {
        if (err) return res.negotiate(err)
        return res.json({uoms: uoms})
      })
    })
  },
  getuom:(req,res)=>{
    Uom.find({userid:req.param('userid'),type:'C',limit:10}).exec((err,uoms)=>{
      if(err) return res.negotiate(err)
      Uom.count({userid:req.param('userid'),type:'C'}).exec((err,count)=>{
        if(err) return res.negotiate(err)
      Uom.find({userid:req.param('userid'),type:'D'}).exec((err,uoms1)=> {
        if (err) return res.negotiate(err)
        return res.json({uoms: uoms,count:count, uoms1: uoms1})
            })
    })
  })
},
getmoreuom:(req,res)=>{
  Uom.find({userid:req.param('userid'),type:'C',skip:req.param('skip'),limit:10}).exec((err,uoms)=>{
    if(err) return res.negotiate(err)
    Uom.count({userid:req.param('userid'),type:'C'}).exec((err,count)=>{
      if(err) return res.negotiate(err)
      return res.json({uoms: uoms,count:count})
  })
})
  }
};

