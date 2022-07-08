const Management = require('../models/ManagementModel');
const { encryptData, decryptData } = require("../../utils/validation");


exports.addManagement = function (req, res) {
    var data = {};
    var param = req.body;
    param.isAdmin = req.isAdmin
    if (req.body && !!param.mg_name && !!param.mg_email && !!param.password) {
        Management.addManagement(param, function (err, response) {
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
exports.loginManagement = function (req, res) {
    var data = {};
    var params = req.body;
    // console.log("params***********", params)
    //if (params.user_role == 3) {
    Management.loginManagement(params, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
    // }
    // else {
    //     Management.login(params, function (err, response) {
    //         if (err)
    //             res.send(err);
    //         res.json(response);
    //     });
    // }

};
exports.getManagement = function (req, res) {
    var data = {};
    var param = req.query;
    Management.getManagement(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getMNGTUser = function (req, res) {
    //var user_role = req.isAdmin;
    var data = {};
    id = req.id
    user_role = req.isAdmin
    var param = { ...req.query, id, user_role };
    console.log("_____userdata________________________________", param)
    //var param = req.query;
    // var param = { ...req.query, user_role: user_role };
    Management.getMNGTUser(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.deleteManagenment = function (req, res) {
    var data = {};
    var param = req.body;
    //console.log(req.params.id)
    if (req.body && !!param.id) {
        Management.deleteManagenment(param, function (err, response) {
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
exports.getManagementById = function (req, res) {
    var data = {};
    var param = req.query;
    if (req.param && !!param.id) {
        Management.getManagementById(param, function (err, response) {
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


exports.getManagementNames = function (req, res) {
    //var data = {};
    //var param = req.query;
    Management.getManagementNames(function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};

exports.editManagementByID = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.mg_name && !!param.mg_phone && !!param.contact_person && !!param.contact_person_firstname && !!param.contact_email && !!param.id) {
        Management.editManagement(param, function (err, response) {
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

exports.getMNMGcommunity = function (req, res) {
    var data = {};
    user_role = req.isAdmin
    user_id = req.id
    var param = { ...req.query, user_role, user_id };
    console.log("userData controller_____________________________________________________________________________", param)
    Management.getMGcommunity(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};