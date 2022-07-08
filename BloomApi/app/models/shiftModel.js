const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const moment = require("moment");
const res = require('express/lib/response');
const { query } = require('express');

var User = function (list) {
    this.name = list.name;
    this.email = list.email;

}

User.addshift = function (userData, result) {
    var data = {}
    var dataa = userData
    console.log('userdata____________________________', userData)
    const insertData = dataa.map(item => {
        return [
            uuid(),
            item.title,
            item.department,
            item.position,
            item.certification,
            item.description,
            item.shift,
            item.is_urgent,
            item.delay,
            item.h_m,
            item.for_cp,
            item.assigned_to_agency,
            item.assigned_to_cp,
            item.community_id,
            moment(item.start_time).utc().unix(),
            moment(item.end_time).utc().unix(),
        ]
    })
    sql.query("INSERT INTO `shift`(`id`,`title`, `department`,`positions`,`certification`,`description`, `shift`, `is_urgent`, `delay`,`h_m`, `for_cp`, `assigned_to_agency`, `assigned_to_cp`,`community_id`,`start_time`, `end_time`) VALUES ?", [insertData], (error, res1) => {
        if (error) {
            console.log("errorr......", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            // const finalResult = {
            //     id: id,
            // }
            data['error'] = false;
            data['msg'] = "Shift Added";
            data['body'] = res1;
            result(null, data);
        }
    })
}
User.editshift = function (userData, result) {
    var data = {};
    console.log("userdata____________________________________________,", userData);
    var insertData = {
        title: userData.title,
        department: userData.department,
        description: userData.description,
        department: userData.department,
        positions: userData.position,
        certification: userData.certification,
        community_id: userData.community_id,
        shift: userData.shift,
        is_urgent: userData.is_urgent,
        delay: userData.delay,
        h_m: userData.h_m,
        for_cp: userData.for_cp,
        assigned_to_agency: userData.assigned_to_agency,
        assigned_to_cp: userData.assigned_to_cp,
        start_time: moment(userData.start_time).utc().unix(),
        end_time: moment(userData.end_time).utc().unix()

    }
    sql.query('UPDATE `shift` SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("response____________________________________________,", res);
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [err];
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Shift Edited';
            data['body'] = res;
            result(null, data);
        }
    })
}
User.deleteshift = function (userData, result) {
    var data = {}
    sql.query("UPDATE `shift` SET is_deleted='1' WHERE id=? ", [userData.id], (error, res) => {
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
User.getshift = function (userData, result) {
    var data = {}
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.title like '" + userData.searchStr + "%') or ( uu.description like '" + userData.searchStr + "%') or ( uu.shift like '" + userData.searchStr + "%') or ( uu.start_time like '" + userData.searchStr + "%')) and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    let mQuery = null
    let orderBy = 'ORDER BY ss.created_at desc'
    if (userData.typeUser) {
        console.log("inside____________________________ typeUser")

        mQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr} ss.is_deleted='0' `

        if (userData.typeUser == '1') {
            mQuery = `${mQuery} AND ss.shift='posting' ${orderBy}`
        }
        if (userData.typeUser == '2') {
            mQuery = `${mQuery} AND ss.shift='confirmation' ${orderBy} `
        }
        if (userData.typeUser == '3') {
            mQuery = `${mQuery} AND ss.is_urgent ='standard' ${orderBy}`
        }
        if (userData.typeUser == '4') {
            mQuery = `${mQuery} AND ss.is_urgent ='urgent' ${orderBy}`
        }
        if (userData.typeUser == '5') {
            mQuery = `${mQuery} AND ss.assigned_to_cp IS NOT NULL ${orderBy}`
        }
        if (userData.typeUser == '6') {
            mQuery = `${mQuery} AND ss.assigned_to_agency IS NOT NULL ${orderBy}`
        }
    } else {
        console.log("inside____________________________ main")
        mQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr} ss.is_deleted='0' ${orderBy}`
    }

    console.log("QUERY", mQuery)

    sql.query(mQuery, (error, res) => {
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

            let uQuery = null
            let qString = 'ORDER BY ss.created_at desc LIMIT ? OFFSET ?'
            if (userData.typeUser) {
                console.log("inside____________________________ typeUser")
                uQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr} ss.is_deleted='0'`

                if (userData.typeUser == '1') {
                    uQuery = `${uQuery} AND ss.shift='posting'   ${qString}`
                }
                if (userData.typeUser == '2') {
                    uQuery = `${uQuery} AND ss.shift='confirmation'   ${qString}`
                }
                if (userData.typeUser == '3') {
                    uQuery = `${uQuery} AND ss.is_urgent ='standard'   ${qString}`
                }
                if (userData.typeUser == '4') {
                    uQuery = `${uQuery} AND ss.is_urgent ='urgent'  ${qString}`
                }
                if (userData.typeUser == '5') {
                    uQuery = `${uQuery} AND ss.assigned_to_cp IS NOT NULL   ${qString}`
                }
                if (userData.typeUser == '6') {
                    uQuery = `${uQuery} AND ss.assigned_to_agency IS NOT NULL ${orderBy}  ${qString}`
                }
            } else {
                console.log("inside____________________________ main")
                uQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr} ss.is_deleted='0' ${qString}`
            }
            console.log("query", uQuery)
            sql.query(uQuery, [limitNum, startNum], (error, res1) => {
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
                        totalPages: Math.ceil(res1.length == 0 ? 0 : res1.length / limitNum),
                        pageNumber: pageNo
                    }
                    // console.log("rsesult....", page)
                    // console.log("rsesult....", res1)
                    data['error'] = false;
                    data['msg'] = "Get Shift";
                    data['pagination'] = page;
                    data['body'] = res1;
                    console.log("data.......", data)
                    result(null, data);
                }
            })
        }
    })


}
User.getshiftById = function (userData, result) {
    var data = {}
    sql.query(`SELECT *  FROM shift WHERE is_deleted = '0' and id =?`, [userData.id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "get all shift";
            data['body'] = res;
            result(null, data);
        }
    })

}

