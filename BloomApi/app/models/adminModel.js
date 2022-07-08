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

User.SuperAdmLogin = function (userData, result) {
    var data = {};
    var lang = 'en';
    let query = `Select id as _id,email,username,
	password as hash_key
	from admin as us where us.email = ? or us.username = ?`;
    sql.query(query, [userData.email, userData.email], function (err, res) {
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
                var username = res[0].username;
                var match = bcrypt.compareSync(userData.password, hash);
                console.log(match)
                // console.log("match", match, param)
                if (match) {
                    let token = jwt.sign({ username: username, userID: res[0]._id, user_role: "6" },
                        config.secret,
                        {
                            expiresIn: '1 days' // expires in 30 Days
                        }
                    );

                    const finalResult = {
                        _id: res[0]._id,
                        email: res[0].email,
                        username: res[0].username,
                        token: token,
                        user_role: "6"
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
User.getCommunityShift = function (userData, result) {
    var data = {}
    sql.query(`SELECT ss.id,ss.community_id,ss.title,ss.description,ss.shift,ss.is_urgent,ss.delay,ss.for_cp,ss.assigned_to_agency,ss.assigned_to_cp,ss.status,ss.start_time,ss.end_time,uu.first_name,uu.last_name,uu.DOB,uu.email,uu.PIN_code FROM shift as ss LEFT JOIN users as uu ON uu.id = IF(ss.assigned_to_cp IS NOT NULL, ss.assigned_to_cp ,ss.assigned_to_agency) where ss.community_id=?`, [userData.community_id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Get All Shift";
            data['body'] = res;
            result(null, data);
        }
    })

}
User.getOpenCommunityShift = function (userData, result) {
    var data = {}
    sql.query(`SELECT ss.*,uu.id,uu.community_id,uu.agency_id,uu.phone_number,uu.first_name,uu.last_name,uu.DOB,uu.email,uu.PIN_code FROM shift as ss LEFT JOIN users as uu ON uu.id=ss.community_id WHERE ss.community_id=?`, [userData.community_id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Get All Shift";
            data['body'] = res;
            result(null, data);
        }
    })

}

User.UpdateApproval = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData);
    var insertData = {
        approval:'1'
    }
    // let query = ''
    // if(userData.user_role == 6 && userData.type==='1'){
    //         query = 'UPDATE `management` SET ? WHERE id=?'
    // }
    // if(userData.user_role == 6 && userData.type==='2'){
    //     query= 'UPDATE `community_portal` SET ? WHERE id=?'
    // }
    // if(userData.user_role == 6 && userData.type==='3'){
    //     query= 'UPDATE `agencies` SET ? WHERE id=?'
    // }    
    sql.query('UPDATE agencies SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [err];
            result(null, data);
        } else {
            //console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Approved';
            data['body'] = [res];
            result(null, data);
        }
    })
}

module.exports = User;