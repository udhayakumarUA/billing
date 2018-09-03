/**
 * ExpenselistController
 *
 * @description :: Server-side logic for managing expenselists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addnewexpense: (req, res) => {
        Expenselist.findOne({ type: req.param('type') }).exec((err, result) => {
            if (result) {
                return res.json(401, { err: 'Expense Type is already exists' });
            }
            else {
                Expenselist.create({ type: req.param('type') }).exec((err, create) => {
                    if (err) { return res.negotiate(err) }
                    Expenselist.find().exec((err, data) => {
                        if (err) { return res.negotiate(err) }
                        return res.json({ data: data })
                    })
                })
            }
        })
    },
    findexpense: (req, res) => {
        Expenselist.find().exec((err, data) => {
            if (err) { return res.negotiate(err) }
            return res.json({ data: data })
        })
    },
    deleteaddedexpense:(req,res)=>{
        Expenselist.destroy({id:req.param('id')}).exec((err, data) => {
            if (err) { return res.negotiate(err) }
            return res.json({ data: data })
        })
    }
    
};

