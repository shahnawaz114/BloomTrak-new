const User = require('../models/adminModel');
const { encryptData, decryptData } = require("../../utils/validation");

exports.admLogin = function (req, res) {
    var data = {};
    var params = req.body;
    // console.log("params***********", params)
    if (params.user_role == 3) {
        User.admLogin(params, function (err, response) {
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