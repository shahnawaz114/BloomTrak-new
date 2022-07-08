const express = require('express');
var helper = require("../../utils/helper");
const router = express.Router();
const userController = require('../controller/userController');
const agenciesController = require('../controller/agenciesController');
const communityController = require('../controller/communityController');
const contractController = require('../controller/contractController');
const shiftController = require('../controller/shiftController');
const adminController = require('../controller/adminController');
const ManagementController = require('../controller/ManagementController');
const dashboardController = require('../controller/dashboardController');


/////admin////////
router.post('/admLogin', adminController.SuperAdmLogin);
router.get('/getCommunityShift/:community_id', helper.verifyToken, adminController.getCommunityShift);
router.get('/getOpenCommunityShift/:community_id', helper.verifyToken, adminController.getOpenCommunityShift);
router.post('/updateAprroval', helper.verifyToken, adminController.UpdateApproval);

////////Dashboard///////
router.get('/dashboard', helper.verifyToken, dashboardController.dashboardStatus);
router.get('/CMdashboard', helper.verifyToken, dashboardController.CMdashboardStatus);

///////community//////////
router.post('/login', communityController.login);
router.post('/register', communityController.register);
router.post('/editCommunity', communityController.editCommunity);
router.get('/getcommunity', helper.verifyToken, helper.ManagementAdminAuthenticator, communityController.getcommunity);
router.get('/getcommunityById', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.getcommunityById);
router.post('/deleteCommunity', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.deleteCommunity);
router.post('/updatePrimaryContact', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.updatePrimaryContact);
router.post('/updateSurveyCompliance', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.updateSurveyCompliance);
router.post('/updateManagementCompany', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.updateManagementCompany);
router.post('/updateSingleCommunity', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.updateSingleCommunity);
router.post('/updateManagementId', helper.verifyToken, helper.communityAdminAgencyAuthenticator, communityController.updateManagementId);
router.get('/getCommunityShiftByID/:user_id', helper.verifyToken, communityController.getCommunityShiftByID);

/////agencies///////
router.post('/addAgencies', agenciesController.addAgencies);
router.post('/editAgencies', helper.verifyToken, helper.communityAdminAuthenticator, agenciesController.editAgencies);
router.post('/deleteAgencies', helper.verifyToken, helper.communityAdminAuthenticator, agenciesController.deleteAgencies);
router.get('/getAgencies', agenciesController.getAgencies);
router.get('/getAgenciesByID', helper.verifyToken, agenciesController.getAgenciesByID);
router.post('/updateAgencyProfile', helper.verifyToken, helper.communityAdminAgencyAuthenticator, agenciesController.UpdateAgencyByID);
router.post('/sms', agenciesController.sms);
router.post('/verifyOtp', agenciesController.verifyOtp);



/////////////USERS///////////
router.post('/addUser', helper.verifyToken, helper.communityAdminAgencyAuthenticator, userController.addUser);
router.post('/editUser', helper.verifyToken, helper.communityAdminAgencyAuthenticator, userController.editUser);
router.post('/deleteUser', helper.verifyToken, helper.communityAdminAgencyAuthenticator, userController.deleteUser);
router.get('/getUser', helper.verifyToken, helper.communityAdminAgencyAuthenticator, userController.getUser);
router.get('/getUserById', helper.verifyToken, userController.getUserById);
//////
router.post('/startWork', userController.startWork);
router.post('/endWork', userController.endWork);
router.get('/userWorkHistory', userController.userWorkHistory);
router.get('/userContractHistory', userController.userContractHistory);


////////feach_ID/////////
router.get('/communityID', helper.verifyToken, communityController.communityID);
router.get('/agenciesID', helper.verifyToken, agenciesController.agenciesID);
router.get('/userID', helper.verifyToken, userController.userID);
//router.get('/projectID', helper.verifyToken, shiftController.projectID);

///////shift/////////
router.post('/addshift', helper.verifyToken, shiftController.addshift);
router.post('/editshift', helper.verifyToken, shiftController.editshift);
router.post('/deleteshift', helper.verifyToken, shiftController.deleteshift);
router.get('/getshift', helper.verifyToken, shiftController.getshift);
router.get('/getshiftById', helper.verifyToken, shiftController.getshiftById);
router.get('/getCommunityShifts/:community_id', helper.verifyToken, communityController.getCommunityShift);
router.post('/applyShift', helper.verifyToken, shiftController.applyShiftById);
router.post('/getAppliedShiftById', helper.verifyToken, shiftController.appliedShiftById);
router.post('/startShiftByID', helper.verifyToken, shiftController.startShift)
// ///////Contract/////////
// router.post('/addContract', helper.verifyToken, helper.communityAdminAuthenticator, contractController.addContract);
// router.get('/getContract', helper.verifyToken, contractController.getContract);
// router.get('/getContractById', helper.verifyToken, contractController.getContractById);
// router.post('/assignContract', helper.verifyToken, contractController.assignContract);
// router.get('/getAssignContract', helper.verifyToken, contractController.getAssignContract);

///////updatePASSWORD/////////
router.post('/updateCommunityPassword', helper.communityAuthenticator, communityController.updateCommunityPassword);
router.post('/updateUserPassword', helper.agenciesAuthenticator, userController.updateUserPassword);
router.post('/updateAgenciesPassword', agenciesController.updateAgenciesPassword);

///////Management company/////////
router.post('/addManagement', ManagementController.addManagement);
router.post('/loginManagement', ManagementController.loginManagement);
router.get('/getManagementById', ManagementController.getManagementById);
router.get('/getManagement', ManagementController.getManagement);
router.post('/deleteManagenment', ManagementController.deleteManagenment);
router.get('/getManagementNames', ManagementController.getManagementNames);
router.post('/editManagementByID', ManagementController.editManagementByID);
router.get('/getMNGTUser', helper.verifyToken, ManagementController.getMNGTUser);

router.get('/getMNMGcommunity', helper.verifyToken, ManagementController.getMNMGcommunity);


module.exports = router;