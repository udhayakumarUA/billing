/**
 * PaymentreceivedController
 *
 * @description :: Server-side logic for managing paymentreceiveds
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  paymentreceived:(req,res)=>{
    Pos.findOne({posid:req.param('billid')}).exec((err,pos)=>{
      if (err) return res.negotiate(err);
      if(pos.balance<req.param('amount')){
        return res.json(401,{err:'payment failed'})
      }

    Paymentreceived.find({sort:'count DESC',limit:1}).exec((err,payid)=>{
      if (err) return res.negotiate(err);
      if(payid.length>=1) {
        var count = parseInt(payid[0].count) + 1;
      }
      if(payid.length<1){
        var count=1;
      }
      Paymentreceived.create({
        user:req.param('user'),
        paymentdate:req.param('paymentdate'),
        paymentmode:req.param('paymentmode'),
        paymentid:'REC-'+count,
        billid:req.param('billid'),
        amount:req.param('amount'),
        totalamount:pos.maintotal,
        username:req.param('username'),
        count:count,
        notes:req.param('notes'),
        posid:pos.id,
        clientid:req.param('clientid')
      }).exec((err,payments)=>{
        if (err) return res.negotiate(err);
        var balance=parseFloat(pos.balance)-parseFloat(req.param('amount'));

        if(balance==0){
          var status='Paid'
        }
        else if(balance>0){
          var status='Partially Paid'
        }
        Pos.update({id:pos.id},{balance:balance.toFixed(2),status:status}).exec((err,updated)=>{
          if (err) return res.negotiate(err);
          return res.json({payid:payments.paymentid})
       })
      })
     })
    })
  },
  reportbypayment:(req,res)=>{
    Paymentreceived.find({ where:{"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}},sum:['amount']})
    .exec((err,data)=>{
        if (err) {return res.negotiate(err)}
        Paymentreceived.find({ where:{"paymentdate" : { ">=" :req.param('startdate'), "<=" : req.param('enddate')}}})
        .exec((err,result)=>{
        if (err) {return res.negotiate(err)}
        return res.json({amount:data,result:result})
    })
  })
  },
  deletebill:(req,res)=>{
    Paymentreceived.findOne({id:req.param('id')}).exec((err,pay)=> {
      if (err) return res.negotiate(err);
      console.log(pay)
      Pos.findOne({posid: pay.billid}).exec((err, pos) => {
        console.log(pos)
        if (err) return res.negotiate(err);
        Paymentreceived.destroy({id:req.param('id')}).exec((err,deleted)=>{
          if (err) return res.negotiate(err);
        })
        var balance=parseFloat(pos.balance)+parseFloat(pay.amount);
        var paying=parseFloat(pos.totalpaying)-parseFloat(pay.amount);
        if(balance==0){
          var status='Paid'
        }
        else if(balance==pos.maintotal){
          var status='Draft'
        }
        else if(balance>0){
          var status='Partially Paid'
        }
        Pos.update({id:pos.id},{balance:balance.toFixed(2),status:status,totalpaying:paying}).exec((err,updated)=>{
          if (err) return res.negotiate(err);
          return res.json({message:'deleted'})
        })

      })
    })
  },
  getall:(req,res)=>{
    Paymentreceived.find({sort:'count DESC',limit:req.param('limit'),skip:req.param('skip')}) 
    .populate('user')
      .exec((err,payments)=> {
      if (err) return res.negotiate(err);
      Paymentreceived.count().exec((err, count) => {
        if (err) return res.negotiate(err);
        return res.json({payments: payments, count: count})
      })
    })
  },
  getcount:(req,res)=>{
    Paymentreceived.count().exec((err,count)=>{
      if (err) return res.negotiate(err);
      return res.json({count:count})
    })
  },
  searchpayment:(req,res)=>{
    Paymentreceived.find({
      or:[{username:{'contains':req.param('searchtext')}}
        ,{paymentid:{'contains':req.param('searchtext')}}
        ,{billid:{'contains':req.param('searchtext')}}]
        ,sort: 'count DESC'
        ,skip:req.param('skip'),limit:req.param('limit')
    }).populate('user')
      .exec((err,payments)=> {
      if (err) return res.negotiate(err);
      Paymentreceived.count({
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

  singlepayment:(req,res)=>{
    Paymentreceived.findOne({paymentid:req.param('id')})
      .populate('user')
      .exec((err,payment)=>{
        if (err) return res.negotiate(err);
        return res.json({payment:payment})
      })
  },

};

