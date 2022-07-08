const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const moment = require("moment");
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const res = require('express/lib/response');


var User = function (list) {
    this.name = list.name;
    this.email = list.email;

}


User.addUser = function (userData, result) {
    var data = {};
    var id = uuid()
    console.log('<<<>>>', userData);
    console.log('userData.isAdmin', userData.isAdmin);
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    checkUniqueUser(userData, function (callbackres, deletedUser) {
        console.log("<<<<<<<<<<callbackres>>>>>>>>>", callbackres)
        if (callbackres == false) {
            var insertData = {
                id,
                community_id: JSON.stringify(userData.community_id),
                agency_id: JSON.stringify(userData.agency_id),
                phone_number: userData.phone_number,
                first_name: userData.first_name,
                last_name: userData.last_name,
                DOB: userData.DOB,
                email: userData.email,
                PIN_code: userData.PIN_code,
                password: userData.password,

            }
            if (userData.isAdmin === '2') {
                insertData.isAdmin = '5'

            } else {
                insertData.isAdmin = '4'
            }
            sql.query('Insert into users Set ? ', [insertData], async (err, res) => {
                if (err) {
                    console.log("eroor......", err)
                    data['err'] = true;
                    data['msg'] = 'user cannot add';
                    data['body'] = err;
                    result(null, data);
                } else {
                    console.log("res22222......", res)
                    data['err'] = false;
                    data['msg'] = 'Add User Successfully';
                    data['body'] = [res];
                    result(null, data);
                }
            })
        } else {
            data['error'] = true;
            data['msg'] = 'Phone no already exist';
            data['body'] = [];
            result(data);
        }
    })
}

function checkUniqueUser(userdata, callback) {
    console.log(".................duplicate data", userdata);
    sql.query("SELECT * from users where phone_number=? and is_deleted='0'", [userdata.phone_number], function (err, res) {
        if (err) {
            console.log("error: ", err);
            // result(null, err);
            return callback(false, false);
        }
        else {

            console.log(">>>>>>>>>>>>>>>>>>>.duplicate user", res, res.length);
            if (res.length == 0) {
                return callback(false, false);
            } else {
                return callback(true, false);
            }
        }
    });
}

User.editUser = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData.is_for);
    let insertData = {};

    if (userData.is_for == 'agency') {
        console.log("Inside_______________________________________-----------")
        insertData = {
            phone_number: userData.phone_number,
            DOB: userData.DOB,
            email: userData.email,
            first_name: userData.first_name,
            last_name: userData.last_name,
            PIN_code: userData.PIN_code,
        }

    }
    else if (userData.is_for == 'superAdmin') {
        insertData = {
            phone_number: userData.phone_number,
            DOB: userData.DOB,
            email: userData.email,
            PIN_code: userData.PIN_code,
            community_id: JSON.stringify(userData.community_id),
            agency_id: JSON.stringify(userData.agency_id)
        }
    }
    console.log('InsertData_______________________________________', insertData)
    sql.query('UPDATE `users` SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['err'] = true;
            data['msg'] = 'user cannot register';
            data['body'] = err;
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Edit User Successfully';
            data['body'] = [res];
            result(null, data);
        }
    })
}

User.deleteUser = function (userData, result) {
    var data = {}

    sql.query("UPDATE `users` SET is_deleted='1' WHERE id=? ", [userData.id], (error, res) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Deleted User Successfully";
            data['body'] = [];
            result(null, data);
        }
    })
}


function agencies() {
    return new Promise((resolve, reject) => {
        sql.query(`select * from agencies`, (err, res) => {
            if (err) {
                reject({ err: true, data: [] })
            } else {
                resolve({ error: false, data: res })
            }
        })
    })
}
function communities() {
    return new Promise((resolve, reject) => {
        sql.query(`select * from community_portal`, (err, res) => {
            if (err) {
                reject({ err: true, data: [] })
            } else {
                resolve({ error: false, data: res })
            }
        })
    })
}
function users() {
    return new Promise((resolve, reject) => {
        sql.query(`select * from users where agency_id IS NOT NULL`, (err, res) => {
            if (err) {
                reject({ err: true, data: [] })
            } else {
                resolve({ error: false, data: res })
            }
        })
    })
}

