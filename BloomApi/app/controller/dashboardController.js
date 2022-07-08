const User = require('../models/dashboardModel');
const { encryptData, decryptData } = require("../../utils/validation");
const { response } = require('express');


exports.dashboardStatus = function (req, res) {
    var param = req.body;
    var data = {};
    param.isAdmin = req.isAdmin
    param.id = req.id;
    console.log("><><><><>", param.id)
    if (req.body && !!param.isAdmin) {
        User.dashboardStatus(param, function (error, response) {
            if (error) res.send(error);
            res.json(response);
        })
    } else {
        data['error'] = true;
        data['msg'] = 'Required all fields';
        data['body'] = response;
        res.json(data);
    }
}
exports.CMdashboardStatus = function (req, res) {
    console.log('__________inside controller')

    var param = req.body;
    var data = {};
    param.isAdmin = req.isAdmin
    param.id = req.id;
    console.log("><><><><>", param.id)
    if (req.body && !!param.isAdmin) {
        User.CMdashboardStatus(param, function (error, response) {
            if (error) res.send(error);
            res.json(response);
        })
    } else {
        data['error'] = true;
        data['msg'] = 'Required all fields';
        data['body'] = response;
        res.json(data);
    }
}