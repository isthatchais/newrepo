const invModel = require("../models/inventory-model")
const Util = {}
const jwt = require("jsonwebtoken")
require("dotenv").config()

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}


/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
    let grid
    if(data.length > 0){
      grid = '<ul id="inv-display">'
      data.forEach(vehicle => { 
        grid += '<li class="card">'
        grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
        + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
        + 'details"><img src="' + vehicle.inv_thumbnail 
        +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
        +' on CSE Motors" ></a>'
        grid += '<div class="namePrice">'
        grid += '<hr >'
        grid += '<h2>'
        grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
        + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
        grid += '</h2>'
        grid += '<span>$' 
        + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
        grid += '</div>'
        grid += '</li>'
      })
      grid += '</ul>'
    } else { 
      grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the inventory view HTML
* ************************************ */

  Util.buildInv = async function(data){
    let grid
    let vehicle = data[0]
    if(data.length > 0){
      grid = '<div id="inventory">'
      grid += '<div class="col_one">'
      grid += '<img src="' + vehicle.inv_image +'" alt="Image of '+ vehicle.inv_make 
      + ' ' + vehicle.inv_model +' on CSE Motors" />'
      grid += '</div>'
      grid += '<div class="col_two">'
      grid += '<h2>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</h2>'
      grid += '<div class="info_cols">'
      grid += '<div id="description">'
      grid += '<p> Check out this awesome '+ vehicle.inv_make + ' ' + vehicle.inv_model + ' with only ' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + ' miles for the discounted price of $' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '. ' + vehicle.inv_description 
      + ' Call or stop by today for a one of a kind car byuing experience. 555-555-5555</p> </div>'
      grid += '<table id="information">'
      grid += '<tr>'
      grid += '<th>Price</th><td>$' + new Intl.NumberFormat('en-US').format(vehicle.inv_price) +'</td>'
      grid += '</tr>'
      grid += '<tr>'
      grid += '<th>Make</th><td>' + vehicle.inv_make + '</td>'
      grid += '</tr>'
      grid += '<tr>'
      grid += '<th>Model</th><td>' + vehicle.inv_model + '</td>'
      grid += '</tr>'
      grid += '<tr>'
      grid += '<th>Year</th><td>' + vehicle.inv_year + '</td>'
      grid += '</tr>'
      grid += '<tr>'
      grid += '<th>Mileage</th><td>' + new Intl.NumberFormat('en-US').format(vehicle.inv_miles) + '</td>'
      grid += '</tr>'
      grid += '<tr>'
      grid += '<th>Color</th><td>' + vehicle.inv_color + '</td>'
      grid += '</tr>'
      grid +='</table>'
      grid += '</div>'
      grid += '</div>'
      grid += '</div>'
    } else { 
      grid += '<p class="notice">Sorry, vehicle could not be found.</p>'
    }
    return grid
  }

/* **************************************
* Build the classification List HTML
* ************************************ */
  Util.buildClassificationList = async function(classification_id = null){
    let data = await invModel.getClassificationRows()
    let classificationList = 
      '<select name="classification_id" id="classificationId">'
    classificationList += "<option>Choose a Classification</option>"
    data.forEach(type => {
      classificationList += '<option value="' + type.classification_id +'"'
      if (
        classification_id != null &&
        type.classification_id == classification_id
      ) {
        classificationList += " selected "
      }
      classificationList += ">" + type.classification_name + '</option>'
    })
    classificationList += '</select>'
    return classificationList
  }

 
/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.accountData = accountData
     //console.log(accountData)
     res.locals.loggedin = 1
     next()
    })
  } else {
   next()
  }
 }


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Check account type
 * ************************************ */
Util.checkAccountType = (req, res, next) => {
  if (res.locals.accountData.account_type != 'Client') {
    next()
  } else {
    req.flash("notice", "You cannot access this page.")
    res.clearCookie("jwt")
    return res.redirect("/account/login")
  }
 }


module.exports = Util