User.getUser = function (userData, result) {
    var data = {}

    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.phone_number like '" + userData.searchStr + "%') or ( uu.first_name like '" + userData.searchStr + "%') or ( uu.last_name like '" + userData.searchStr + "%') or ( uu.PIN_code like '" + userData.searchStr + "%') or ( uu.email like '" + userData.searchStr + "%')) and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    console.log(',,,,,,,,,,searchStr', searchStr);
    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum)
    sql.query(`SELECT * FROM users as uu where ${searchStr} is_deleted='0' ORDER BY uu.created_at desc`, (error, resp1) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            sql.query(`SELECT uu.id,uu.first_name,uu.last_name,uu.phone_number,uu.community_id,uu.agency_id,uu.DOB,uu.PIN_code,uu.email,uu.updated_at,uu.created_at FROM users as uu 
            WHERE ${searchStr} uu.is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], async (error, res) => {
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
                        totalPages: Math.ceil(resp1.length == 0 ? 0 : resp1.length / limitNum),
                        pageNumber: pageNo
                    }

                    const allCommunities = await communities()
                    const allAgencies = await agencies()
                    //console.log("community data----------------------------",allCommunities)
                    //console.log("agency data----------------------------",allAgencies)
                    //console.log(allCommunities)
                    const finalResult = res.map(item => {
                        const foundedCommunitiesName = allCommunities.data.length > 0 && item.community_id ? allCommunities.data.filter(val => {
                            const commName = JSON.parse(item.community_id)
                            return commName.includes(val.id)
                        }) : []
                        const foundedAgenciesName = allAgencies.data.length > 0 && item.agency_id ? allAgencies.data.filter(val => {
                            const goodFors = JSON.parse(item.agency_id)
                            return goodFors.includes(val.id)
                        }) : []
                        return { ...item, community_id: foundedCommunitiesName, agency_id: foundedAgenciesName }

                    })
                    console.log("rsesult....", res)
                    data['error'] = false;
                    data['msg'] = "get all user";
                    data['pagination'] = page;
                    data['body'] = finalResult;
                    result(null, data);
                }
            })
        }
    })


}

User.getUserById = function (userData, result) {
    var data = {}
    let query = `SELECT ag.* FROM users as ag 
    WHERE ag.is_deleted='0'`
    if (userData.is_for == 'user') {
        query = `SELECT ag.* FROM users as ag 
        WHERE ag.is_deleted='0' and ag.id=?`
        console.log('______________________________inside user');
    }
    console.log(query)
    sql.query(query, [userData.id], async (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            let allUsers = res;
            if (userData.is_for == 'agency') {
                allUsers = allUsers.filter(item => {
                    const agencyUsers = item.agency_id ? JSON.parse(item.agency_id) : []
                    return agencyUsers.includes(userData.id);
                })
            }
            if (userData.is_for == 'community') {
                allUsers = allUsers.filter(item => {
                    const communityUsers = item.community_id ? JSON.parse(item.community_id) : []
                    return communityUsers.includes(userData.id);
                })
            }
            console
            data['error'] = false;
            data['msg'] = "get all user";
            data['body'] = allUsers;
            result(null, data);
        }
    })

}

User.AgencyUser = function (userData, result) {
    var data = {}
    sql.query(
        //     `SELECT ag.id,ag.community_id,ag.phone_number,ag.DOB,ag.PIN_code,ag.email,ag.created_at,ag.updated_at,cp.community_name,aa.agency_name FROM users as ag 
        // LEFT JOIN community_portal cp ON cp.id=ag.community_id
        // LEFT JOIN agencies aa ON aa.id=ag.agency_id WHERE ag.is_deleted='0'`
        //`SELECT * FROM users WHERE is_deleted='0' ORDER BY created_at `

        `SELECT ag.id,ag.agency_id,ag.phone_number,ag.DOB,ag.PIN_code,ag.email,ag.created_at,ag.updated_at,cp.community_name,aa.agency_name FROM users as ag 
    LEFT JOIN community_portal cp ON cp.id=ag.community_id
    LEFT JOIN agencies aa ON aa.id=ag.agency_id WHERE ag.is_deleted='0' AND ag.agency_id IS NOT NULL`
        , [userData.id], async (error, res) => {
            if (error) {
                console.log("errorrr", error)
                data['error'] = true;
                data['msg'] = error.code;
                data['body'] = [error];
                result(null, data);
            } else {

                //const allCommunities = await communities()
                //const allAgencies = await agencies()


                //console.log("community data----------------------------",allCommunities)
                //console.log("agency data----------------------------",allAgencies)
                //console.log(allCommunities)
                // const finalResult = res.map(item => {
                //     const foundedCommunitiesName = allCommunities.data.length > 0 && item.community_id ? allCommunities.data.filter(val => {
                //         const commName = JSON.parse(item.community_id)
                //         return commName.includes(val.id)
                //     }) : []
                //     const foundedAgenciesName = allAgencies.data.length > 0 && item.agency_id ? allAgencies.data.filter(val => {
                //         const goodFors = JSON.parse(item.agency_id)
                //         return goodFors.includes(val.id)
                //     }) : []
                //     return { ...item, community_id: foundedCommunitiesName, agency_id: foundedAgenciesName }

                // })

                //const users = await users()
                const foundedUsers = res.filter(val => {
                    const UName = JSON.parse(val.agency_id)
                    return UName.includes(userData.id)
                }).map(item => item.id);
                console.log("Founded users res......", foundedUsers);
                var uData = Object.assign({}, foundedUsers);
                console.log('_____________________________________________', uData)
                // let a = ''
                // for (let key in uData) {
                //     a = uData[key]
                //     //return uData[key]
                // }
                // console.log('IDS_____________________________________________',a)
                // sql.query("select * from users where id=? ", [uData.], (error, res) => {
                //     if (error) {
                //         data['error'] = true;
                //         data['msg'] = error.code;
                //         data['body'] = [];
                //         result(null, data);
                //     } else {
                //         data['error'] = false;
                //         data['msg'] = "Deleted User Successfully";
                //         data['body'] = [];
                //         result(null, data);
                //     }
                // })
                //console.log("GETUserBYID result::::::::....", res)
                data['error'] = false;
                data['msg'] = "get all user";
                data['body'] = res;
                result(null, data);
            }
        })

}



