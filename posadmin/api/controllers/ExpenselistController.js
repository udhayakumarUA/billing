/**
 * ExpenselistController
 *
 * @description :: Server-side logic for managing expenselists
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addnewexpense: (req, res) => {
        Expenselist.findOne({userid:req.param('userid'), type: req.param('type') }).exec((err, result) => {
            if (result) {
                return res.json(401, { err: 'Expense Type is already exists' });
            }
            else {
                Expenselist.create({userid:req.param('userid'), type: req.param('type') }).exec((err, create) => {
                    if (err) { return res.negotiate(err) }
                    Expenselist.find({userid:req.param('userid')}).exec((err, data) => {
                        if (err) { return res.negotiate(err) }
                        return res.json({ data: data })
                    })
                })
            }
        })
    },
    findexpense: (req, res) => {
        Expenselist.find({userid:req.param('userid')}).exec((err, data) => {
            if (err) { return res.negotiate(err) }
            return res.json({ data: data })
        })
    }
    
};

