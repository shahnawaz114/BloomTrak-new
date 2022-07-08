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

User.login = function (userData, result) {
    var data = {};
    let query = ''
    console.log('>>>>>>', userData);
    if (userData.user_role == 1) {
        query = "SELECT community_phone_no as phone_no,id as _id,stepper,password as hash_key,isAdmin from community_portal WHERE community_phone_no=?"
    }
    if (userData.user_role == 2) {
        query = "SELECT id as _id,agency_name,password as hash_key,PIN_code as hash_key1,DOB,agency_phone as phone_no,approval,isAdmin,IF (is_deleted='0','0','0') as stepper,agency_email,agency_website FROM agencies WHERE agency_phone =?"
        // sql.query("", [userData.phone_no, userData.phone_no], async (err, res) => {
    }

    if (userData.user_role == 4) {
        query = "SELECT id as _id,community_id,agency_id,DOB,email,password as hash_key,isAdmin,IF (is_deleted='0','0','0') as stepper FROM users WHERE phone_number=?"
    }
    sql.query(query, [userData.phone_no, userData.phone_no], async (err, res) => {
        if (err) {
            console.log('>>>>>>>', err);
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [err];
            result(null, data);
        } else {
            console.log("APPROVAL______________________________", res)
            if (userData.user_role == 2) {
                // console.log("APPROVAL______________________________",res)
                if (res.length > 0) {
                    let approval = res[0].approval
                    if (approval != "1") {
                        data['error'] = true;
                        data['msg'] = 'Not Approved By Admin';
                        data['body'] = [];
                        result(null, data);
                    }
                }

            }
            if (userData.loginWith) {
                if (userData.loginWith == 'pincode' && res[0].hash_key1 === NULL) {
                    data['error'] = true;
                    data['msg'] = 'Please set your pin or login with password';
                    data['body'] = [];
                    result(null, data);
                } else {
                    var hash = res[0].hash_key1;
                    var match = await bcrypt.compare(userData.PIN_code, hash);
                    if (match) {
                        let token = jwt.sign({ userID: res[0]._id, user_role: res[0].isAdmin },
                            config.secret,
                            {
                                expiresIn: '1 days'
                            });

                        const finalResult = {
                            id: res[0]._id,
                            stepper: res[0].stepper,
                            token: token,
                            user_role: userData.user_role
                        }

                        data['error'] = false;
                        var msg = 'Success';
                        data['msg'] = msg;
                        data['body'] = finalResult;
                        result(null, data);
                    }

                    else {
                        data['error'] = true;
                        data['msg'] = 'Invalid PinCode';
                        data['body'] = [];
                        result(null, data);
                    }
                }
            }
            console.log('LoginRes<<<<<<<<<<<<<<<<<<<<<<<<<<<', res);
            if (res.length != 0) {
                var hash = res[0].hash_key;
                var match = await bcrypt.compare(userData.password, hash);
                console.log('.......1', match);

                if (match) {
                    let token = jwt.sign({ userID: res[0]._id, user_role: res[0].isAdmin },
                        config.secret,
                        {
                            expiresIn: '1 days'
                        });

                    const finalResult = {
                        id: res[0]._id,
                        stepper: res[0].stepper,
                        token: token,
                        user_role: userData.user_role
                    }

                    data['error'] = false;
                    var msg = 'Success';
                    data['msg'] = msg;
                    data['body'] = finalResult;
                    result(null, data);
                } else {
                    data['error'] = true;
                    data['msg'] = 'Password Incorrect';
                    data['body'] = [];
                    result(null, data);
                }
            } else {
                data['error'] = true;
                data['msg'] = 'Invalid Credentials, please check and try again!';
                data['body'] = [];
                result(null, data);
            }

        }

    });
}

