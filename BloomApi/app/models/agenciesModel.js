const sql = require('../db/config');
const bcrypt = require('bcrypt');
var { v4: uuid } = require('uuid');
const config = require('../../utils/config');
const jwt = require('jsonwebtoken');
var { v4: uuid } = require('uuid');
const res = require('express/lib/response');
//const { twilioCredentials } = require("../../utils//index");
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const twilio = require('twilio');


//const client = require('twilio')(twilioCredentials.account_sid, twilioCredentials.auth_token);
const accountSid = "AC4c9775dd98781b0efaed90dba98d5076"
const authToken = "a57d8512447a9d2fead871d885ea7427"
const client = new twilio(accountSid, authToken);




var User = function (list) {
    this.name = list.name;
    this.email = list.email;

}


User.addAgencies = function (userData, result) {
    var data = {}
    var id = uuid()
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    checkUniqueUser(userData, function (callbackres, deletedUser) {
        console.log("<<<<<<<<<<callbackres>>>>>>>>>", callbackres)
        var insertData = {
            id,
            community_id: userData.community_id,
            agency_name: userData.agency_name,
            agency_phone: userData.agency_phone,
            agency_email: userData.agency_email,
            agency_website: userData.agency_email,
            agency_contact_firstname: userData.agency_contact_firstname,
            agency_contact_lastname: userData.agency_contact_lastname,
            agency_contact_cell_number: userData.agency_contact_cell_number,
            agency_contact_email_address: userData.agency_contact_email_address,
            agency_contact_person_title: userData.agency_contact_person_title,
            password: userData.password,
            DOB: userData.DOB,
            PIN_code: userData.PIN_code,
            address1: userData.address1,
            address2: userData.address2,
            city: userData.agency_email,
            zipcode: userData.zipcode,
            state: userData.state,
            primary_contact_person: userData.primary_contact_person,
            primary_contact_phone: userData.primary_contact_phone,
            primary_contact_email: userData.primary_contact_email,
            //approval: userData.approval,
        }
        if (callbackres == false) {
            sql.query("INSERT INTO agencies Set ? and isAdmin=? and approval=?", [insertData, '2', '0'], async (error, res1) => {
                if (error) {
                    console.log("errorr......", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    console.log("<><>", res1)
                    const finalResult = {
                        id: id,
                        user_role: "2"
                    }
                    data['error'] = false;
                    data['msg'] = "Agency Added";
                    data['body'] = finalResult;
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
    sql.query("SELECT * from users where agency_phone=? and is_deleted='0'", [userdata.agency_phone], function (err, res) {
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
User.editAgencies = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData);
    var insertData = {
        agency_name: userData.agency_name,
        agency_phone: userData.agency_phone,
        agency_email: userData.agency_email,
        agency_website: userData.agency_website,
        address1: userData.address1,
        address2: userData.address2,
        agency_contact_person_title: userData.agency_contact_person_title,
        city: userData.city,
        state: userData.state,
        zipcode: userData.zipcode,
        primary_contact_person: userData.primary_contact_person,
        primary_contact_phone: userData.primary_contact_phone,
        primary_contact_email: userData.primary_contact_email,


    }

    sql.query('UPDATE `agencies` SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Agency Edited';
            data['body'] = [res];
            result(null, data);
        }
    })
}
User.deleteAgencies = function (userData, result) {
    var data = {}
    sql.query("UPDATE `agencies` SET is_deleted='1' WHERE id=? ", [userData.id], (error, res) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Deleted Agencies Successfully";
            data['body'] = [];
            result(null, data);
        }
    })
}
User.getAgencies = function (userData, result) {
    var data = {}
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "(  uu.agency_name like '" + userData.searchStr + "%') or ( uu.agency_phone like '" + userData.searchStr + "%') or ( uu.agency_website like '" + userData.searchStr + "%') or ( uu.agency_email like '" + userData.searchStr + "%') or ( uu.agency_website like '" + userData.searchStr + "%') and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    console.log(',,,,,,,,,,searchStr', searchStr);
    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum)
    // var communityCondition = {}
    // if (userData.isAdmin == 1) {
    //     communityCondition = `community_id='${userData.id}' and`
    // }
    if (userData.is_for && userData.is_for == "community") {
        console.log("inside__________________________________________community")
        sql.query(`SELECT * FROM agencies WHERE community_id =? and is_deleted ='0' ORDER BY created_at desc`, [userData.community_id], (error, res) => {
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
                console.log("community agencies_________________________________....", res)
                data['error'] = false;
                data['msg'] = "Get Agencies";
                //data['pagination'] = page;
                data['body'] = res;
                result(null, data);
            }
        })
    } else if (userData.is_for && userData.is_for == 'superadmin') {
        console.log("inside__________________________________________superadmin")
        sql.query(`SELECT * FROM agencies as uu where ${searchStr} is_deleted='0' ORDER BY uu.created_at desc`, (error, resp1) => {
            if (error) {
                console.log("errorrr", error)
                data['error'] = true;
                data['msg'] = error.code;
                data['body'] = [error];
                result(null, data);
            } else {
                sql.query(`SELECT uu.id,uu.community_id,uu.agency_name,uu.agency_phone,uu.agency_email,uu.approval,uu.agency_website,uu.created_at,uu.updated_at,cp.community_name FROM agencies as uu  
                LEFT JOIN community_portal cp ON cp.id=uu.community_id WHERE ${searchStr}  uu.is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], (error, res) => {
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
                        data['msg'] = "Get Agencies";
                        data['pagination'] = page;
                        data['body'] = res;
                        result(null, data);
                    }
                })
            }
        })
    }




}
User.getAgenciesByID = function (userData, result) {
    var data = {}
    let query = null
    if (userData.is_for && userData.is_for == "community") {
        query = `SELECT * FROM agencies WHERE community_id =? and is_deleted ='0'`
    } else {
        console.log(">>>>>>>>>>>>>>>>>>>>>...............................................................insidenot cp",)
        query = `SELECT ag.* FROM agencies as ag LEFT JOIN community_portal cp ON cp.id=ag.community_id WHERE ag.is_deleted='0' and ag.id =?`
    }
    sql.query(query, [userData.id], (error, res) => {
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

User.updateAgenciesPassword = function (userData, result) {
    var data = {}
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    sql.query(`SELECT id,password FROM agencies WHERE id=?`, [userData.id], (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            if (userData.newPassword == userData.confPassword) {
                sql.query(`UPDATE agencies SET password=? WHERE id=?`, [userData.password, userData.id], (error, res1) => {
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

User.agenciesID = function (userData, result) {
    var data = {}
    sql.query(`SELECT id,agency_name,community_id FROM agencies WHERE is_deleted = '0'`, (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "Get agenciesID";
            data['body'] = res;
            result(null, data);
        }
    })

}

User.UpdateAgencyByID = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData);

    if (userData.PIN_code) {
        const salt = bcrypt.genSaltSync(10);
        PIN_code = bcrypt.hashSync(userData.PIN_code, salt);
        sql.query('UPDATE agencies SET `PIN_code`=? WHERE id=?', [PIN_code, userData.id], async (err, res) => {
            if (err) {
                console.log("eroor......", err)
                data['error'] = true;
                data['msg'] = err.code;
                data['body'] = [err];
                result(null, data);
            } else {
                //console.log("res......", res)
                data['err'] = false;
                data['msg'] = 'PINCode update Succesfully';
                data['body'] = [res];
                result(null, data);
            }
        })
    } else {
        var insertData = {
            agency_name: userData.agency_name,
            agency_phone: userData.agency_phone,
            agency_website: userData.agency_website,
            PIN_code: userData.PIN_code,
            DOB: userData.DOB

        }

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
                data['msg'] = 'Edit Profile Succesfully';
                data['body'] = [res];
                result(null, data);
            }
        })
    }
}


User.sms = async (params, result) => {
    var data = {}
    console.log("params...............", params)
    let OTP = Math.floor(100000 + Math.random() * 900000);
    let ext = '+91'
    const number = ext.concat(params.number ? params.number : '+6597205678')
    console.log(number)
    //const number = params.number ? params.number : '+6597205678'
    try {
        const finalResult = await msgSingleUser({ number, OTP });
        console.log("finalfinalResult____________________", finalResult)
        let query = null
        if (params.is_for == 'user') {
            console.log("________________________________________inside user")

            query = `UPDATE users SET OTP=${OTP} WHERE id=?`
        }
        if (params.is_for == 'community') {
            console.log("_______________________________________community")

            query = `UPDATE community_portal SET OTP=${OTP} WHERE id=?`
        }
        if (params.is_for == 'agency') {
            console.log("_______________________________________agency")

            query = `UPDATE agencies SET OTP=${OTP} WHERE id=?`
        }
        if (params.is_for == 'management') {
            console.log("________________________________________inside management")

            query = `UPDATE management SET OTP=${OTP} WHERE id=?`
        }
        console.log("query______________________________________", query)
        sql.query(query, [params.id], async (err, res) => {
            if (err) {
                console.log("eroor......", err)
            } else {
                console.log("res......", res)
                data['err'] = false;
                data['msg'] = 'Otp sent Succesfully';
                data['body'] = [];
                result(null, data);
            }
        })
    } catch (e) {
        data["error"] = true
        data["msg"] = `Something wrong ${e}`
        data["body"] = []
        result(null, data);
    }
}

function msgSingleUser(values) {
    // console.log(values)
    return new Promise((resolve, reject) => {
        client.messages
            .create({
                body: `Hello your One Time Password is ${values.OTP}`,
                //to: `565746756`,
                to: `${values.number}`, // Text this number
                from: '+18042077878'// From a valid Twilio number
            })
            .then(message => {
                console.log(message.body)
                resolve(message)
            })
            .catch(error => {
                //console.log(error)
                reject(error)
            });
    })

}

User.VerifyOtp = function (userData, result) {
    var data = {}
    let query = null
    let uQuery = null

    if (userData.is_for && userData.is_for == 'user') {
        console.log("________________________________________inside user")
        query = `select OTP as otp from users WHERE id=?`
        uQuery = "UPDATE users SET is_verified=? WHERE id=? "
    }
    if (userData.is_for && userData.is_for == 'community') {
        console.log("_______________________________________community")
        query = `select OTP as otp from community_portal WHERE id=?`
        uQuery = "UPDATE community_portal SET is_verified=? WHERE id=?"
    }
    if (userData.is_for && userData.is_for == 'agency') {
        console.log("________________________________________agency")
        query = `select OTP as otp from agencies WHERE id=?`
        uQuery = "UPDATE agencies SET is_verified=? WHERE id=? "
    }
    if (userData.is_for && userData.is_for == 'management') {
        console.log("________________________________________inside user")
        query = `select OTP as otp from management WHERE id=?`
        uQuery = "UPDATE management SET is_verified=? WHERE id=? "
    }

    console.log("query___________________________________", query)
    sql.query(query, [userData.id], (error, res) => {
        if (error) {
            console.log(error)
        } else {
            let otp = res[0].otp
            if (userData.otp == otp) {
                console.log("uquery___________________________________", uQuery)
                sql.query(uQuery, ['1', userData.id], (error, res) => {
                    if (error) {
                        console.log(error)
                    } else {

                        data['error'] = false;
                        data['msg'] = "Verified";
                        data['body'] = [];
                        result(null, data);
                    }
                })

            } else {
                data['error'] = true;
                data['msg'] = 'incorrect otp';
                data['body'] = [];
                result(null, data);
            }

        }
    })
}


module.exports = User;
