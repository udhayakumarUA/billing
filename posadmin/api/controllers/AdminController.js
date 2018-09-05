/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
var bcrypt = require('bcrypt-nodejs');
module.exports = {
    changepassword: (req, res) => {
        let password = req.param('old');
        Admin.findOne({ id: req.session.adminId }).exec((err, user) => {
            // console.log(user)
            console.log(crypto.comparePassword(password, user));
            if (err) { return res.negotiate(err) }
            if (!user) return res.json(401, { err: 'user not found' });
            else if (!crypto.comparePassword(password, user)) {
                return res.json(401, { err: 'invalid  old password' });
            }

            else {
                let newpass = bcrypt.hashSync(req.param('password'));
                Admin.update({ id: user.id }, { password: newpass }).exec((err, data) => {
                    if (err) { return res.negotiate(err) }
                    return res.json({ user: user, msg: 'password changed successfully' });
                })
            }


        })
    },
    addsubadmin: (req, res) => {

        let password = bcrypt.hashSync(req.param('password'));
        if (req.param('edit')) {
            Admin.update({ id: req.param('id') }, { password: password })
                .exec((err, result) => {
                    if (err) { return res.negotiate(err) }
                    return res.json({ result: result, msg: 'Updated Successfully' })
                })
        }
        else {
            Admin.findOne({ username: req.param('username') }).exec((err, data) => {
                if (err) { return res.negotiate(err) }
                if(data) return res.json(401,{err:'Username Alerady Exist'})
                Admin.create({ username: req.param('username'), password: password, role: 'A' })
                    .exec((err, result) => {
                        if (err) { return res.negotiate(err) }
                        return res.json({ result: result, msg: 'Added Successfully' })
                    })
            })
        }
    },
    getsubadmin: (req, res) => {
        Admin.find({ role: { '!': 'SA' } })
            .exec((err, result) => {
                if (err) { return res.negotiate(err) }
                return res.json({ result: result })
            })
    },
    deletesubadmin: (req, res) => {
        Admin.destroy({ id: req.param('id') })
            .exec((err, result) => {
                if (err) { return res.negotiate(err) }
                return res.json({ result: result })
            })
    }
	
};

