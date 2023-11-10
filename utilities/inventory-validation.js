const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")


/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isAlpha()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            if (classificationExists){
                throw new Error("Classification exists. ")
            }
    })
    ]
}


/* ******************************
 * Check data and return errors or continue to add-classification
 * ***************************** */
validate.checkClassificationData = async (req, res, next) => {
    const { classification_name } = req.body
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      res.render("inventory/add-classification", {
        errors,
        title: "Add Classification",
        nav,
        classification_name,
      })
      return
    }
    next()
  }
  

/*  **********************************
 *  Inventory Data Validation Rules
 * ********************************* */
validate.inventoryRules = () => {
  return [
    // inventory make is required and must be string minimum length of 3 charicters
    body("inv_make")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle make."), // on error this message is sent.
 
    // inventory make is required and must be string minimum length of 3 charicters
    body("inv_model")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Please provide a vehicle model."), // on error this message is sent.

    // inventory year is required and must be a 4 digit year
    body("inv_year")
      .trim()
      .isNumeric({ no_symbols: true})
      .isInt({ 
        min: 4,
        max: 4,
        allow_leading_zeroes: false})
      .withMessage("Please provide a 4 digit year."), // on error this message is sent.

     // inventory description is required and must be string inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
     body("inv_description")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // inventory image is required and must be string inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id 
    body("inv_image")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Please provide a description.") // on error this message is sent.
  ]
}


/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}


module.exports = validate