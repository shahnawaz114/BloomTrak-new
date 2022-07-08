const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const res = require('express/lib/response');

var Management = function (list) {
    this.name = list.name;
    this.email = list.email;

}

Management.addManagement = function (userData, result) {
    var data = {};
    var id = uuid()
    console.log('<<<>>>', userData);
    //console.log('userData.isAdmin', userData.isAdmin);
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    checkUniqueUser(userData, function (callbackres, deletedUser) {
        console.log("<<<<<<<<<<callbackres>>>>>>>>>", callbackres)
        if (callbackres == false) {
            var insertData = {
                id,
                mg_name: userData.mg_name,
                password: userData.password,
                mg_phone: userData.mg_phone,
                mg_email: userData.mg_email,
                mg_address1: userData.mg_address1,
                mg_address2: userData.mg_address2,
                mg_address3: userData.mg_address3,
                city: userData.city,
                state: userData.state,
                zipcode: userData.zipcode,
                contact_person: userData.contact_person,
                contact_person_firstname: userData.contact_person_firstname,
                contact_person_lastname: userData.contact_person_lastname,
                contact_person_title: userData.contact_person_title,
                website: userData.website,
                contact_email: userData.contact_email,
                approval: userData.approval,
                isAdmin: userData.isAdmin

            }
            sql.query('Insert into management Set ? and isAdmin=?', [insertData, '3'], async (err, res) => {
                if (err) {
                    console.log("eroor......", err)
                    data['err'] = true;
                    data['msg'] = '';
                    data['body'] = err;
                    result(null, data);
                } else {
                    if (userData.for_community && userData.for_community == '1') {
                        sql.query("UPDATE `community_portal` SET management_id=? WHERE id=? ", [id, userData.id], (error, res) => {
                            if (error) {
                                data['error'] = true;
                                data['msg'] = error.code;
                                data['body'] = [];
                                result(null, data);
                            } else {
                                console.log("res......", res)
                                data['err'] = false;
                                data['msg'] = 'Management Co Added';
                                data['body'] = [res];
                                result(null, data);
                            }
                        })
                    } else {
                        console.log("res......", res)
                        data['err'] = false;
                        data['msg'] = 'Management Co. Added ';
                        data['body'] = [res];
                        result(null, data);
                    }

                }
            })
        } else {
            data['error'] = true;
            data['msg'] = 'email already exist';
            data['body'] = [];
            result(data);
        }
    })
}
function checkUniqueUser(userdata, callback) {
    console.log(".................duplicate data", userdata);
    sql.query("SELECT * from management where mg_email=? and is_deleted='0'", [userdata.mg_email], function (err, res) {
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

Management.loginManagement = function (userData, result) {
    var data = {};
    var lang = 'en';
    let query = `Select id as _id,mg_email,
	password as hash_key
	from management as us where us.mg_email =?`;
    sql.query(query, [userData.email], function (err, res) {
        if (err) {
            console.log(err);
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [];
            result(null, data);
        }
        else {
            console.log("res*****", res);
            if (res.length != 0) {
                var hash = res[0].hash_key;
                var mg_name = res[0].mg_name;
                var match = bcrypt.compareSync(userData.password, hash);
                console.log(match)
                // console.log("match", match, param)
                if (match) {
                    let token = jwt.sign({ mg_name: mg_name, userID: res[0]._id, user_role: "3" },
                        config.secret,
                        {
                            expiresIn: '1 days' // expires in 30 Days
                        }
                    );

                    const finalResult = {
                        _id: res[0]._id,
                        email: res[0].mg_email,
                        username: res[0].mg_name,
                        token: token,
                        user_role: "3"
                    }
                    data['error'] = false;
                    var msg = "Success";
                    data['msg'] = msg;
                    data['body'] = finalResult;
                    result(null, data);

                } else {
                    data['error'] = true;
                    var msg = "Invalid password";
                    data['msg'] = msg;
                    data['body'] = [];
                    result(null, data);
                }
            }
            else {
                data['error'] = true;
                data['msg'] = "Invalid Email/Username Please try again";
                data['body'] = [];
                result(null, data);
            }
        }
    });
}
// function management() {
//     return new Promise((resolve, reject) => {
//         sql.query(`select * from management`, (err, res) => {
//             if (err) {
//                 reject({ err: true, data: [] })
//             } else {
//                 resolve({ error: false, data: res })
//             }
//         })
//     })
// }

function mgCommunities(id) {
    return new Promise((resolve, reject) => {
        console.log('___________________________________mg id in mg communities', id)
        sql.query(`SELECT cp.id,cp.community_name FROM community_portal as cp LEFT JOIN management as mm ON mm.id = cp.management_id WHERE mm.id = ?`, [id], (err, res) => {
            if (err) {
                reject({ err: true, data: [] })
            } else {
                console.log("____________________________cm ids in  mg communities", res)
                resolve({ error: false, data: res })
            }
        })
    })
}



Management.getMNGTUser = function (userData, result) {
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
            WHERE ${searchStr} uu.is_deleted = '0' ORDER BY uu.created_at desc`, async (error, res) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    var page = null
                    const allMGcommunities = await mgCommunities(userData.id)
                    console.log("___________________________allCommunities in main", allMGcommunities)
                    console.log('------------------------------------res main-------------', res)
                    console.log("___________________________is_for management")
                    const finalResult = res.map(item => {
                        const foundedUsers = allMGcommunities.data.length > 0 && item.community_id ? allMGcommunities.data.filter(val => {
                            const goodFors = item.community_id
                            console.log("__________________________cm ids ", val.id)
                            console.log("____________gooods for____________________________", goodFors)
                            return goodFors.includes(val.id)
                        }) : []
                        if (foundedUsers.length > 0) {
                            return { ...item, community: foundedUsers };
                        }
                        console.log('________________________founded length', foundedUsers.length)

                    }).filter(val => val != null)
                    console.log("rsesult....", res)
                    data['error'] = false;
                    data['msg'] = "get all user";
                    //data['pagination'] = page;
                    data['body'] = finalResult;
                    result(null, data);
                }
            })
        }
    })
}

Management.getManagement = function (userData, result) {
    var data = {}
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.mg_name like '" + userData.searchStr + "%') or ( uu.mg_title like '" + userData.searchStr + "%') or ( uu.mg_phone like '" + userData.searchStr + "%') or ( uu.mg_email like '" + userData.searchStr + "%')) and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }

    sql.query(`SELECT * FROM management as uu WHERE ${searchStr} is_deleted = '0' ORDER BY uu.created_at desc`, (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            console.log(',,,,,,,,,,searchStr', searchStr);
            var pageNo = userData.pageNo
            var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
            var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
            console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum, pageNo)

            sql.query(`SELECT id,mg_name,mg_phone,mg_email,mg_address1,mg_address2,mg_address3,contact_person,contact_person_firstname,contact_person_lastname,website,contact_email FROM management as uu WHERE ${searchStr} is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], (error, res1) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    var page = {
                        size: limitNum,
                        totalElements: res.length,
                        totalPages: Math.ceil(res.length == 0 ? 0 : res.length / limitNum),
                        pageNumber: pageNo
                    }
                    // console.log("rsesult....", page)
                    // console.log("rsesult....", res1)
                    data['error'] = false;
                    data['msg'] = "Get Management";
                    data['pagination'] = page;
                    data['body'] = res1;
                    console.log("data.......", data)
                    result(null, data);
                }
            })
        }
    })


}

