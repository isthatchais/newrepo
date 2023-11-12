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
router.get("/", utilities.handleErrors(invController.buildManagement));

//Route to build add-classification form
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

//Route to build add-classification form
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

// Process the add-classification data
router.post(
    "/add-classification",
    invValidate.classificationRules(),
    invValidate.checkClassificationData,
    utilities.handleErrors(invController.processClassification)
);

router.post(
    "/add-inventory",
    invValidate.inventoryRules(),
    invValidate.checkInventoryData,
    utilities.handleErrors(invController.processInventory)
);


module.exports = router;