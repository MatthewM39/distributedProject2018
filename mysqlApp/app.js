var mysql = require('mysql')
var express = require('express')
var app = express()
var myconnection = require('express-myconnection')
var expressvalidator = require('express-validator')
var bodyparser = require('body-parser')
require('ejs')
var config = require('./config')
var dbInfo = {
  host: 'donuts541.cujubf1hnrg2.us-east-2.rds.amazonaws.com',
  user: 'Donuts541App',
  password: config.password,
  database: 'Donuts541DB'
}


// Customer, Employee, Item, Order, Order_Item
// Customer: Name, Address, id
// Employee: Id, Name, Code, Address,
// Item: Id, Name, Code, Price
// Order: Id, Created_DtTm, Customer_Id, Delivery_DtTm, Employee_Id
// Order_Item: Id, Order_Id, Item_Id, Item_Count

app.use(myconnection(mysql, dbInfo, 'pool'))

app.set('port', (process.env.PORT || 8080))

var index = require('./routes/index')
var items = require('./routes/items')
var employees = require('./routes/employees')
var customers = require('./routes/customers')
// View Engine
app.set('view engine', 'ejs')
app.use(expressvalidator())

app.use(bodyparser.urlencoded({ extended: true }))
app.use(bodyparser.json())

var methodOverride = require('method-override')

app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    var method = req.body._method
    delete req.body._method
    return method
  }
}))


app.use('/', index)
app.use('/items', items)
app.use('/employees', employees)
app.use('/customers', customers)


app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});