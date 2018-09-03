/**
 * PaymentmadeController
 *
 * @description :: Server-side logic for managing paymentmades
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  paymentmade:(req,res)=>{
    Purchase.findOne({purchaseid:req.param('billid')}).exec((err,purchase)=>{
      if (err) return res.negotiate(err);
      if(purchase.balance<req.param('amount')){
        return res.json(401,{err:'payment failed'})
      }

      Paymentmade.find({sort:'count DESC',limit:1}).exec((err,payid)=>{
        if (err) return res.negotiate(err);
        if(payid.length>=1) {
          var count = parseInt(payid[0].count) + 1;
        }
        if(payid.length<1){
          var count=1;
        }
        Paymentmade.create({
          user:req.param('user'),
          paymentdate:req.param('paymentdate'),
          paymentmode:req.param('paymentmode'),
          paymentid:'REC-'+count,
          billid:req.param('billid'),
          amount:req.param('amount'),
          totalamount:purchase.maintotal,
          username:req.param('username'),
          count:count,
          notes:req.param('notes'),
          purchaseid:purchase.id,
          clientid:req.param('clientid')
        }).exec((err,payments)=>{
          if (err) return res.negotiate(err);
          var balance=parseFloat(purchase.balance)-parseFloat(req.param('amount'));
          if(balance==0){
            var status='Paid'
          }
          else if(balance>0){
            var status='Partially Paid'
          }
          Purchase.update({id:purchase.id},{balance:balance.toFixed(2),status:status}).exec((err,updated)=>{
            if (err) return res.negotiate(err);
            return res.json({paymentid: payments,message:'created'})
          })
        })
      })
    })
  },
  reportbypaymentmade:(req,res)=>{
    Paymentmade.find({ where:{"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['amount']})
    .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Paymentmade.find({ where:{"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
        .exec((err,result)=>{
        if (err) {return res.negotiate(err)}
        return res.json({amount:data,result:result})
    })
  })
  },
  getall:(req,res)=>{
    Paymentmade.find({sort:'count DESC',limit:req.param('limit'),skip:req.param('skip')})
      .populate('user')
      .exec((err,payments)=> {
        if (err) return res.negotiate(err);
        Paymentmade.count().exec((err, count) => {
          if (err) return res.negotiate(err);
          return res.json({payments: payments, count: count})
        })
      })
  },
  deletebill:(req,res)=>{
    Paymentmade.findOne({id:req.param('id')}).exec((err,pay)=> {
      if (err) return res.negotiate(err);
      
      Purchase.findOne({purchaseid: pay.billid}).exec((err, purchase) => {
        
        if (err) return res.negotiate(err);
        Paymentmade.destroy({id:req.param('id')}).exec((err,deleted)=>{
          if (err) return res.negotiate(err);
        })
        var balance=parseFloat(purchase.balance)+parseFloat(pay.amount);
        var paying=parseFloat(purchase.totalpaying)-parseFloat(pay.amount);
        if(balance==0){
          var status='Paid'
        }
        else if(balance==purchase.maintotal){
          var status='Draft'
        }
        else if(balance>0){
          var status='Partially Paid'
        }
        Purchase.update({id:purchase.id},{balance:balance.toFixed(2),status:status,totalpaying:paying}).exec((err,updated)=>{
          if (err) return res.negotiate(err);
          return res.json({message:'deleted'})
        })

      })
    })
  },
  getcount:(req,res)=>{
    Paymentmade.count().exec((err,count)=>{
      if (err) return res.negotiate(err);
      return res.json({count:count})
    })
  },
  searchpayment:(req,res)=>{
    Paymentmade.find({
      or:[{username:{'contains':req.param('searchtext')}}
        ,{paymentid:{'contains':req.param('searchtext')}}
        ,{billid:{'contains':req.param('searchtext')}}]
        ,sort:'count DESC'
      ,skip:req.param('skip'),limit:req.param('limit')
    }).populate('user')
      .exec((err,payments)=> {
        if (err) return res.negotiate(err);
        Paymentmade.count({
          or:[{username:{'contains':req.param('searchtext')}}
            ,{paymentid:{'contains':req.param('searchtext')}}
            ,{billid:{'contains':req.param('searchtext')}}]
        })
          .exec((err, count) => {
            if (err) return res.negotiate(err);
            return res.json({payments: payments,count:count})
          })
      })
  },

  singlepaymade:(req,res)=>{
    
    Paymentmade.findOne({paymentid:req.param('id')})
      .populate('user')
      .exec((err,payment)=>{
        if (err) return res.negotiate(err);
        return res.json({payment:payment})
      })
  },
};