User.register = function (userData, result) {
    var data = {};
    var id = uuid();
    console.log('<<<>>>', userData);
    const salt = bcrypt.genSaltSync(10);
    userData.password = bcrypt.hashSync(userData.password, salt);
    checkUniqueUser(userData, function (callbackres, deletedUser) {
        console.log("<<<<<<<<<<callbackres>>>>>>>>>", callbackres)
        if (callbackres == false) {
            var insertData = {
                id,
                password: userData.password,
                community_name: userData.community_name,
                community_address1: userData.community_address1,
                community_address2: userData.community_address2,
                community_email: userData.community_email,
                community_website: userData.community_website,
                city: userData.city,
                zipcode: userData.zipcode,
                state: userData.state,
                community_phone_no: userData.community_phone_no,
                primary_contact_firstname: userData.primary_contact_firstname,
                primary_contact_lastname: userData.primary_contact_lastname,
                primary_contact_title: userData.primary_contact_title,
                primary_contact_phone: userData.primary_contact_phone,
                primary_contact_email: userData.primary_contact_email,
                approval: userData.approval,
            }
            console.log("___________________________________________", insertData);
            sql.query('Insert into community_portal Set ?', [insertData], async (err, res) => {
                if (err) {
                    console.log("eroor......", err)
                    data['err'] = true;
                    data['msg'] = 'user cannot register';
                    data['body'] = err;
                    result(null, data);
                } else {
                    console.log("eroor......")
                    let token = jwt.sign({ userID: id, role: 'community', user_role: "1" },
                        config.secret,
                        {
                            expiresIn: '1 days'
                        });
                    const finalResult = {
                        id,
                        community_name: insertData.community_name,
                        community_address1: insertData.community_address1,
                        community_address2: insertData.community_address2,
                        community_email: insertData.community_email,
                        community_website: insertData.community_website,
                        city: insertData.city,
                        zipcode: insertData.zipcode,
                        state: insertData.state,
                        community_phone_no: insertData.community_phone_no,
                        primary_contact_firstname: userData.primary_contact_firstname,
                        primary_contact_lastname: userData.primary_contact_lastname,
                        primary_contact_title: userData.primary_contact_title,
                        primary_contact_phone: userData.primary_contact_phone,
                        primary_contact_email: userData.primary_contact_email,
                        token: token,
                        user_role: "1"
                    }
                    console.log("<><><????", finalResult)
                    console.log("<><><????", res)


                    data['err'] = false;
                    data['msg'] = 'Community Added';
                    data['body'] = [finalResult];
                    result(null, data);
                    // }
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
    sql.query("SELECT * from community_portal where community_phone_no=? and is_deleted='0'", [userdata.community_phone_no], function (err, res) {
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


User.getcommunity = function (userData, result) {
    var data = {}
    console.log("userData________________________________________", userData)
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.community_name like '%" + userData.searchStr + "%') or ( uu.community_address1 like '%" + userData.searchStr + "%') or ( uu.community_address2 like '%" + userData.searchStr + "%') or ( uu.city like '%" + userData.searchStr + "%') or ( uu.state like '%" + userData.searchStr + "%') or ( uu.zipcode like '%" + userData.searchStr + "%') or ( uu.community_phone_no like '%" + userData.searchStr + "%')) and";
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
    sql.query(`SELECT * FROM community_portal as uu where ${searchStr} is_deleted='0' ORDER BY uu.created_at desc`, (error, resp1) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            sql.query(`SELECT id,stepper,password,community_name,community_email,community_address1,community_address2,city,zipcode,state,management_id,community_address2,city,zipcode,state,single_community,community_phone_no,single_community,management_company_name,updated_at, created_at FROM community_portal as uu WHERE ${searchStr} is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], async (error, res) => {
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
                        return { ...item, names: item.single_community == '1' ? foundedManagementsName : [] }


                    })
                    var page = {
                        size: limitNum,
                        totalElements: resp1.length,
                        totalPages: Math.ceil(res.length == 0 ? 0 : res.length / limitNum),
                        pageNumber: pageNo
                    }
                    console.log("page________________________________________", page)

                    console.log("rsesult....", res)
                    data['error'] = false;
                    data['msg'] = "get all community";
                    data['pagination'] = page;
                    data['body'] = finalResult;
                    result(null, data);
                }
            })
        }
    })


}


/*
User.getcommunity = function (userData, result) {
    var data = {}

    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  uu.community_name like '" + userData.searchStr + "%') or ( uu.community_address1 like '" + userData.searchStr + "%') or ( uu.community_phone_no like '" + userData.searchStr + "%')) and";
        if (userData.searchStr == '') {
            var searchStr = '';
        }
    }
    console.log(',,,,,,,,,,searchStr', searchStr);
    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    console.log("<<<<<<<<<>>>>>>>>>>>>", limitNum, startNum)
    sql.query(`SELECT * FROM community_portal as uu where ${searchStr} is_deleted='0' ORDER BY uu.created_at desc`, (error, resp1) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            sql.query(`SELECT id,stepper,password,community_name,community_address1,community_address2,city,zipcode,state,single_community,community_phone_no,single_community,management_company_name,updated_at, created_at FROM community_portal as uu WHERE ${searchStr} is_deleted = '0' ORDER BY uu.created_at desc LIMIT ? OFFSET ?`, [limitNum, startNum], (error, res) => {
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
                    data['msg'] = "get all community";
                    data['pagination'] = page;
                    data['body'] = res;
                    result(null, data);
                }
            })
        }
    })


}
*/
User.getcommunityById = function (userData, result) {
    var data = {}
    sql.query(`SELECT * FROM community_portal WHERE id=? and is_deleted = '0'`, [userData.id], (error, res) => {
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
User.deleteCommunity = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET is_deleted='1' WHERE id=? ", [userData.id], (error, res) => {
        if (error) {
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [];
            result(null, data);
        } else {
            data['error'] = false;
            data['msg'] = "Community Deleted Successfully";
            data['body'] = [];
            result(null, data);
        }
    })
}

User.editCommunity = function (userData, result) {
    var data = {};
    console.log('<<<>>>', userData);
    var insertData = {
        community_name: userData.community_name,
        community_address1: userData.community_address1,
        community_address2: userData.community_address2,
        primary_contact_title: userData.primary_contact_title,
        city: userData.city,
        zipcode: userData.zipcode,
        state: userData.state,
        community_phone_no: userData.community_phone_no
    }

    sql.query('UPDATE `community_portal` SET ? WHERE id=?', [insertData, userData.id], async (err, res) => {
        if (err) {
            console.log("eroor......", err)
            data['error'] = true;
            data['msg'] = err.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("res......", res)
            data['err'] = false;
            data['msg'] = 'Community Edited';
            data['body'] = [res];
            result(null, data);
        }
    })
}
User.updatePrimaryContact = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET `stepper`=?,`primary_contact_firstname`=?,`primary_contact_lastname`=?,`primary_contact_title`=?,`primary_contact_phone`=?,`primary_contact_email`=? WHERE id=?", ["2", userData.primary_contact_firstname, userData.primary_contact_lastname, userData.primary_contact_title, userData.primary_contact_phone, userData.primary_contact_email, userData.id], (error, res1) => {
        if (error) {
            console.log("error....", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: userData.id,
                primary_contact_firstname: userData.primary_contact_firstname,
                primary_contact_lastname: userData.primary_contact_lastname,
                primary_contact_title: userData.primary_contact_title,
                primary_contact_phone: userData.primary_contact_phone,
                primary_contact_email: userData.primary_contact_email,
                stepper: "2"
            }
            data['error'] = false;
            data['msg'] = "Update Primary Contact Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })

}
User.updateSurveyCompliance = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET `stepper`=?,`survey_compliance_name`=?,`survey_compliance_title`=?,`survey_compliance_phone`=?,`survey_compliance_email`=? WHERE id=?", ["3", userData.survey_compliance_name, userData.survey_compliance_title, userData.survey_compliance_phone, userData.survey_compliance_email, userData.id], (error, res1) => {
        if (error) {
            console.log("error.....", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: userData.id,
                survey_compliance_name: userData.survey_compliance_name,
                survey_compliance_title: userData.survey_compliance_title,
                survey_compliance_phone: userData.survey_compliance_phone,
                survey_compliance_email: userData.survey_compliance_email,
                stepper: "3"
            }
            data['error'] = false;
            data['msg'] = "Update Primary Contact Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })
}
User.updateManagementCompany = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET `stepper`=?,`management_company_name`=?,`management_company_address1`=?,`management_company_phone`=?,`management_company_email`=?,`management_company_contact_person`=? WHERE id=?", ["4", userData.management_company_name, userData.management_company_address1, userData.management_company_phone, userData.management_company_email, userData.management_company_contact_person, userData.id], (error, res1) => {
        if (error) {
            console.log("<><><", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: userData.id,
                management_company_name: userData.management_company_name,
                management_company_address1: userData.management_company_address1,
                management_company_phone: userData.management_company_phone,
                management_company_email: userData.management_company_email,
                management_company_contact_person: userData.management_company_contact_person,
                stepper: "4"
            }
            data['error'] = false;
            data['msg'] = "Update Management Company Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })
}
User.updateSingleCommunity = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET `stepper`=?,`single_community`=? WHERE id=?", ["3", userData.single_community, userData.id], (error, res1) => {
        if (error) {
            console.log("errorr......", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: userData.id,
                single_community: userData.single_community,
                stepper: "3"
            }
            data['error'] = false;
            data['msg'] = "Update Single Community Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })
}
User.managementId = function (userData, result) {
    var data = {}
    sql.query("UPDATE `community_portal` SET `stepper`=?,`management_id`=? WHERE id=?", ["4", userData.management_id, userData.id], (error, res1) => {
        if (error) {
            console.log("errorr......", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            const finalResult = {
                id: userData.id,
                stepper: '4'
            }
            data['error'] = false;
            data['msg'] = "Updated Successfully";
            data['body'] = finalResult;
            result(null, data);
        }
    })
}

User.updateCommunityPassword = function (userData, result) {
    var data = {}
    // const salt = bcrypt.genSaltSync(10);
    // userData.password = bcrypt.hashSync(userData.password, salt);

    sql.query(`SELECT id,password as hash_key FROM community_portal WHERE id=?`, [userData.id], async (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            var hash = res[0].hash_key;
            //console.log("old hashed password__________________________________________",hash)
            //console.log("userdata______________________________________________________",userData)
            var match = await bcrypt.compare(userData.oldpassword, hash);
            //console.log("match_________________________________________________________",match)
            if (match) {
                if (userData.newPassword == userData.confPassword) {
                    const salt = bcrypt.genSaltSync(10);
                    userData.newPassword = bcrypt.hashSync(userData.newPassword, salt);
                    //console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..inside matched  password")
                    sql.query(`UPDATE community_portal SET password=? WHERE id=?`, [userData.newPassword, userData.id], (error, res1) => {
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
                    console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..outside match")
                    data['error'] = false;
                    data['msg'] = "new password and confirm password not match";
                    data['body'] = [];
                    result(null, data);
                }
            } else {
                console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>..inside incorrect password")
                data['error'] = true;
                data['msg'] = 'Password Incorrect';
                data['body'] = [];
                result(null, data);
            }
            //console.log("rsesult....", res)

        }

    })

}

User.communityID = function (userData, result) {
    var data = {}
    sql.query(`SELECT id,community_name FROM community_portal WHERE is_deleted = '0'`, (error, res) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            console.log("rsesult....", res)
            data['error'] = false;
            data['msg'] = "Get communityID ";
            data['body'] = res;
            result(null, data);
        }
    })

}

function Communities() {
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

/*
User.getCpShifts = async function (userData, result) {
    console.log(result)
    var data = {}

    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    let query = `SELECT ash.*,ss.id,ss.positions,ss.community_id From applied_shift as ash LEFT JOIN shift as ss ON ash.shift_id = ss.id WHERE ash.aggency_id =?`
    if (userData.for_cp == 'true') {
        query = `SELECT ash.*,ss.id,ss.positions,ss.community_id From applied_shift as ash LEFT JOIN shift as ss ON ash.shift_id = ss.id WHERE ash.user_id =?`
    }
    if (userData.typeUser) {
        if (userData.typeUser == '1') {
            query = `${query} and approved='1' ORDER BY created_at DESC `
        }
        if (userData.typeUser == '2') {
            query = `${query} and status='2' ORDER BY created_at DESC`
        }
        if (userData.typeUser == '0') {
            query = `${query} and status='0' ORDER BY created_at DESC`
        }
    }
    console.log("query...", query, userData)
    sql.query(query, [userData.user_id], (error, allApplied) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            // check assigned to cp or agency
            sql.query(`SELECT ag.*,cp.community_name FROM shift as ag JOIN community_portal as cp ON ag.community_id=cp.id WHERE ag.is_deleted = '0'`, async (error, allShifts) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    var Community = await Communities()
                    //console.log("_______________communities", Community)
                    const userShifts = allApplied.map(item => {
                        var foundedCName = ''
                        foundedCName = Community.data.filter(val => {
                            const commName = item.community_id
                            //console.log(c)
                            return commName.includes(val.id)
                        })
                        console.log("_________________founded com names", foundedCName)

                        return { ...item, community_name: foundedCName[0].community_name }

                    })

                    const approvedShifts = allApplied.filter(item => {
                        return item.status === '0' || item.status === '1'
                    })
                    // console.log(approvedShifts)
                    const availableShifts = allShifts.map(item => {
                        const foundedShift = approvedShifts.find(val => {
                            return val.start_time <= item.start_time && val.end_time >= item.end_time
                        })
                        if (!foundedShift) {
                            return item
                        }
                    }).filter(item => {
                        if (userData.typeUser) {
                            console.log("__________________inside filter")
                            if (userData.typeUser == '1') {
                                console.log("__________________inside posting filter")
                                console.log("============================", item.shift === 'posting')
                                console.log("============================all data", item)

                                return item.shift == 'posting'
                            }
                            else if (userData.typeUser == '2') {
                                console.log("__________________inside confirmation filter")
                                console.log("============================", item.shift == 'confirmation')
                                console.log("============================all data", item)

                                return item.shift == 'confirmation'
                            }
                            else if (userData.typeUser == '3') {
                                console.log("__________________inside standard filter")
                                console.log("============================", item.is_urgent === 'standard')
                                console.log("============================all data", item)

                                return item.is_urgent === 'standard'
                            }
                            else if (userData.typeUser == '4') {
                                console.log("__________________inside urgent filter")
                                console.log("============================", item.is_urgent == 'urgent')
                                console.log("============================all data", item)

                                return item.is_urgent == 'urgent'
                            }
                            else if (userData.typeUser == '5') {
                                console.log("__________________inside assigned_to_cp filter")
                                console.log("============================", item.assigned_to_cp != null)
                                console.log("============================all data", item)

                                return item.assigned_to_cp != null
                            }
                            else if (userData.typeUser == '6') {
                                console.log("__________________inside assigned_to_agency filter")
                                console.log("============================", item.assigned_to_agency != null)
                                console.log("============================all data", item)

                                return item.assigned_to_agency != null
                            }
                        } else if (userData.typeUser == '') {
                            console.log("__________________inside main")
                            console.log("============================all data", item)

                            return item != null && item.status == '0'
                        }
                    });
                    const finalResult = {
                        userShifts: userShifts,
                        availableShifts
                    }
                    console.log("::::::::::::::::::::", allApplied.length)
                    var page = {
                        size: limitNum,
                        totalElements: availableShifts.length,
                        totalPages: Math.ceil(res.length == 0 ? 0 : availableShifts.length / limitNum),
                        pageNumber: pageNo
                    }
                    //console.log("rsesult....", res)
                    data['error'] = false;
                    data['msg'] = "All applied shifts ";
                    //data['pagination'] = page;
                    data['body'] = finalResult;
                    result(null, data);

                }
            })
        }
    })

}
*/

function Users(id) {
    console.log("________________id", id)
    return new Promise((resolve, reject) => {
        sql.query(`select * from users where id=?`, [id], (err, res) => {
            if (err) {
                console.log(err)
                reject({ err: true, data: [] })
            } else {
                //console.log("________________res in function", res)

                resolve({ error: false, data: res })
            }
        })
    })
}

User.getCpShifts = async function (userData, result) {
    console.log(result)
    var data = {}

    var pageNo = userData.pageNo
    var limitNum = parseInt(userData.limitNum ? userData.limitNum : 10);
    var startNum = pageNo == 0 ? 0 : parseInt(pageNo) * limitNum;
    var searchStr1 = '';
    var searchStr2 = '';
    if (userData.searchStr1) {
        const text = userData.searchStr1.toLowerCase();
        searchStr1 = "((  cp.community_name like '%" + userData.searchStr1 + "%') or ( ss.positions like '%" + userData.searchStr1 + "%')) and";
        if (userData.searchStr1 == '') {
            searchStr1 = '';
        }
    }
    if (userData.searchStr2) {
        const text = userData.searchStr2.toLowerCase();
        searchStr2 = "((  cp.community_name like '%" + userData.searchStr2 + "%') or ( ss.positions like '%" + userData.searchStr2 + "%')) and";
        if (userData.searchStr2 == '') {
            searchStr2 = '';
        }
    }

    console.log("______________userdata searchstr", userData.searchStr)
    console.log("______________searchstr", searchStr1)
    let query = `SELECT ash.*,ss.id,ss.positions,ss.community_id,cp.id,cp.community_name From applied_shift as ash LEFT JOIN shift as ss ON ash.shift_id = ss.id LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr2} ash.aggency_id =?`
    if (userData.for_cp == 'true') {
        console.log("______________searchstr", searchStr1)
        console.log('___________________inside cp for applied shifyt')
        query = `SELECT ash.*,ss.id,ss.positions,ss.community_id,cp.id,cp.community_name From applied_shift as ash LEFT JOIN shift as ss ON ash.shift_id = ss.id LEFT JOIN community_portal as cp ON ss.community_id = cp.id WHERE ${searchStr2} ash.user_id =?`
    }
    if (userData.start_time1 && userData.end_time1) {
        let startTime = moment(userData.start_time).utc().unix()
        console.log("______________________________________startTime in applied", startTime)
        let endTime = moment(userData.end_time).utc().unix()
        console.log("______________________________________endTime in applied", endTime)
        query = `${query} AND ash.start_time >=${startTime} AND ash.end_time <=${endTime}`
    }
    if (userData.typeUser1 != 'null') {
        console.log("____________________applied inside filter")
        if (userData.typeUser1 == '1') {
            query = `${query} AND ash.approved='1' `
        }
        if (userData.typeUser1 == '2') {
            query = `${query} AND ash.status='2' `
        }
        if (userData.typeUser1 == '0') {
            query = `${query} AND ash.status='0' `
        }
        if (userData.typeUser1 == '3') {
            query = `${query} AND ash.approved<>'1'`
        }
    }
    console.log("query...", query, userData)
    sql.query(query, [userData.user_id], async (error, allApplied) => {
        var id = ''
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            let query = null;
            if (userData.for_cp == "true") {
                console.log("____________________inside cppppppppp")
                const users = await Users(userData.user_id)
                id = JSON.parse(users.data[0].community_id)
                console.log("________________", id)
                console.log("______________searchstr", searchStr1)
                query = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON ss.community_id=cp.id WHERE ${searchStr1} ss.is_deleted = '0' AND cp.id IN(?)`
                if (userData.start_time2 && userData.end_time2) {
                    let startTime = moment(userData.start_time).utc().unix()
                    console.log("______________________________________startTime in applied", startTime)
                    let endTime = moment(userData.end_time).utc().unix()
                    console.log("______________________________________endTime in applied", endTime)
                    query = `${query} AND ss.start_time >=${startTime} AND ss.end_time <=${endTime}`
                }
                console.log("______________________query 2", query)
                // check assigned to cp or agency
            } else {
                console.log("______________searchstr", searchStr)
                console.log("____________________inside aggggggg")
                query = `SELECT ss.*,cp.id,cp.community_name,agg.* FROM shift as ss JOIN community_portal as cp ON ss.community_id=cp.id LEFT JOIN agencies as agg ON cp.id=agg.community_id WHERE ${searchStr1} agg.id=? AND ss.for_cp <>'1' AND ss.is_deleted = '0'`
                if (userData.start_time2 && userData.end_time2) {
                    let startTime = moment(userData.start_time).utc().unix()
                    console.log("______________________________________startTime in applied", startTime)
                    let endTime = moment(userData.end_time).utc().unix()
                    console.log("______________________________________endTime in applied", endTime)
                    query = `${query} AND ss.start_time >=${startTime} AND ss.end_time <=${endTime}`
                }
            }
            sql.query(query, userData.for_cp == 'true' ? [id] : [userData.user_id], async (error, allShifts) => {
                if (error) {
                    console.log("errorrr", error)
                    data['error'] = true;
                    data['msg'] = error.code;
                    data['body'] = [error];
                    result(null, data);
                } else {
                    if (userData.for_cp == 'true') {
                        console.log("_________________ins cp")
                        console.log("_________________data", allShifts)
                        console.log("_________________applied data", allApplied)
                        var Community = await Communities()
                        //console.log("_______________communities", Community)
                        const userShifts = allApplied
                        const approvedShifts = allApplied.filter(item => {
                            return item.status === '0' || item.status === '1'
                        })
                        // console.log(approvedShifts)
                        const availableShifts = allShifts.map(item => {
                            const foundedShift = approvedShifts.find(val => {
                                return val.start_time <= item.start_time && val.end_time >= item.end_time
                            })
                            if (!foundedShift) {
                                return item
                            }
                        }).filter(item => {
                            return item != null && item.status == '0'
                        })
                        console.log("_________________________________all avaialble user shift", availableShifts)
                        if (userData.typeUser != 'null') {
                            console.log("_______________________inside cp available shift filter")
                            if (userData.typeUser == '1') {
                                console.log("__________________inside typeUser filter")

                                console.log("__________________inside posting filter")
                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.shift == 'posting')
                                    console.log("============================all data", item)
                                    return item.shift == 'posting'
                                })
                            }
                            else if (userData.typeUser == '2') {
                                console.log("__________________inside confirmation filter")
                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.shift == 'confirmation')
                                    console.log("============================all data", item)
                                    return item.shift == 'confirmation'
                                })
                            }
                            else if (userData.typeUser == '3') {
                                console.log("__________________inside standard filter")
                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.is_urgent == 'standard')
                                    console.log("============================all data", item)
                                    return item.is_urgent == 'standard'

                                })
                            }
                            else if (userData.typeUser == '4') {
                                console.log("__________________inside urgent filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.is_urgent == 'urgent')
                                    console.log("============================all data", item)
                                    return item.is_urgent == 'urgent'


                                })
                            }
                            else if (userData.typeUser == '5') {
                                console.log("__________________inside assigned_to_cp filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.assigned_to_cp != null)
                                    console.log("============================all data", item)
                                    return item.assigned_to_cp != null
                                })
                            }
                            else if (userData.typeUser == '6') {
                                console.log("__________________inside assigned_to_agency filter")
                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.assigned_to_agency != null)
                                    console.log("============================all data", item)
                                    return item.assigned_to_agency != null
                                })
                            }
                        }
                        var finalResult
                        if (userData.typeUser != 'null') {
                            console.log('_________________________________inside user filter final result')
                            finalResult = {
                                userShifts: userShifts,
                                availableShifts: filterData
                            }
                        }
                        else {
                            finalResult = {

                                userShifts: userShifts,
                                availableShifts
                            }
                        }


                        console.log("::::::::::::::::::::", allApplied.length)
                        console.log("::::::::::::::::::::", availableShifts.length)
                        if (userData.typeUser != 'null') {
                            console.log("::::::::::::::::::::", filterData.length)
                        }

                        var page = {
                            size: limitNum,
                            totalElements: availableShifts.length,
                            totalPages: Math.ceil(res.length == 0 ? 0 : availableShifts.length / limitNum),
                            pageNumber: pageNo
                        }
                        //console.log("rsesult....", res)
                        data['error'] = false;
                        data['msg'] = "All applied shifts ";
                        //data['pagination'] = page;
                        data['body'] = finalResult;
                        result(null, data);
                    } else {
                        console.log("____________________inside agency")
                        console.log("____________________all available agency data", allShifts)

                        const userShifts = allApplied
                        // console.log(approvedShifts)
                        const availableShifts = allShifts


                        if (userData.typeUser != 'null') {
                            console.log("_______________________inside agency available shift filter")
                            if (userData.typeUser == '1') {
                                console.log("__________________inside typeUser filter")

                                console.log("__________________inside posting filter")

                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.shift == 'posting')
                                    console.log("============================all data", item)
                                    return item.shift == 'posting'

                                })
                            }
                            else if (userData.typeUser == '2') {
                                console.log("__________________inside confirmation filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.shift == 'confirmation')
                                    console.log("============================all data", item)
                                    return item.shift == 'confirmation'

                                })
                            }
                            else if (userData.typeUser == '3') {
                                console.log("__________________inside standard filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.is_urgent == 'standard')
                                    console.log("============================all data", item)
                                    return item.is_urgent == 'standard'

                                })
                            }
                            else if (userData.typeUser == '4') {
                                console.log("__________________inside urgent filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.is_urgent == 'urgent')
                                    console.log("============================all data", item)
                                    return item.is_urgent == 'urgent'


                                })
                            }
                            else if (userData.typeUser == '5') {
                                console.log("__________________inside assigned_to_cp filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.assigned_to_cp != null)
                                    console.log("============================all data", item)
                                    return item.assigned_to_cp != null
                                })
                            }
                            else if (userData.typeUser == '6') {
                                console.log("__________________inside assigned_to_agency filter")


                                var filterData = availableShifts.filter(item => {
                                    console.log("============================", item.assigned_to_agency != null)
                                    console.log("============================all data", item)
                                    return item.assigned_to_agency != null
                                })
                            }
                        }
                        var finalResult
                        if (userData.typeUser != 'null') {
                            console.log('_________________________________inside agency filter final result')
                            finalResult = {
                                userShifts: userShifts,
                                availableShifts: filterData
                            }
                        } else {
                            finalResult = {
                                userShifts: userShifts,
                                availableShifts
                            }
                        }


                        console.log("::::::::::::::::::::", allApplied.length)
                        console.log("::::::::::::::::::::______", finalResult.availableShifts.length)
                        if (userData.typeUser != 'null') {
                            console.log("::::::::::::::::::::", filterData.length)
                        }

                        var page = {
                            size: limitNum,
                            totalElements: availableShifts.length,
                            totalPages: Math.ceil(res.length == 0 ? 0 : availableShifts.length / limitNum),
                            pageNumber: pageNo
                        }

                        data['error'] = false;
                        data['msg'] = "All applied shifts ";
                        //data['pagination'] = page;
                        data['body'] = finalResult;
                        result(null, data);
                    }


                }
            })
        }
    })

}


