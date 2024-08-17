var express = require('express');
var https = require('https');
var bodyParser = require('body-parser');
var app = express();
app.use(express.static(__dirname + '/public/assets/dist/css'));
app.use(express.json());
app.use(express.urlencoded());
// Include route files
var index = require('./routes/index');
var masters = require('./routes/masters');
var manage_product = require('./routes/manage_product');
var manage_customer = require('./routes/manage_customer');
var manage_supplier = require('./routes/manage_supplier');
var manage_purchase = require('./routes/manage_purchase');
var manage_sale = require('./routes/manage_sale');
var path=require('path');
app.use('/', index);
app.use('/', masters);
app.use('/', manage_product);
app.use('/', manage_customer);
app.use('/', manage_supplier);
app.use('/', manage_purchase);
app.use('/', manage_sale);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const server = app.listen(3003, () => console.log(`Express server listening on port 3003`));
module.exports = app;
// Assuming you have the following configuration in your main app file.


    










