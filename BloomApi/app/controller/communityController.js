const User = require('../models/communityModel');
const { encryptData, decryptData } = require("../../utils/validation");

exports.login = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.phone_no || !!param.email && !!param.password) {
        User.login(param, function (err, response) {
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

exports.register = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.community_name && !!param.community_address1 && !!param.community_phone_no && !!param.password) {
        User.register(param, function (err, response) {
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

exports.getcommunity = function (req, res) {
    var data = {};
    var param = req.query;
    User.getcommunity(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};
exports.getcommunityById = function (req, res) {
    var data = {};
    var param = req.query;
    if (req.param && !!param.id) {
        User.getcommunityById(param, function (err, response) {
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
exports.editCommunity = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.community_name && !!param.community_address1 && !!param.community_address2 && !!param.zipcode && !!param.city && !!param.community_phone_no && !!param.id) {
        User.editCommunity(param, function (err, response) {
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

exports.deleteCommunity = function (req, res) {
    var data = {};
    var params = req.body//JSON.parse(decryptData(req.body.enc))
    if (req.params && !!params.id) {
        User.deleteCommunity(params, function (err, response) {
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

}
exports.updatePrimaryContact = function (req, res) {
    var data = {};
    var param = req.body;
    //console.log("params***********", param)
    if (req.body && !!param.primary_contact_firstname && !!param.primary_contact_lastname && !!param.primary_contact_title && !!param.primary_contact_phone && !!param.id) {
        User.updatePrimaryContact(param, function (err, response) {
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
exports.updateSurveyCompliance = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.survey_compliance_name && !!param.survey_compliance_title && !!param.survey_compliance_phone && !!param.id) {
        User.updateSurveyCompliance(param, function (err, response) {
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
exports.updateManagementCompany = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.management_company_name && !!param.management_company_address1 && !!param.management_company_phone && !!param.id) {
        User.updateManagementCompany(param, function (err, response) {
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
exports.updateSingleCommunity = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.single_community && !!param.id) {
        User.updateSingleCommunity(param, function (err, response) {
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
exports.updateManagementId = function (req, res) {
    var data = {};
    var param = req.body;
    if (req.body && !!param.management_id && !!param.id) {
        User.managementId(param, function (err, response) {
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
exports.updateCommunityPassword = function (req, res) {
    var data = {};
    var param = req.body;
    console.log("param", param)
    if (req.param && !!param.id && !!param.oldpassword && !!param.confPassword && !!param.newPassword) {
        User.updateCommunityPassword(param, function (err, response) {
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

exports.communityID = function (req, res) {
    var data = {};
    var param = req.query;
    User.communityID(param, function (err, response) {
        if (err)
            res.send(err);
        res.json(response);
    });
};

exports.getCommunityShiftByID = function (req, res) {
    var data = {};
    var param = { ...req.query, ...req.params };
    if (req.param && !!param.user_id && !!param.for_cp) {
        User.getCpShifts(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
        })
    }
    else {
        data['error'] = true;
        data['msg'] = 'All fields required';
        data['body'] = [];
        res.json(data);
    }
}
exports.getCommunityShift = function (req, res) {
    var data = {};
    user_role = req.isAdmin
    var param = { ...req.query, ...req.params, user_role };
    if (req.param || !!req.query) {
        User.getCommunityShifts(param, function (err, response) {
            if (err) res.send(err);
            res.json(response);
        })
    }
    else {
        data['error'] = true;
        data['msg'] = 'All fields required';
        data['body'] = [];
        res.json(data);
    }
}   