// User.projectID = function (userData, result) {
//     var data = {}
//     sql.query(`SELECT id,community_id,title FROM project WHERE is_deleted = '0'`, (error, res) => {
//         if (error) {
//             console.log("errorrr", error)
//             data['error'] = true;
//             data['msg'] = error.code;
//             data['body'] = [error];
//             result(null, data);
//         } else {
//             console.log("rsesult....", res)
//             data['error'] = false;
//             data['msg'] = "Get userID";
//             data['body'] = res;
//             result(null, data);
//         }
//     })

// }


User.applyShift = function (userData, result) {
    var data = {}
    console.log(".................", userData)
    sql.query("SELECT * from shift where id=?", [userData.shift_id], (error, shiftData) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            if (shiftData.length > 0) {
                var start_time = shiftData[0].start_time
                var end_time = shiftData[0].end_time
                const insertData = {
                    shift_id: userData.shift_id,
                    start_time,
                    end_time
                }
                if (userData.is_agency == '1') {
                    insertData['aggency_id'] = userData.user_id;
                    sql.query("INSERT INTO applied_shift SET ?", [insertData], (error, res) => {
                        if (error) {
                            data['error'] = true;
                            data['msg'] = error.code;
                            data['body'] = [error];
                            result(null, data);
                        } else {
                            data['error'] = false;
                            data['msg'] = "Successfully Applied for the shift";
                            data['body'] = [error];
                            result(null, data);
                        }
                    })
                } else {
                    sql.query(`SELECT * from applied_shift where user_id=? and approved='1' and (
                        start_time <= ? and end_time >= ? 
                            OR
                            CASE WHEN start_time <= ?
                            THEN
                            end_time between ? and ?
                            END
                            OR 
                            CASE WHEN end_time >= ?
                            THEN
                            start_time between ? and ?
                            END
                    )`, [userData.user_id, start_time, end_time, start_time, start_time, end_time, end_time, start_time, end_time], (error, allAppliedShift) => {
                        if (error) {
                            data['error'] = true;
                            data['msg'] = error.code;
                            data['body'] = [error];
                            result(null, data);
                        } else {
                            if (allAppliedShift.length > 0) {
                                data['error'] = true;
                                data['msg'] = "You can not apply for this shift";
                                data['body'] = [];
                                result(null, data);
                            } else {
                                insertData['user_id'] = userData.user_id;
                                insertData['approved'] = shiftData[0].is_urgent == 'urgent' ? '1' : '0'
                                sql.query("INSERT INTO applied_shift SET ?", [insertData], (error, res) => {
                                    if (error) {
                                        data['error'] = true;
                                        data['msg'] = error.code;
                                        data['body'] = [error];
                                        result(null, data);
                                    } else {
                                        data['error'] = false;
                                        data['msg'] = "Successfully Applied for the shift";
                                        data['body'] = [error];
                                        result(null, data);
                                    }
                                })
                            }
                        }
                    })
                }

            } else {
                data['error'] = true;
                data['msg'] = "No shift founded"
                data['body'] = [];
                result(null, data);
            }
        }
    })
}

