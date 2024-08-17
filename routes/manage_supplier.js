const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

// add Supplier
router.get('/manage_supplier/supplier', (req, res) => {
    const editUserId = req.query.edit;
    if (editUserId) {
      const sql = 'SELECT * FROM pg_suppliers WHERE sup_id = ?';
      db.query(sql, [editUserId], (err, result) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        res.render('supplier', { userData: result[0], message: '', success: true, editMode: true, error: '' });
      });
    } else {
      res.render('manage_supplier/supplier', { error: '' });
    }
  });
  
  router.post('/supplier/add', (req, res) => {
    const supplierName = req.body.supplier_name;
    const supplierAddress = req.body.address;
    const supplierPhone = req.body.phone_number;
    const supplierAadhaar = req.body.aadhaar_number;
    const supplierGst = req.body.gst_number;
    const supplierState = req.body.state;
    if (!supplierName) {
      return res.render('manage_supplier/supplier', { error: 'supplier name is required' });
    }
    const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM pg_suppliers WHERE supplier_name = ? AND address = ? AND phone_number = ? AND aadhaar_number = ? AND gst_number = ? AND state = ?';
    db.query(checkIfExistsSQL, [supplierName, supplierAddress, supplierPhone, supplierAadhaar, supplierGst, supplierState], (checkErr, checkResult) => {
      if (checkErr) {
        console.error('Error checking if supplier exists:', checkErr);
        return res.status(500).send('Internal Server Error');
      }
      if (checkResult[0].count > 0) {
        return res.render('manage_supplier/supplier', { error: 'supplier name already exists' });
      }
      const insertSQL = 'INSERT INTO pg_suppliers (supplier_name, address, phone_number, aadhaar_number,gst_number,state) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertSQL, [supplierName, supplierAddress, supplierPhone, supplierAadhaar, supplierGst, supplierState], (insertErr, result) => {
        if (insertErr) {
          console.error('Error executing MySQL query:', insertErr);
          return res.status(500).send('Internal Server Error');
        }
        res.json({ dataother: supplierName, success: true, message: "Supplier added Successfully." });
      });
    });
  });
  
  
  
  // ======================================== SUPPLIER-LIST Routes =============================================
  router.get('/manage_supplier/supplier-list', (req, res) => {
    const sql = 'SELECT * FROM pg_suppliers';
    db.query(sql, (err, data) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      res.render('manage_supplier/supplier-list', { supplier: data, users: data });
    });
  });
  
  // add supplier-list route (for popup-modal and inserting)
  router.post('/supplier-list/add', (req, res) => {
    const supplierName = req.body.supplier_name;
    const supplierAddress = req.body.address;
    const supplierPhone = req.body.phone_number;
    const supplierAadhaar = req.body.aadhaar_number;
    const supplierGst = req.body.gst_number;
    const supplierState = req.body.state;
    const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM pg_suppliers WHERE supplier_name = ? AND address = ? AND phone_number = ? AND aadhaar_number = ? AND gst_number = ? AND state = ?';
  
    db.query(checkIfExistsSQL, [supplierName, supplierAddress, supplierPhone, supplierAadhaar, supplierGst, supplierState], (checkErr, checkResult) => {
      if (checkErr) {
        return res.status(500).render('manage_supplier/supplier-list', { server_error: 'Internal Server Error' });
      }
      if (checkResult[0].count > 0) {
        return res.json({ already_error: 'supplier already exists' });
      }
      // supplier does not exist, proceed with insertion
      const insertSQL = 'INSERT INTO pg_suppliers (supplier_name, address, phone_number, aadhaar_number,gst_number,state) VALUES (?, ?, ?, ?, ?, ?)';
      db.query(insertSQL, [supplierName, supplierAddress, supplierPhone, supplierAadhaar, supplierGst, supplierState], (insertErr, result) => {
        if (insertErr) {
          console.error('Error executing MySQL query:', insertErr);
          return res.status(500).send('Internal Server Error');
        }
        res.json({ success: true, message: "Successfully added." });
      });
    });
  });
  
  // edit & delete route 
  router.get('/supplier-list/edit/:id', (req, res) => {
    const supplierId = req.params.id;
    const sql = 'SELECT * FROM pg_suppliers WHERE sup_id = ?';
    db.query(sql, [supplierId], (err, result) => {
      ``
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('manage_supplier/supplier-list', { supplier: result[0], message: '', users: result });
    });
  });
  
  router.post('/supplier-list/edit/:id', (req, res) => {
    const supplierId = req.params.id;
    const updatedSupplier = {
      supplier_name: req.body.supplier_name,
      address: req.body.address,
      phone_number: req.body.phone_number,
      aadhaar_number: req.body.aadhaar_number,
      gst_number: req.body.gst_number,
      state: req.body.state,
    };
    const sql = 'UPDATE pg_suppliers SET ? WHERE sup_id = ?';
    db.query(sql, [updatedSupplier, supplierId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.json({ success: true, message: 'Updated successfully' });
    });
  });
  
  // Delete supplier-list route
  router.get('/supplier-list/delete/:id', (req, res) => {
    const supplierId = req.params.id;
    const sql = 'DELETE FROM pg_suppliers WHERE sup_id = ?';
    db.query(sql, [supplierId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.json({ success: true, message: 'Deleted successfully' });
    });
  });
  
module.exports = router;