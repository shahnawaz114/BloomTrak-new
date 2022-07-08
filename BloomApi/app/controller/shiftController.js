const User = require('../models/shiftModel');
const { encryptData, decryptData } = require("../../utils/validation");

exports.addshift = function (req, res) {
    var data = {};
    var param = req.body;
    //if (req.body && !!param.title && !!param.description) {
    User.addshift(param, function (err, response) {
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
exports.editshift = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("front>>>>>>>>>>>>>>", param)
    // if (req.body && !!param.title && !!param.description && !!param.id) {
    User.editshift(param, function (err, response) {
        if (err) res.send(err);
        res.json(response);
    })
    // }
    // else {
    //     data['error'] = true;
    //     data['msg'] = 'All field required';
    //     data['body'] = [];
    //     res.json(data);
    // }
}
exports.deleteshift = function (req, res) {
    var data = {};
    var param = req.body;
    //console.log(req.params.id)
    if (req.body && !!param.id) {
        User.deleteshift(param, function (err, response) {
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
exports.getshift = function (req, res) {
    var data = {};
    var param = req.query;
    User.getshift(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getshiftById = function (req, res) {
    var data = {};
    var param = req.query;
    if (req.param && !!param.id) {
        User.getshiftById(param, function (err, response) {
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

// exports.applyShiftById = function (req, res) {
//     var data = {};
//     var user_role = req.isAdmin;
//     var param = { ...req.body, user_role };
//     if (req.param && !!param.user_id) {
//         User.applyShift(param, function (err, response) {
//             if (err)
//                 res.send(err);
//             res.json(response);
//         });
//     } else {
//         data['error'] = true;
//         data['msg'] = 'All field required';
//         data['body'] = [];
//         res.json(data);
//     }
// };


exports.applyShiftById = function (req, res) {
    var data = {};
    var user_role = req.isAdmin;
    var param = { ...req.body, user_role };
    if (req.param && !!param.user_id) {
        User.applyShift(param, function (err, response) {
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


exports.appliedShiftById = function (req, res) {
    var data = {}
    var param = req.body;
    if (req.param && !!param.shift_id) {
        User.appliedShift(param, function (err, response) {
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

exports.startShift = function (req, res) {
    var data = {}
    var param = req.body;
    if (req.param && req.body.id) {
        User.startShift(param, function (err, response) {
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

// exports.projectID = function (req, res) {
//     var data = {};
//     var param = req.query;
//     User.projectID(param, function (err, response) {
//         if (err)
//             res.send(err);
//         res.json(response);
//     });
// };
