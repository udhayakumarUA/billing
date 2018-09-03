/**
 * InventoryreasonController
 *
 * @description :: Server-side logic for managing inventoryreasons
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    addnewreason: (req, res) => {
        Inventoryreason.findOne({ reason: req.param('reason') }).exec((err, result) => {
            if (result) {
                return res.json(401, { err: 'Inventory reason is already exists' });
            }
            else {
                Inventoryreason.create({ reason: req.param('reason') }).exec((err, create) => {
                    if (err) { return res.negotiate(err) }
                    Inventoryreason.find().exec((err, data) => {
                        if (err) { return res.negotiate(err) }
                        return res.json({ data: data })
                    })
                })
            }
        })
    },
    findreason: (req, res) => {
        Inventoryreason.find().exec((err, data) => {
            if (err) { return res.negotiate(err) }
            return res.json({ data: data })
        })
    },
    deleteaddedreason:(req,res)=>{
        Inventoryreason.destroy({id:req.param('id')}).exec((err, deleted) => {
            if (err) { return res.negotiate(err) }
            Inventoryreason.find().exec((err, data) => {
                if (err) { return res.negotiate(err) }
                return res.json({ data: data })
            })
        })
    }
	
};

