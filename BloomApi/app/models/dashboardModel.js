const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const Common = require("./common");

var User = function (list) {
    this.name = list.name;
    this.email = list.email;

}


User.CMdashboardStatus = function (userData, result) {
    console.log('__________inside mdel')
    var data = {};
    let sql1 = '';
    let role = '';
    console.log("userData.....", userData);

    sql1 = `SELECT (SELECT COUNT(*) FROM shift WHERE is_deleted='0' and community_id = '${userData.id}') AS SHIFT,(SELECT COUNT(*) FROM agencies WHERE is_deleted='0' and community_id = '${userData.id}') AS Agencies`
    role = "Community"


    sql.query(sql1, async function (error, response1) {
        console.log("error.............", error)
        if (error) {
            data['err'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            let sql2 = `SELECT ag.* FROM users as ag WHERE ag.is_deleted='0'`
            sql.query(sql2, [userData.isAdmin], async function (error, response) {
                console.log("error.............", error)
                if (error) {
                    data['err'] = true;
                    data['msg'] = error.code;
                    data['body'] = [];
                    result(null, data);
                } else {
                    let allUsers
                    allUsers = response.filter(item => {
                        const communityUsers = item.community_id ? item.community_id : []
                        //console.log(communityUsers)
                        return communityUsers.includes(userData.id);
                    })
                    console.log(allUsers.length)

                    console.log(response1)
                    response1[0].role = role

                    var finalResult = {
                        SHIFT: response1[0].SHIFT,
                        Agencies: response1[0].Agencies,
                        role: response1[0].role,
                        Employees: allUsers.length,
                    }

                    data['err'] = false;
                    data['msg'] = "fetch successfully";
                    data['body'] = finalResult;
                    result(null, data);
                }

            })
        }
    })
}

// User.dashboardStatus = function (userData, result) {

//     var data = {};
//     let sql1 = '';
//     if (userData.isAdmin === '6') {
//         sql1 = "SELECT (SELECT COUNT(*) FROM community_portal WHERE is_deleted='0') AS Community_portal , (SELECT COUNT(*) FROM agencies WHERE is_deleted='0') AS Agencies,(SELECT COUNT(*) FROM users WHERE is_deleted='0') AS Employees,(SELECT COUNT(*) FROM project WHERE is_deleted='0') AS Project,(SELECT COUNT(*) FROM contracts WHERE is_deleted='0') AS Contracts";
//     }
//     else if (userData.isAdmin === '1') {
//         sql1 = `SELECT (SELECT COUNT(*) FROM project WHERE is_deleted='0' and community_id = '${userData.id}' ) AS Project,(SELECT COUNT(*) FROM agencies WHERE is_deleted='0' and community_id = '${userData.id}') AS Agencies,(SELECT COUNT(*) FROM users WHERE is_deleted='0' and community_id = '${userData.id}') AS Employees,(SELECT COUNT(*) FROM contracts WHERE is_deleted='0' and community_id = '${userData.id}') AS Contracts`;
//     }
//     else if (userData.isAdmin === '2') {
//         sql1 = `SELECT(SELECT COUNT(*) FROM contracts WHERE is_deleted='0' and agency_id = '${userData.id}' ) AS Contracts,(SELECT COUNT(*) FROM users WHERE is_deleted='0' and agency_id = '${userData.id}') AS Employees`;
//     }
//     else if (userData.isAdmin === '4') {
//         sql1 = `SELECT(SELECT COUNT(*) FROM contracts WHERE status='active' and user_id = '${userData.id}') AS ActiveContracts,(SELECT COUNT(*) FROM contracts WHERE is_deleted='0') AS AllContracts,(SELECT COUNT(*) FROM contracts WHERE status='completed' and user_id = '${userData.id}') AS Contracts`;
//     }

//     sql.query(sql1, [userData.isAdmin], function (error, response) {
//         console.log("error.............", error)
//         if (error) {
//             data['err'] = true;
//             data['msg'] = error.code;
//             data['body'] = [];
//             result(null, data);
//         } else {
//             console.log("response...........", response)
//             data['err'] = false;
//             data['msg'] = "data fetch successfully";
//             data['body'] = response;
//             result(null, data);

//         }
//     })
// }


User.dashboardStatus = function (userData, result) {

    var data = {};
    let sql1 = '';
    let role = 'User';
    console.log("userData.....", userData);
    if (userData.isAdmin === '6') {
        sql1 = "SELECT (SELECT COUNT(*) FROM community_portal WHERE is_deleted='0') AS Community_portal , (SELECT COUNT(*) FROM agencies WHERE is_deleted='0') AS Agencies,(SELECT COUNT(*) FROM users WHERE is_deleted='0' and isAdmin = '4') AS Employees,(SELECT COUNT(*) FROM shift WHERE is_deleted='0') AS shift ";
        role = "Admin"
    }
    else if (userData.isAdmin === '1') {
        sql1 = `SELECT (SELECT COUNT(*) FROM shift WHERE is_deleted='0' and community_id = '${userData.id}') AS SHIFT,(SELECT COUNT(*) FROM agencies WHERE is_deleted='0' and community_id = '${userData.id}') AS Agencies,(SELECT COUNT(*) FROM users WHERE is_deleted='0' and community_id = '${userData.id}') AS Employees`;
        role = "Community"
    }
    else if (userData.isAdmin === '2') {
        sql1 = `SELECT(SELECT COUNT(*) FROM shift WHERE is_deleted='0') AS shift`;
        role = "Agency"
    }
    else if (userData.isAdmin === '4') {
        sql1 = `SELECT(SELECT COUNT(*) FROM users) AS Users,(SELECT COUNT(*) FROM shift WHERE is_deleted='0' ) AS SHIFT`;
        role = "User"
    }
    else if (userData.isAdmin === '3') {
        sql1 = `SELECT (SELECT COUNT(*) FROM community_portal WHERE is_deleted='0') AS Community_portal , (SELECT COUNT(*) FROM agencies WHERE is_deleted='0') AS Agencies,(SELECT COUNT(*) FROM users WHERE is_deleted='0' and isAdmin = '4') AS Employees,(SELECT COUNT(*) FROM shift WHERE is_deleted='0') AS shift `;
        role = "Management"
    }

    console.log("....sql1", sql1)

    sql.query(sql1, [userData.isAdmin], async function (error, response) {
        console.log("error.............", error)
        if (error) {
            data['err'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            console.log("response...........", response)
            response[0].role = role
            if (userData.isAdmin === '2') {
                console.log("....here1")
                const agencyUsers = await Common.getAgencyUsers(userData);
                response[0].Employees = agencyUsers.data.length;
            }

            console.log(".....response", response);

            data['err'] = false;
            data['msg'] = "data fetch successfully";
            data['body'] = response;
            result(null, data);

        }
    })
}
module.exports = User;