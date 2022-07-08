'user strict';
var sql = require('../db/config');
// var dbFunc = require('./db-functions.js');

//Task object constructor
var Common = function (userData) {
    // console.log(userData);
    this.username = userData.username;
    this.created_at = new Date();
};

Common.getAgencyUsers = (userData) => {
    console.log("kkkkllll", userData)
    return new Promise((resolve, reject) => {
        sql.query(`SELECT ag.* FROM users as ag 
        WHERE ag.is_deleted='0'`, (error, res) => {
            if (error) {
                reject({ error: true, data: [] })
            } else {
                let allUsers = res;
                allUsers = allUsers.filter(item => {
                    const agencyUsers = item.agency_id ? JSON.parse(item.agency_id) : []
                    return agencyUsers.includes(userData.id);
                })
                resolve({ error: false, data: allUsers })
            }

        })
    })
}

module.exports = Common