User.getCommunityShifts = function (userData, result) {
    var data = {}
    console.log("userData________________________________________", userData)
    var searchStr = '';
    if (userData.searchStr) {
        const text = userData.searchStr.toLowerCase();
        var searchStr = "((  position like '" + userData.searchStr + "%') or ( description like '" + userData.searchStr + "%') ) and";
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
    console.log(userData)
    let mQuery = null
    let orderBy = 'ORDER BY ss.created_at desc'


    if (userData.typeUser) {
        console.log("___________________________inside mg or cm type user")
        if (userData.user_role == 1) {
            console.log("___________________________inside community typeuser")

            mQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp on cp.id = ss.community_id  where ${searchStr} ss.community_id=? and ss.is_deleted='0' `

        } else if (userData.user_role == 3) {
            mQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp on cp.id = ss.community_id  where ${searchStr} cp.management_id=? and ss.is_deleted='0' `
            console.log("___________________________inside management typeuser")

        }

        if (userData.typeUser == '1') {
            mQuery = `${mQuery} AND shift='posting' ${orderBy}`
        }
        if (userData.typeUser == '2') {
            mQuery = `${mQuery} AND shift='confirmation' ${orderBy}`
        }
        if (userData.typeUser == '3') {
            mQuery = `${mQuery} AND is_urgent ='standard' ${orderBy}`
        }
        if (userData.typeUser == '4') {
            mQuery = `${mQuery} AND is_urgent ='urgent' ${orderBy}`
        }
        if (userData.typeUser == '5') {
            mQuery = `${mQuery} AND assigned_to_cp IS NOT NULL ${orderBy}`
        }
        if (userData.typeUser == '6') {
            mQuery = `${mQuery} AND assigned_to_agency IS NOT NULL ${orderBy}`
        }
    } else {
        if (userData.user_role == 1) {
            console.log("___________________________inside community main")
            //mQuery = `SELECT * FROM shift where ${searchStr} community_id=? and is_deleted='0'`
            mQuery = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp on cp.id = ss.community_id  where ${searchStr} ss.community_id=? and ss.is_deleted='0' ${orderBy}`
        } else if (userData.user_role == 3) {
            console.log("___________________________inside management main")
            mQuery = `SELECT ss.*, cp.management_id,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON cp.id= ss.community_id where ${searchStr} cp.management_id =? and ss.is_deleted = "0" ${orderBy}`
        }
    }


    console.log(mQuery)
    sql.query(mQuery, [userData.community_id], (error, resp1) => {
        if (error) {
            console.log("errorrr", error)
            data['error'] = true;
            data['msg'] = error.code;
            data['body'] = [error];
            result(null, data);
        } else {
            let query = null
            let QString = 'ORDER BY ss.created_at desc LIMIT ? OFFSET ?'
            if (userData.typeUser) {
                console.log("___________________________inside mg or cm type user")

                if (userData.user_role == 3) {
                    console.log("___________________________inside management typeUser")
                    query = `SELECT ss.*, cp.management_id,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON cp.id= ss.community_id WHERE ${searchStr} cp.management_id=? and ss.is_deleted='0'`
                } else if (userData.user_role == 1) {
                    console.log('____________________________inside community typeUser')
                    query = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp on cp.id = ss.community_id  where ${searchStr} ss.community_id=? and ss.is_deleted='0' `
                    //query = `SELECT id, title,department, description,shift, is_urgent, delay,h_m, for_cp,assigned_to_cp,status,assigned,start_time, end_time, created_at, updated_at FROM shift WHERE is_deleted = '0' AND community_id =? ${QString}`
                }
                if (userData.typeUser == '1') {
                    query = `${query} AND shift='posting' ${QString} `
                }
                if (userData.typeUser == '2') {
                    query = `${query} AND shift='confirmation' ${QString} `
                }
                if (userData.typeUser == '3') {
                    query = `${query} AND is_urgent ='standard' ${QString}`
                }
                if (userData.typeUser == '4') {
                    query = `${query} AND is_urgent ='urgent' ${QString}`
                }
                if (userData.typeUser == '5') {
                    query = `${query} AND assigned_to_cp IS NOT NULL ${QString}`
                }
                if (userData.typeUser == '6') {
                    query = `${query} AND assigned_to_agency IS NOT NULL ${QString}`
                }
            }
            else {
                if (userData.user_role == 3) {
                    console.log("___________________________inside management main")
                    query = `SELECT ss.*, cp.management_id,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp ON cp.id= ss.community_id WHERE ${searchStr} cp.management_id=? and ss.is_deleted='0' ${QString}`
                } else if (userData.user_role == 1) {
                    console.log('____________________________inside community main')
                    query = `SELECT ss.*,cp.community_name FROM shift as ss LEFT JOIN community_portal as cp on cp.id = ss.community_id  where ${searchStr} ss.community_id=? and ss.is_deleted='0' ${QString}`
                    //query = `SELECT id, title,department, description,shift, is_urgent, delay,h_m, for_cp,assigned_to_cp,status,assigned,start_time, end_time, created_at, updated_at FROM shift WHERE is_deleted = '0' AND community_id =? ${QString}`
                }
            }
            console.log("...query", query);
            sql.query(query, [userData.community_id, limitNum, startNum], (error, res) => {
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
                    console.log("page________________________________________", page)
                    console.log("AVAILABLE SHIFT rsesult....", res.length, resp1.length)
                    data['error'] = false;
                    data['msg'] = "all Shifts";
                    data['pagination'] = page;
                    data['body'] = res;
                    result(null, data);
                }
            })
        }
    })
}
module.exports = User;