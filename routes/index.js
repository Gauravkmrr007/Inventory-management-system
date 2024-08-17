const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

//Default start page route
router.get('/', (req, res) => {
  const sql = 'SELECT * FROM brand_list';
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('dashboard/dashboard', { users: data, error: '', message: '', successmessage: '' });
  });
});

//start Dashboard route
router.get('/dashboard/dashboard', (req, res) => {
  res.render('dashboard/dashboard', { error: '', message: '', successmessage: '' });
});

module.exports = router;



