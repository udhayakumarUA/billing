/**
 * InventoryAdjustmentController
 *
 * @description :: Server-side logic for managing Inventoryadjustments
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    getid: (req, res) => {

        InventoryAdjustment.find({ sort: 'refid DESC' })
            .exec((err, result) => {
                if (err) { return res.negotiate(err) }
                InventoryAdjustment.count().exec((err, count) => {
                    if (result.length < 1) {
                        var refid = 1
                        return res.json({ result: result, id: refid })
                    }
                    else {

                        var refid = result[0].refid + 1
                        return res.json({ count: count, result: result, id: refid })
                    }

                })
            })

    },
    getAllInventory: (req, res) => {
        InventoryAdjustment.find({
            sort: 'refid DESC',
            limit: req.param('limit'),
            skip: req.param('skip')
        })
            .populate('user')
            .populate('item')
            .exec((err, result) => {
                if (err) return res.negotiate(err);
                InventoryAdjustment.count().exec((err, count) => {
                    if (err) return res.negotiate(err);
                    return res.json({ result: result, count: count })
                })
            })
    },
    getSingleBill: (req, res) => {
        InventoryAdjustment.findOne({
            referenceNumber: req.param('id'),
        })
            .populate('user')
            .populate('item')
            .exec((err, result) => {
                if (err) return res.negotiate(err);
                return res.json({ result: result })
            })
    },
    searchInventory: (req, res) => {
        InventoryAdjustment.find({
            or: [{ referenceNumber: { 'contains': req.param('searchtext') } },
            { username: { 'contains': req.param('searchtext') } },
            { itemname: { 'contains': req.param('searchtext') } }],
            sort: 'refid DESC',
            limit: req.param('limit'),
            skip: req.param('skip')
        }).populate('user').populate('item')
            .exec((err, result) => {
                if (err) return res.negotiate(err);
                InventoryAdjustment.count({
                    or: [{ referenceNumber: { 'contains': req.param('searchtext') } },
                    { username: { 'contains': req.param('searchtext') } },
                    { itemname: { 'contains': req.param('searchtext') } }],
                }).exec((err, count) => {
                    return res.json({ result: result, count: count })
                })
            })
    },

    addInventory: (req, res) => {
        InventoryAdjustment.findOne({ refid: req.param('refid') })
            .exec((err, inventoryId) => {
                if (err) {
                    return res.negotiate(err)
                }
                let calculate = (os, ns) => {
                    //os->old stock value
                    //ns->new stock value
                    Products.findOne({ id: req.param('item') }).exec((err, product) => {
                        let currentstock = parseInt(product.stockinhand)
                        let adjustment = ((currentstock - parseInt(os)) + parseInt(ns))
                        Products.update({ id: req.param('item') }, { stockinhand: adjustment })
                            .exec((err) => {
                                if (err) {
                                    return res.negotiate(err)
                                }
                            })
                    })
                }
                if (inventoryId) {
                    if (req.param('edit') && (req.param('refid') == inventoryId.refid)) {
                        calculate(req.param('oldstock'), req.param('quantity'))
                        InventoryAdjustment.update({ id: req.param('inventoryId') },
                            {
                                referenceNumber: 'ADJ-' + req.param('refid'),
                                refid: req.param('refid'),
                                quantity: req.param('quantity'),
                                date: req.param('date'),
                                item: req.param('item'),
                                itemname:req.param('itemname'),
                                reason: req.param('reason'),
                                description: req.param('description'),
                                user: req.param('user'),
                                username: req.param('username')
                            })
                            .exec((err, inventory) => {
                                if (err) { return res.negotiate(err) }
                                return res.json({ inventory: inventory })

                            })
                    }
                    else
                        return res.json(401, { err: 'Inventory ID Already Exist' });
                }
                else {
                    calculate(0, req.param('quantity'))
                    InventoryAdjustment.create({
                        referenceNumber: 'ADJ-' + req.param('refid'),
                        refid: req.param('refid'),
                        quantity: req.param('quantity'),
                        date: req.param('date'),
                        item: req.param('item'),
                        itemname:req.param('itemname'),
                        reason: req.param('reason'),
                        description: req.param('description'),
                        user: req.param('user'),
                        username: req.param('username')
                    })
                        .exec((err, inventory) => {
                            if (err) { return res.negotiate(err) }
                            Inventoryreason.update({ reason: req.param('reason') }, { used: true })
                                .exec(err => {if (err) { return res.negotiate(err) } } )
                            return res.json({ inventory: inventory })

                        })
                }
            })
    },
    checkid: (req, res) => {
        InventoryAdjustment.findOne({ refid: req.param('id') })
            .exec((err, inventoryId) => {
                if (err) { return res.negotiate(err) }
                if (inventoryId)
                    return res.json(401, { err: 'Inventory ID Already Exist' });
                else
                    return res.json({ msg: 'ok' });

            })
    },
    //Search the inventory item from the products api
    searchInventoryProducts: (req, res) => {
        Products.find({
            or: [{ productname: { 'contains': req.param('searchtext') } }
                , { sku: { 'contains': req.param('searchtext') } }],
            trackinventary: true,
            limit: 10,
            sort: 'productname ASC'
        })
            .exec((err, products) => {
                if (err) return res.negotiate(err);

                return res.json({ products: products })
            })
    },
    //delete the inventory from the database
    deleteInventory: (req, res) => {
        Products.findOne({ id: req.param('productid') }).exec((err, product) => {
            let currentstock = parseInt(product.stockinhand)
            let adjustment = currentstock - parseInt(req.param('quantity'))
            Products.update({ id: req.param('productid') }, { stockinhand: adjustment })
                .exec((err) => {
                    if (err) { return res.negotiate(err) }
                })
        })
        InventoryAdjustment.destroy({ id: req.param('id') }).exec((err, result) => {
            if (err) { return res.negotiate(err) }
            InventoryAdjustment.findOne({ reason: req.param('reason') }).exec((err, finded) => {
                if (finded == undefined) {
                    console.log('enters')
                    Inventoryreason.update({ reason: req.param('reason') }, { used: false }).exec((err, updated) => {
                        if (err) { return res.negotiate(err) }
                    })
                }
                return res.json({ result: result })
            })
        })
    },
    //report for the inventory adjustment
    getinventoryadjustment: (req, res) => {
        InventoryAdjustment.find({
            sort: 'refid DESC'
        }).where({ "date": { ">=": req.param('startdate'), "<=": req.param('enddate') } })
            .populate('user')
            .populate('item')
            .exec((err, result) => {
                if (err) return res.negotiate(err);
                return res.json({ result: result })
            })
    },
};

