/**
 * SalespersonController
 *
 * @description :: Server-side logic for managing salespeople
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getAllSalesPerson:(req,res)=>{
        Salesperson.find({
            sort: 'refid DESC',
            limit: req.param('limit'),
            skip: req.param('skip')
          })
            .exec((err, result) => {
                // let singlesalesp = result.map((pre)=>
                //   pre.id
                // );
                let singlesalesp
                // = result.reduce(function(a,b){
                //     if (a.indexOf(b) < 0 ) a.push(b);
                //     return a;
                //   },[]);

                  result.forEach(element => {
                Estimate.findOne({salesperson:element.id}).exec((err,pos)=>{if(pos){element.used=true}})
                Pos.findOne({salesperson:element.id}).exec((err,estimate)=>{if(estimate){element.used=true}})
                Salesorder.findOne({salesperson:element.id}).exec((err,sales)=>{if(sales){element.used=true}})
            });
              if (err) return res.negotiate(err);
              Salesperson.count().exec((err, count) => {
                if (err) return res.negotiate(err);
                return res.json({ result: result, count: count})
              })
            })
    },
    getSingleSalesPerson:(req,res)=>{
        Salesperson.findOne({
            id:req.param('id'),
          })
            .exec((err, result) => {
                if (err) return res.negotiate(err);
                return res.json({result:result})
            })
    },
    searchSalesperson: (req, res) => {
        Salesperson.find({
            name: {'contains': req.param('searchtext')},
            sort: 'refid DESC',
            limit: req.param('limit'),
            skip: req.param('skip')
          })
            .exec((err, result) => {
              if (err) return res.negotiate(err);
              Salesperson.count({
                  name: {'contains': req.param('searchtext')},
              }).exec((err, count) => {
                return res.json({ result: result, count: count })
              })
            })
    },
    addsalesperson: (req, res) => {
        var autoinc=0;
        Salesperson.find({ sort: 'refid DESC', limit: 1 })
        .exec((err, refid) => {
            if (err) return res.negotiate(err);
            if (refid.length >= 1) {
                autoinc = parseInt(refid[0].refid) + 1;
            }
            if (refid.length < 1) {
                autoinc = 1;
            }
            Salesperson.create({
                name:req.param('name'),
                email:req.param('email'),
                phonenumber:req.param('phonenumber'),
                refid:autoinc,
                referenceno:'SLSP-'+autoinc
            })
            .exec((err, added) => {
                Salesperson.find({ sort: 'refid DESC'})
                .exec((err, result) => {
                if (err) return res.negotiate(err);
                return res.json({result:result})
            })
        })
        })
    },
    updateSalesPerson:(req,res)=>{
        Salesperson.update({id:req.param('id')},{
            name:req.param('name'),
            email:req.param('email'),
            phonenumber:req.param('phonenumber'),
        })
        .exec((err, results) => {
        Salesperson.find({ sort: 'refid DESC'})
        .exec((err, result) => {
        if (err) return res.negotiate(err);
        return res.json({result:result})
    })
    })
    },
    deleteSalesPerson:(req,res)=>{
        Salesperson.destroy({id:req.param('id')},{
        })
        .exec((err, results) => {
        Salesperson.find({ sort: 'refid DESC'})
        .exec((err, result) => {
        if (err) return res.negotiate(err);
        return res.json({result:result})
    })
    })
    },

    getsalesperson:(req,res)=>{
      Salesperson.find({ id:req.param('id')})
        .exec((err, result) => {
          if (err) return res.negotiate(err);
          return res.json({salesperson:result})
        })
    }

};

