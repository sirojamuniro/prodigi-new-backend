const jwtConvert = require('../../helpers/jwtConvert');
const db = require('../../../models');
const Models = require('../../../models');
const Admin = Models.admin;


// const User = db.User;

exports.validLogin = (req, res, next) => {
    const data = req.session;
    try {
        if (data.email || data.loggedin) {
                next()
        } else {
            req.flash('msg_error', 'Please Login First');
            res.redirect('/admin/login')
        }
    } catch (error) {
        res.status(error.status).send(error.message)
    }
};

exports.validJWTNeeded = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'];
            req.jwt = jwtConvert.verify(authorization);
            res.redirect('admin/index');

        } catch (err) {
            return res.status(403).send({
                message: err.message
            });
        }
    } else {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
};

exports.validJWTNeededAndCheckUser = (req, res, next) => {
    if (req.headers['authorization']) {
        try {
            let authorization = req.headers['authorization'];

            Admin.findOne({
                where: {
                    token: authorization
                },
            })
                .then((data_user) => {
                    if (!data_user) {
                        res.status(400).json({
                            message: 'Expired token'
                        })
                    } else {
                        req.jwt = jwtConvert.verify(authorization);
                        return next();
                    }
                })
                .catch((err) => {
                    res.status(500).send({
                        message: err.message || "Some error occured login Users"
                    })
                })

        } catch (err) {
            return res.status(403).send({
                message: err.message
            });
        }
    } else {
        return res.status(401).send({
            message: "Unauthorized"
        });
    }
};

const ADMIN_PERMISSION = 3;

exports.minimumPermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.session.permissionLevel);
        if (user_permission_level >= required_permission_level) {
            return next();
        } else {
            req.flash('msg_error', "Invalid Permission, because user permission_level = " + user_permission_level + ", required minimum permission_level = " + required_permission_level);
            res.redirect('/cms/login');
        }
    };
};

exports.PermissionLevelRequired = (required_permission_level) => {
    return (req, res, next) => {
        let user_permission_level = parseInt(req.session.permissionLevel);
        if (user_permission_level == required_permission_level) {
            return next();
        } else {
            req.flash('msg_error', "Invalid Permission, because user permission_level = " + user_permission_level + ", required minimum permission_level = " + required_permission_level);
            res.redirect('/cms/login');
        }
    };
};

exports.MultiPermissionLevelRequiredOrAdmin = (required_permission_level) => {
    return (req, res, next) => {
        var ADMIN_PERMISSION = 3;
        let user_permission_level = parseInt(req.session.permissionLevel);

        var values = required_permission_level.split(',');
        var length = values.length;
        var check = 0;

        for (var i = 0; i < length; i++) {
            if (user_permission_level == values[i]) {
                check = 1;
            }
        }

        if (check == 1) {
            return next();
        } else {
            if (user_permission_level == ADMIN_PERMISSION) {
                return next();
            } else {
                req.flash('msg_error', "Invalid Permission, because user permission_level = " + user_permission_level + ", required minimum permission_level = " + required_permission_level);
                res.redirect('/cms/login');
            }
        }
    };
};

exports.onlySameUserOrAdminCanDoThisAction = (req, res, next) => {
    let user_permission_level = parseInt(req.jwt.permissionLevel);
    let user_id = req.jwt.user_id;
    if (req.params.user_id == user_id || req.body.user_id == user_id) {
        return next();
    } else {
        if (user_permission_level >= ADMIN_PERMISSION) {
            return next();
        } else {
            return res.status(403).send({
                message: "Invalid Permission, Because only same User Or Admin can do this action"
            });
        }
    }

};

exports.sameUserCantDoThisAction = (req, res, next) => {
    let user_id = req.jwt.user_id;

    if (req.params.user_id !== user_id) {
        return next();
    } else {
        return res.status(400).send();
    }

};