Management.deleteManagenment = function (userData, result) {
    var data = {}
    sql.query("UPDATE `management` SET is_deleted='1' WHERE id=? ", [userData.id], (error, res) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Deleted shift Successfully";
            data['body'] = [];
            result(null, data);
        }
    })
}

Management.getManagementById = function (userData, result) {
    var data = {}
    sql.query(`SELECT * FROM management WHERE id=? and is_deleted = '0'`, [userData.id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "get all community";
            data['body'] = res;
            result(null, data);
        }
    })

}

Management.getManagementNames = function (result) {
    var data = {}
    sql.query("select id,mg_name from management WHERE is_deleted='0' ", (error, res) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            console.log("all names___________________________", res)
            data['error'] = false;
            data['msg'] = "All Management with Names";
            data['body'] = res;
            result(null, data);
        }
    })
}


Management.editManagement = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData);
    var insertData = {
        mg_name: userData.mg_name,
        mg_phone: userData.mg_phone,
        mg_address1: userData.mg_address1,
        mg_address2: userData.mg_address2,
        mg_address3: userData.mg_address3,
        city: userData.city,
        state: userData.state,
        zipcode: userData.zipcode,
        contact_person: userData.contact_person,
        contact_person_firstname: userData.contact_person_firstname,
        contact_person_lastname: userData.contact_person_lastname,
        contact_person_title: userData.contact_person_title,
        website: userData.website,
        contact_email: userData.contact_email
    }

    sql.query('UPDATE `management` SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [err];
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Management Co. Edited';
            data['body'] = [res];
            result(null, data);
        }
    })
}
function management() {
    return new Promise((resolve, reject) => {
        sql.query(`select * from management`, (err, res) => {
            if (err) {
                reject({ err: true, data: [] })
            } else {
                resolve({ error: false, data: res })
            }
        })
    })
}

Management.getMGcommunity = function (userData, result) {
    var data = {}
    console.log("userData________________________________________", userData)
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.community_name like '" + userData.searchStr + "%') or ( uu.community_address1 like '" + userData.searchStr + "%') or ( uu.community_address2 like '" + userData.searchStr + "%') or ( uu.city like '" + userData.searchStr + "%') or ( uu.state like '" + userData.searchStr + "%') or ( uu.zipcode like '" + userData.searchStr + "%') or ( uu.community_phone_no like '" + userData.searchStr + "%')) and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    console.log(',,,,,,,,,,searchStr', searchStr);
    var pageNo = userData.pageNo
    console.log("pageNo________________________________________", pageNo)
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum)
    sql.query(`SELECT * from community_portal WHERE management_id=?  and is_deleted = '0' ORDER BY created_at desc`, [userData.user_id], async (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {

            const allManagement = await management()
            //console.log("community data----------------------------",allManagement)
            //console.log("agency data----------------------------",allAgencies)
            //console.log(allCommunities)
            const finalResult = res.map(item => {
                const foundedManagementsName = allManagement.data.length > 0 && item.management_id ? allManagement.data.filter(val => {
                    const commName = item.management_id
                    return commName.includes(val.id)
                }) : []
                return { ...item, names: foundedManagementsName }

            })
            var page = {
                size: limitNum,
                totalElements: res.length,
                totalPages: Math.ceil(res.length == 0 ? 0 : res.length / limitNum),
                pageNumber: pageNo
            }
            console.log("page________________________________________", page)

            console.log("management communitites_______________________________________", res)
            data['error'] = false;
            data['msg'] = "get all community";
            data['pagination'] = page;
            data['body'] = finalResult;
            result(null, data);
        }
    })
}

module.exports = Management;