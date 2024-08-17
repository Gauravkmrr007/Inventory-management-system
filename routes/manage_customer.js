const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});
// add Customer
router.get('/manage_customer/customer', (req, res) => {
  const editUserId = req.query.edit;
  if (editUserId) {
    const sql = 'SELECT * FROM pg_customers WHERE cus_id = ?';
    db.query(sql, [editUserId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('manage_customer/customer', { userData: result[0], message: '', success: true, editMode: true, error: '' });
    });
  } else {
    res.render('manage_customer/customer', { error: '' });
  }
});

router.post('/customer/add', (req, res) => {
  const customerName = req.body.customer_name;
  const customerAddress = req.body.address;
  const customerPhone = req.body.phone_number;
  const customerAadhaar = req.body.aadhaar_number;
  if (!customerName) {
    return res.render('customer', { error: 'customer name is required' });
  }
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM pg_customers WHERE customer_name = ? AND address = ? AND phone_number = ? AND aadhaar_number = ?';
  db.query(checkIfExistsSQL, [customerName, customerAddress, customerPhone, customerAadhaar,], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking if customer exists:', checkErr);
      return res.status(500).send('Internal Server Error');
    }
    if (checkResult[0].count > 0) {
      return res.render('customer', { error: 'customer name already exists' });
    }
    const insertSQL = 'INSERT INTO pg_customers (customer_name, address, phone_number, aadhaar_number) VALUES (?, ?, ?, ?)';
    db.query(insertSQL, [customerName, customerAddress, customerPhone, customerAadhaar], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: customerName, success: true, message: "successfuly added" });
    });
  });
});

// ===================================== CUSTOMER lIST ========================================
router.get('/manage_customer/customer-list', (req, res) => {
  const sql = 'SELECT * FROM pg_customers';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_customer/customer-list', { customer: data, users: data });
  });
});

// start customer route
router.post('/customer-list/add', (req, res) => {
  const customerName = req.body.customer_name;
  const customerAddress = req.body.address;
  const customerPhone = req.body.phone_number;
  const customerAadhaar = req.body.aadhaar_number;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM pg_customers WHERE customer_name = ? AND address = ? AND phone_number = ? AND aadhaar_number = ?';
  db.query(checkIfExistsSQL, [customerName, customerAddress, customerPhone, customerAadhaar], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('manage_customer/customer-list', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'Customer already exists' });
    }
    const insertSQL = 'INSERT INTO pg_customers (customer_name, address, phone_number, aadhaar_number) VALUES (?, ?, ?, ?)';
    db.query(insertSQL, [customerName, customerAddress, customerPhone, customerAadhaar], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ success: true, message: "Customer added Successfully" });
    });
  });
});

// edit & delete route 
router.get('/customer-list/edit/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM pg_customers WHERE cus_id = ?';
  db.query(sql, [customerId], (err, result) => {
    ``
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_customer/customer-list', { customer: result[0], message: '', users: result });
  });
});
router.post('/customer-list/edit/:id', (req, res) => {
  const customerId = req.params.id;
  const updatedCustomer = {
    customer_name: req.body.customer_name,
    address: req.body.address,
    phone_number: req.body.phone_number,
    aadhaar_number: req.body.aadhaar_number,

  };
  const sql = 'UPDATE pg_customers SET ? WHERE cus_id = ?';
  db.query(sql, [updatedCustomer, customerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete Customer route
router.get('/customer-list/delete/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'DELETE FROM pg_customers WHERE cus_id = ?';
  db.query(sql, [customerId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});
module.exports = router;