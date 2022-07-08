const User = require('../models/adminModel');
const { encryptData, decryptData } = require("../../utils/validation");

exports.SuperAdmLogin = function (req, res) {
    var data = {};
    var params = req.body;
    // console.log("params***********", params)
    if (params.user_role == 6) {
        User.SuperAdmLogin(params, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    } else {
        User.login(params, function (err, response) {
            if (err)
                res.send(err);
            res.json(response);
        });
    }

};
exports.getCommunityShift = function (req, res) {
    var data = {};
    var params = { ...req.query, ...req.params };
    // console.log("params***********", params)
    User.getCommunityShift(params, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });

};
exports.getOpenCommunityShift = function (req, res) {
    var data = {};
    var params = { ...req.query, ...req.params };
    // console.log("params***********", params)
    User.getOpenCommunityShift(params, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });

};

exports.UpdateApproval = function (req, res) {
    var data = {};
    let user_role= req.isAdmin
    var param = req.body
    if (req.body && !!param.id) {
        User.UpdateApproval(param, function (err, response)  {
            if (err) {
                 //console.log("************************");
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