// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

//login route
router.get("/login", utilities.checkJWTToken, utilities.handleErrors(accountController.buildLogin));

//register route
router.get("/register", utilities.handleErrors(accountController.buildRegister));

//account management route
router.get("/management", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildManagement));

//account update route
router.get("/update", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildUpdate));

//account logout route
router.get("/logout", utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(accountController.buildLogout));

//register account route
// Process the registration data
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
);

// Process the login attempt
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)

router.post(
    "/update-data",
    regValidate.updateDataRules(),
    regValidate.checkUpdateData,
    utilities.handleErrors(accountController.updateData)
);

router.post(
    "/update-password",
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
    utilities.handleErrors(accountController.updatePassword)
);

module.exports = router;