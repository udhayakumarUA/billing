/**
 * BankController
 *
 * @description :: Server-side logic for managing banks
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getdetails:(req,res)=>{
        Bank.find({userid:req.param('userid')}).exec((err,bank)=>{
            if(err) return res.negotiate(err);
            return res.json({bank:bank})
        })
    },


    updatebank:(req,res)=>{
        Bank.find({userid:req.param('userid')}).exec((err, found)=>{
            if(err){}
            if(found.length==0||found===undefined){
                Bank.create({userid:req.param('userid'),bankname:req.param('bankname'),branchname:req.param('branchname'),accountno:req.param('accountno'),accountname:req.param('accountname'),ifsccode:req.param('ifsccode')})
                .exec((bank)=>{

                    return res.json({bank:bank})
                })
            }
            else{
                Bank.update({id:found[0].id},{bankname:req.param('bankname'),branchname:req.param('branchname'),accountno:req.param('accountno'),accountname:req.param('accountname'),ifsccode:req.param('ifsccode')
                }).exec((err,bank)=>{
                    if(err){return res.negotiate(err)}
                    return res.json({bank:bank})
                })
            }
        })
    },
};

