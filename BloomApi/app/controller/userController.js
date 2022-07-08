
const User = require('../models/userModel');
const { encryptData, decryptData } = require("../../utils/validation");



exports.addUser = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("________________________________", param)

    if (req.body && !!param.phone_number && !!param.email) {
        User.addUser(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
        })
    }
    else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
}
exports.editUser = function (req, res) {
    var data = {};
    var param = { ...req.body, ...req.query };
    if (req.body &&
        //!!param.phone_number && !!param.email && !!param.PIN_code && 
        !!param.id && param.is_for) {
        User.editUser(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
        })
    }
    else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
}
exports.deleteUser = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.param && !!param.id) {
        User.deleteUser(param, function (err, response) {
            if (err) {
                console.log("************************");
                res.send(err);
            } else {
                res.json(response);
            }
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};
exports.getUser = function (req, res) {
    //var user_role = req.isAdmin;
    var data = {};
    id = req.id
    user_role = req.isAdmin
    var param = { ...req.query, id, user_role };
    console.log("_____userdata________________________________", param)
    //var param = req.query;
    // var param = { ...req.query, user_role: user_role };
    User.getUser(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getUserById = function (req, res) {
    var data = {};
    var param = req.query;
    if (req.param && !!param.id) {
        User.getUserById(param, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};

exports.userID = function (req, res) {
    var data = {};
    var param = req.query;
    User.userID(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};

exports.updateUserPassword = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    if (req.param && !!param.id && !!param.password && !!param.confPassword && !!param.newPassword) {
        User.updateUserPassword(param, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};
exports.startWork = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    if (req.param && !!param.user_id && !!param.contract_id) {
        User.startWork(param, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};
exports.endWork = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    if (req.param && !!param.id) {
        User.endWork(param, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};
exports.userWorkHistory = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    //  if (req.param && !!param.id) {
    User.userWorkHistory(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
    // } else {
    //     data['error'] = true;
    //     data['msg'] = 'All field required';
    //     data['body'] = [];
    //     res.json(data);
    // }
};
exports.userContractHistory = function (req, res) {
    var data = {};
    var param = req.query;
    console.log("param", param)
    if (req.param && !!param.id) {
        User.userContractHistory(param, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
};