User.userID = function (userData, result) {
    var data = {}
    sql.query(`SELECT id,email FROM users WHERE is_deleted = '0'`, (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "Get userID";
            data['body'] = res;
            result(null, data);
        }
    })

}

User.updateUserPassword = function (userData, result) {
    var data = {}
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    sql.query(`SELECT id,password FROM users WHERE id=?`, [userData.id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            if (userData.newPassword == userData.confPassword) {
                sql.query(`UPDATE users SET password=? WHERE id=?`, [userData.password, userData.id], (error, res1) => {
                    if (error) {
                        console.log("errorrr", error)
                        data['error'] = true;
                        data['msg'] = error.code;
                        data['body'] = [error];
                        result(null, data);
                    } else {
                        data['error'] = false;
                        data['msg'] = "password updated ";
                        data['body'] = res1;
                        result(null, data);
                    }

                })
            } else {
                data['error'] = false;
                data['msg'] = "plz chk passwrd";
                data['body'] = [];
                result(null, data);
            }
        }
    })
}
User.startWork = function (userData, result) {
    var data = {};
    var id = uuid()
    var insertData = {
        id,
        contract_id: userData.contract_id,
        user_id: userData.user_id,
        start_time: moment().utc().unix()
    }

    sql.query('Insert into user_work_tracking Set ?', [insertData], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['err'] = true;
            data['msg'] = 'cannot added';
            data['body'] = err;
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'time added Successfully';
            data['body'] = { id: id };
            result(null, data);
        }
    })

}
User.endWork = function (userData, result) {
    var data = {};
    sql.query('SELECT start_time FROM user_work_tracking WHERE id=?', [userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['err'] = true;
            data['msg'] = 'cannot added';
            data['body'] = err;
            result(null, data);
        } else {
            console.log("res......", res)
            let end_time = moment().utc().unix();
            var startTime = moment.unix(res[0].start_time).utc()
            var end = moment.unix(end_time).utc()
            var duration = moment.duration(end.diff(startTime));
            var hours = duration.asHours();
            // var insertData = {

            //     hours,
            //     end_time
            // };
            sql.query(`UPDATE user_work_tracking SET hours=?,end_time=? WHERE id=?`, [hours, end_time, userData.id], (error, res1) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    data['error'] = false;
                    data['msg'] = "updated ";
                    data['body'] = res1;
                    result(null, data);
                }

            })
        }
    })

}
User.userWorkHistory = function (userData, result) {
    var data = {};
    sql.query('SELECT * FROM user_work_tracking ', async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['err'] = true;
            data['msg'] = '';
            data['body'] = err;
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'get Successfully';
            data['body'] = [res];
            result(null, data);
        }
    })

}
User.userContractHistory = function (userData, result) {
    var data = {};
    sql.query('SELECT uu.id,uu.contract_id,uu.start_time,uu.end_time,uu.hours FROM user_work_tracking as uu LEFT JOIN contracts cc ON cc.id=uu.contract_id where uu.id=?', [userData.id], (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['err'] = true;
            data['msg'] = '';
            data['body'] = err;
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'get Successfully';
            data['body'] = [res];
            result(null, data);
        }
    })

}
module.exports = User;
