const User = require('../models/contractModel');
const { encryptData, decryptData } = require("../../utils/validation");

exports.addContract = function (req, res) {
    var data = {};
    var param = req.body;
    // if (req.body && !!param.project_id && !!param.description && !!param.community_id) {
    User.addContract(param, function (err, response) {
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
exports.getContract = function (req, res) {
    var data = {};
    var param = req.query;
    param.isAdmin = req.isAdmin;
    param.id = req.id;
    console.log("id..........", param.id)
    User.getContract(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getContractById = function (req, res) {
    var data = {};
    var param = req.query;
    if (req.param && !!param.id) {
        User.getContractById(param, function (err, response) {
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
exports.assignContract = function (req, res) {
    var data = {};
    var param = req.body;

    if (req.param && !!param.id) {
        User.assignContract(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
        })
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
}

exports.getAssignContract = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.param && !!param.user_id) {
        User.getAssignContract(param, function (err, response) {
            if (err) res.send(err)
            res.json(response);
        })
    } else {
        data['error'] = true;
        data['msg'] = 'All field required';
        data['body'] = [];
        res.json(data);
    }
}