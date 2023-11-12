const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const inventoryModel = require("../models/inventory-model")
const invModel = require("../models/inventory-model")


/*  **********************************
 *  Classification Data Validation Rules
 * ********************************* */
validate.classificationRules = () => {
    return [
      // classification name is required and must be string
      body("classification_name")
        .trim()
        .isLength({ min: 3 })
        .matches(/^[a-zA-Z]*$/)
        .withMessage("Please provide a valid classification name.") // on error this message is sent.
        .custom(async (classification_name) => {
            const classificationExists = await inventoryModel.checkExistingClassification(classification_name)
            if (classificationExists){
                throw new Error("Classification exists. ")
            }
    })
    ]
}



//inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id
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
      title: "Add Inventory",
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
      .isLength({ min: 4, max: 4})
      .matches(/^[0-9]{4}?$/)
      .withMessage("Please provide a 4 digit year."), // on error this message is sent.

     // inventory description is required and must be string 
     body("inv_description")
      .trim()
      .isLength({ min: 7 })
      .withMessage("Please provide a description."), // on error this message is sent.

    // inventory image is required and must be string 
    body("inv_image")
      .trim()
      .isLength({ min: 5 })  
      .matches(/^[^\s]+\.(jpg|jpeg|png|gif|bmp)?$/)  //.(?:jpg|gif|png)$  //^[^\s]+\.(jpg|jpeg|png|gif|bmp)$
      .withMessage("Please provide a valid link to the image."), // on error this message is sent.

    body("inv_thumbnail")
      .trim()
      .isLength({ min: 5 })  
      .matches(/^[^\s]+\.(jpg|jpeg|png|gif|bmp)?$/)  //.(?:jpg|gif|png)$  //^[^\s]+\.(jpg|jpeg|png|gif|bmp)$
      .withMessage("Please provide a valid link to the thumbnail."), // on error this message is sent.

    body("inv_price")
      .trim()
      .isLength({ min: 3 })  
      .matches(/^[0-9]\d*(\.\d+)?$/)  //.(?:jpg|gif|png)$  //^[^\s]+\.(jpg|jpeg|png|gif|bmp)$ ^[1-9]\d*(\.\d+)?$ 
      .withMessage("Please provide a valid price."), // on error this message is sent.

    body("inv_miles")
      .trim()
      .notEmpty() 
      .matches(/^[0-9]+$/)  //.(?:jpg|gif|png)$  //^[^\s]+\.(jpg|jpeg|png|gif|bmp)$ ^[1-9]\d*(\.\d+)?$ 
      .withMessage("Please provide valid miles."), // on error this message is sent.

    body("inv_color")
      .trim()
      .isLength({ min: 3 })  
      .withMessage("Please provide valid color."), // on error this message is sent.
    
  ]
}


/* ******************************
* Check data and return errors or continue to registration
* ***************************** */
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const data = await invModel.getClassificationRows()
    let classificationList = await utilities.buildClassificationList(data)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classificationList,
      inv_make, 
      inv_model, 
      inv_year, 
      inv_description, 
      inv_image, 
      inv_thumbnail, 
      inv_price, 
      inv_miles, 
      inv_color, 
      classification_id,
    })
    return
  }
  next()
}


module.exports = validate