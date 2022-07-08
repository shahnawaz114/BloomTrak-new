var jwt = require('jsonwebtoken');
var config = require('./config');
var Helper = function (userData) {
    //console.log(userData);
    this.username = userData.username;
    this.created_at = new Date();
};

Helper.verifyToken = function (req, res, next) {
    console.log("verifyToken Started Here");
    var data = {};
    if (req.url == '/login' || req.url == '/loginManagement' || req.url == '/register' || req.url == '/countryList') {
        console.log('next');
        req.userId = '';
        next();
    } else {
        var token = req.headers['authorization'];
        if (!token) {
            return res.status(403).send({ auth: false, message: 'No token provided.', 'body': [] });
        } else {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err)
                    return res.status(500).send({ auth: false, message: 'Failed to authenticate token.', 'body': [] });
                req.id = decoded.userID;
                req.isAdmin = decoded.user_role;
                console.log("decodeDataaa", decoded)
                next();
            });
        }
    }
}

Helper.adminAuthenticator = (req, res, next) => {
    console.log(req.isAdmin, ".............", req.id)
    if (req.isAdmin == 6) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.communityAuthenticator = (req, res, next) => {
    if (req.isAdmin == 1) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}
Helper.managementAuthenticator = (req, res, next) => {
    if (req.isAdmin == 3) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.agenciesAuthenticator = (req, res, next) => {
    if (req.isAdmin == 2) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.employeeAuthenticator = (req, res, next) => {
    if (req.isAdmin == 4) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.communityAdminAuthenticator = (req, res, next) => {
    if (req.isAdmin == 1 || req.isAdmin == 6) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.agenciesAdminAuthenticator = (req, res, next) => {
    if (req.isAdmin == 2 || req.isAdmin == 3) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}
Helper.ManagementAdminAuthenticator = (req, res, next) => {
    if (req.isAdmin == 6 || req.isAdmin == 3) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}

Helper.employeeAdminAuthenticator = (req, res, next) => {
    if (req.isAdmin == 4 || req.isAdmin == 3) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}
Helper.communityAdminAgencyAuthenticator = (req, res, next) => {
    console.log("____________________is admin", req.isAdmin)
    if (req.isAdmin == 1 || req.isAdmin == 3 || req.isAdmin == 2 || req.isAdmin == 4 || req.isAdmin == 6) {
        next();
    } else {
        return res.status(500).send({ auth: false, message: 'Your not authorized for this request', 'body': [] });
    }
}
module.exports = Helper;