User.appliedShift = function (userData, result) {
    var data = {}
    let query = null
    if (userData.is_for == "cp") {
        console.log("_____________________inside cp")
        query = `SELECT *,ss.hourly_rate from applied_shift as ag LEFT JOIN shift as ss ON ss.id = ag.shift_id RIGHT JOIN users as uu ON  ag.user_id = uu.id WHERE ag.shift_id=? AND uu.is_deleted='0'`
    } else {
        console.log("_____________________inside ag")

        query = `SELECT *,ss.hourly_rate from applied_shift as ag LEFT JOIN shift as ss ON ss.id = ag.shift_id RIGHT JOIN agencies as uu ON ag.aggency_id = uu.id WHERE ag.shift_id=? AND uu.is_deleted='0'`
    }
    console.log("______________________________query::::", query)
    sql.query(query, [userData.shift_id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            //console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "shift users";
            data['body'] = res;
            result(null, data);
        }
    })

}

User.assignShift = function (userData, result) {
    var data = {}
    sql.query("Update applied_shift SET `approved`='1' where user_id =? and shift_id=?", [userData.user_id, userData.id], (error, res) => {
        if (error) {
            console.log("errorrr1", error)

            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        }

        else {
            console.log("___________________________", res)

            sql.query("Update applied_shift SET `approved`=? where shift_id=? AND user_id <> ?", ['2', userData.id, userData.user_id], (error, res1) => {
                if (error) {
                    console.log("errorrr", error)

                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    sql.query("Update shift SET `assigned`='1' where shift_id=?", [userData.id], (error, res2) => {
                        if (error) {
                            console.log("errorrr", error)

                            data['error'] = true;
                            data['msg'] = error.code;
                            data['body'] = [error];
                            result(null, data);
                        } else {

                            data['error'] = false;
                            data['msg'] = "Assigned";
                            data['body'] = res2;
                            result(null, data);
                        }
                    })
                }
            })

        }
    })

}

User.startShift = function (userData, result) {
    var data = {}
    let time = new Date()
    var currentTime = moment(time).utc().unix()
    console.log("______________", currentTime)
    if (userData.is_for && userData.is_for == 'start') {
        sql.query(`SELECT * from applied_shift where shift_id=? and (
                        start_time >= ?
                    )`, [userData.id, currentTime], (error, assigned) => {
            if (error) {
                data['error'] = true;
                data['msg'] = error.code;
                data['body'] = [error];
                result(null, data);
            } else {
                if (assigned.length > 0) {
                    console.log("_________________", assigned)
                    var time = '';
                    sql.query(`UPDATE applied_shift SET status='1' and user_start_time=${currentTime} WHERE shift_id=?`, [userData.id], async (err, res1) => {
                        if (err) {
                            //console.log("response____________________________________________,", res);
                            console.log(err)
                        } else {
                            sql.query(`UPDATE shift SET status='1' WHERE id=?`, [userData.id], async (err, res) => {
                                if (err) {
                                    //console.log("response____________________________________________,", res);
                                    console.log(err)
                                } else {
                                    //console.log("res......", res)
                                    data['err'] = false;
                                    data['msg'] = 'Shift started';
                                    data['body'] = res1;
                                    result(null, data);
                                }
                            })
                        }
                    })
                } else {
                    //time = userData.currentTime - userData.start_time
                    data['err'] = true;
                    data['msg'] = 'Shift Not started';
                    data['body'] = [];
                    result(null, data);
                }
            }
        })

        // let start_time = res[0].start_time
        // if (userData.currentTime && start_time >= userData.currentTime) {

        // }
    } else if (userData.is_for && userData.is_for == 'end') {
        let end_time = res[0].end_time
        if (userData.currentTime && end_time <= userData.currentTime) {

        }
    }

}

module.exports = User;