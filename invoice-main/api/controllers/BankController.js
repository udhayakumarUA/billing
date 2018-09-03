/**
 * BankController
 *
 * @description :: Server-side logic for managing banks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
  getdetails:(req,res)=>{
    Bank.find({sort:'createdAt:DESC'}).exec((err,bank)=>{
      if(err) return res.negotiate(err);
      return res.json({bank:bank})
    })
  },


  updatebank:(req,res)=>{
    if(req.param('id')){
        Bank.update({id:req.param('id')},{bankname:req.param('bankname'),branchname:req.param('branchname'),accountno:req.param('accountno'),accountname:req.param('accountname'),ifsccode:req.param('ifsccode')
        }).exec((err,bank)=>{
          if(err){return res.negotiate(err)}
          return res.json({bank:bank,msg:'Bank Details Updated'})
        })
      }
      else {
        Bank.create({bankname:req.param('bankname'),branchname:req.param('branchname'),accountno:req.param('accountno'),accountname:req.param('accountname'),ifsccode:req.param('ifsccode')
        }).exec((err,bank)=>{
          if(err){return res.negotiate(err)}
          return res.json({bank:bank,msg:'Bank Details Added Successfully'})
        })
      }
  },
  deletebank:(req,res)=>{
    Bank.destroy({id:req.param('id')}).exec((err,bank)=>{
      if(err) return res.negotiate(err);
      return res.json({bank:bank})
    })
  },
  setdefault:(req,res)=>{
    Bank.findOne({default:true}).exec((err,found)=>{
      if(err) return res.negotiate(err);
      if(found){
        Bank.update({id:found.id},{default:false}).exec((err,changed)=>{ 
          console.log(changed.default)
        })
      }
        Bank.update({id:req.param('id')},{default:true}).exec((err,result)=>{ 
          return res.json({result:result})
        })
  })
  },
  
};

