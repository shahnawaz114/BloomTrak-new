const User = require('../models/agenciesModel');
const { encryptData, decryptData } = require("../../utils/validation");


exports.addAgencies = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.agency_name && !!param.agency_phone && !!param.agency_email) {
        User.addAgencies(param, function (err, response) {
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
exports.editAgencies = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.agency_name && !!param.agency_phone && !!param.agency_email && !!param.id) {
        User.editAgencies(param, function (err, response) {
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
exports.deleteAgencies = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.param && !!param.id) {
        User.deleteAgencies(param, function (err, response) {
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
exports.getAgencies = function (req, res) {
    var data = {};
    var param = req.query;
    param.id = req.id;
    param.isAdmin = req.isAdmin;
    User.getAgencies(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getAgenciesByID = function (req, res) {
    var data = {};
    var param = req.query;
    param.isAdmin = req.isAdmin;
    if (req.param && !!param.id) {
        User.getAgenciesByID(param, function (err, response) {
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

exports.updateAgenciesPassword = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    if (req.param && !!param.id && !!param.password && !!param.confPassword && !!param.newPassword) {
        User.updateAgenciesPassword(param, function (err, response) {
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

exports.agenciesID = function (req, res) {
    var data = {};
    var param = req.query;
    User.agenciesID(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};

exports.UpdateAgencyByID = function (req, res) {
    var data = {};
    var param = req.body
    if (req.body && !!param.id) {
        User.UpdateAgencyByID(param, function (err, response)  {
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

exports.sms = function (req, res) {
    var data = {};
    var params = req.body
    console.log("params***********", params)

    User.sms(params, function (err, response) {
        if (err) {
            res.send(err);
        } else {
            res.json(response);
        }
    })
}

exports.verifyOtp = function (req, res) {
    var data = {};
    var param = req.body
    console.log("params***********", param)
    if (req.body && !!param.id) {
        User.VerifyOtp(param, function (err, response) {
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
