const invModel = require("../models/inventory-model")
const Util = {}

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

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)


module.exports = Util