const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const res = require('express/lib/response');

var User = function (list) {
    this.name = list.name;
    this.email = list.email;

}

User.addContract = function (userData, result) {
    var data = {}
    var id = uuid()
    sql.query("INSERT INTO `contracts`(`id`,`project_id`,`community_id`, `agency_id`, `user_id`, `budget`, `estimate`,`status`) VALUES (?,?,?,?,?,?,?,?)", [id, userData.project_id, userData.community_id, userData.agency_id, userData.user_id, userData.budget, userData.estimate, userData.status], (error, res1) => {
        if (error) {
            console.log("errorr......", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: id,
            }
            data['error'] = false;
            data['msg'] = "Contract Added Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })
}
User.getContract = function (userData, result) {
    var data = {}
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "(  uu.project_id like '" + userData.searchStr + "%') or ( cp.community_name like '" + userData.searchStr + "%') or ( ag.agency_name like '" + userData.searchStr + "%') or ( us.email like '" + userData.searchStr + "%') and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    console.log(',,,,,,,,,,searchStr', searchStr);
    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum)
    var communityCondition = ''
    var agencyCondition = ''
    if (userData.isAdmin == 1) {
        var communityCondition = `community_id='${userData.id}' and`
    }
    if (userData.isAdmin == 2) {
        var agencyCondition = `community_id='${userData.id}' and`
    }

    sql.query(`SELECT * FROM contracts as uu where ${searchStr} is_deleted='0' ORDER BY uu.created_at desc`, (error, resp1) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            sql.query(`SELECT uu.id,uu.project_id,uu.community_id,uu.agency_id,uu.assigned_to_agency,uu.assigned_to_user,uu.user_id,uu.budget,us.email,uu.estimate,us.email,cp.community_name,ag.agency_name,pj.title as project_name,uu.status,uu.created_at,uu.updated_at FROM contracts as uu
            LEFT JOIN community_portal cp ON cp.id=uu.community_id
            LEFT JOIN agencies ag ON ag.id=uu.agency_id
            LEFT JOIN project pj ON pj.id =uu.project_id
              LEFT JOIN users us ON us.id =uu.user_id WHERE ${searchStr} ${communityCondition} ${agencyCondition} uu.is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], (error, res) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    var page = {
                        size: limitNum,
                        totalElements: resp1.length,
                        totalPages: Math.ceil(res.length == 0 ? 0 : res.length / limitNum),
                        pageNumber: pageNo
                    }
                    console.log("rsesult....", res)
                    data['error'] = false;
                    data['msg'] = "Get Project";
                    data['pagination'] = page;
                    data['body'] = res;
                    result(null, data);
                }
            })
        }
    })


}
User.getContractById = function (userData, result) {
    var data = {}
    sql.query(`SELECT ag.id,ag.project_id,ag.community_id,ag.assigned_to_agency,ag.assigned_to_user,ag.agency_id,ag.user_id,ag.budget,ag.estimate,pj.title as project_name,aa.agency_name,uu.email,ag.status,ag.created_at,ag.updated_at,cp.community_name FROM contracts as ag 
    LEFT JOIN community_portal cp ON cp.id=ag.community_id
    LEFT JOIN agencies aa ON aa.id=ag.agency_id
    LEFT JOIN project pj ON pj.id=ag.project_id
    LEFT JOIN users uu ON uu.id=ag.user_id WHERE ag.is_deleted='0' and ag.id =?`, [userData.id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "get all project";
            data['body'] = res;
            result(null, data);
        }
    })

}
User.assignContract = function (userData, result) {
    var data = {};

    var insertData = {
        assigned_to_agency: userData.assigned_to_agency,
        assigned_to_user: userData.assigned_to_user
    }

    sql.query("UPDATE `contracts` SET ? where id=? ", [insertData, userData.id], function (error, res) {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log('responseeee', res)
            data['error'] = false;
            data['msg'] = 'Contract Assigned Successfully';
            data['body'] = [res];
            result(null, data);
        }
    })
}
User.getAssignContract = function (userData, result) {
    var data = {};
    sql.query('SELECT user_id,assigned_to_agency, assigned_to_user FROM `contracts` WHERE `user_id` = ?', [userData.user_id], function (error, res) {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            if (res.length == 0) {
                data['error'] = true;
                data['msg'] = 'No user Id found';
                data['body'] = [];
                return result(null, data);
            }
            data['error'] = false;
            data['msg'] = 'Assigned Contract Fetched Successfully';
            data['body'] = res;
            result(null, data);
        }
    })

}
module.exports = User;