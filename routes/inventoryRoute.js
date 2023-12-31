// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const invValidate = require('../utilities/inventory-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build inventory view
router.get("/detail/:invId", utilities.handleErrors(invController.buildByInvId));

//Route to build inventory managment
router.get("/", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.buildManagement));

//Route to build add-classification form
router.get("/add-classification", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.buildAddClassification));

//Route to build add-classification form
router.get("/add-inventory", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.buildAddInventory));

//Route to delever the inventory table to edit and delete
router.get("/getInventory/:classification_id", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.getInventoryJSON));

//Route to delever the edit inventory form
router.get("/edit/:inv_id", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.editInventoryView));

//Route to delever the delete inventory form
router.get("/delete/:inv_id", utilities.checkAccountType, utilities.checkJWTToken, utilities.checkLogin, utilities.handleErrors(invController.deleteView));

// Process the add-classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.processClassification)
);

//proccess the add-inventory data
router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.processInventory)
);

//processed the edit-inventory data
router.post(
    "/update/",
    invValidate.inventoryRules(),
    invValidate.checkUpdateData,
    utilities.handleErrors(invController.updateInventory))

//processed the edit-inventory data
router.post(
    "/delete/",
     utilities.handleErrors(invController.deleteItem))

module.exports = router;