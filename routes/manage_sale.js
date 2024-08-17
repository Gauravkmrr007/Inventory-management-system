const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

// add_sale ROUTE
router.get('/manage_sale/add_sale', (req, res) => {
  const sql = 'SELECT * FROM pg_customers';
  const sql2 = 'SELECT * FROM product_list';
  const sql3 = 'SELECT * FROM discount';
  db.query(sql, (err, customerList) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    db.query(sql2, (err, productList) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      db.query(sql3, (err, discountList) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        res.render('manage_sale/add_sale', { sale: {}, customerList: customerList, productList: productList, discountList: discountList });
      });
    });
  });
});

// customer list api for fetching customer details
router.get('/api/customer/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM pg_customers WHERE cus_id = ?';
  db.query(sql, [customerId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    if (data.length === 0) {
      return res.status(404).send('customer not found');
    }
    res.json(data[0]);
  });
});

router.get('/api/saleProduct/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM product_list WHERE product_id = ?';
  db.query(sql, [productId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    if (data.length === 0) {
      return res.status(404).send('product not found');
    }
    res.json(data[0]);
  });
});

router.post('/api/add_sale', (req, res) => {
  const formData = req.body;
  const insertSaleQuery = 'INSERT INTO sale_details (customer_id, payment_method, total_amount) VALUES (?, ?, ?)';
  const saleValues = [
    formData.cus_id,
    formData.payment_method,
    formData.total_amount,
  ];
  // start from here
  db.query(insertSaleQuery, saleValues, (saleError, saleResults) => {
    if (saleError) {
      console.error('Error inserting data into the salee_details table:', saleError);
      return res.status(500).json({ success: false, message: 'Error inserting data into the database' });
    }
    const saleId = saleResults.insertId;
    const items = JSON.parse(formData.tableData);
    if (Array.isArray(items) && items.length > 0) {
      const insertProductQuery = 'INSERT INTO sale_items_details (sale_id, item_hsn_code, item_qty, discount_value, item_price) VALUES ?';
      const itemsValues = items.map(item => [
        saleId,
        item.item_hsn_code,
        item.item_qty,
        item.discount_value,
        item.item_price,
      ]);
      db.query(insertProductQuery, [itemsValues], (productError, productResults) => {
        if (productError) {
          console.error('Error inserting data into the sale_items_details table:', productError);
          return res.status(500).json({ success: false, message: 'Error inserting data into the database' });
        }
        return res.json({ success: true, message: 'Data successfully stored in the database' });
      });
    } else {
      return res.json({ success: true, message: 'Data successfully stored in the database' });
    }
  });
});


// ===================================== SALE LIST
router.get('/manage_sale/sale_list', (req, res) => {
  const sql = 'SELECT sale_details.*, COALESCE(ps.customer_name, sale_details.customer_id) AS customer_name FROM sale_details LEFT JOIN pg_customers ps ON sale_details.customer_id = ps.cus_id';
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_sale/sale_list', { users: data });
  });
});


// Delete sale route
router.get('/sale-list/delete/:id', (req, res) => {
  const saleId = req.params.id;
  const sql = 'DELETE FROM sale_details WHERE s_id = ?';
  db.query(sql, [saleId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});



// ================================= UPDATE SALE ============================================
router.get('/manage_sale/update_sale', (req, res) => {
  const saleId = req.query.id;
  if (saleId) {
    const saleDetailsSql = 'select * from sale_details a left join pg_customers b on a.customer_id=b.cus_id where a.s_id = ?';
    db.query(saleDetailsSql, [saleId], (err, saleData) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      if (saleData.length === 0) {
        return res.status(404).send('sale not found');
      }
      const customerListSql = 'SELECT * FROM pg_customers';
      const productListSql = 'SELECT * FROM product_list';
      const discountListSql = 'SELECT * FROM discount';
      const saleListSql = 'SELECT * FROM sale_items_details WHERE sale_id = ?';
      db.query(customerListSql, (err, customerList) => {
        if (err) {
          console.error(err);
          return res.status(500).send('Internal Server Error');
        }
        db.query(productListSql, (err, productList) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Internal Server Error');
          }
          db.query(discountListSql, (err, discountList) => {
            if (err) {
              console.error(err);
              return res.status(500).send('Internal Server Error');
            }
            db.query(saleListSql, [saleId], (err, saleList) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }
              res.render('manage_sale/update_sale', {
                user: {},
                saleList: saleList,
                sale: saleData[0],
                customerList: customerList,
                productList: productList,
                discountList: discountList
              });
            });
          });
        });
      });
    });
  }
});


// customer list api for fetching customer details
router.get('/api/customerUpdate/:id', (req, res) => {
  const customerId = req.params.id;
  const sql = 'SELECT * FROM pg_customers WHERE cus_id = ?';
  db.query(sql, [customerId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    if (data.length === 0) {
      return res.status(404).send('customer not found');
    }
    res.json(data[0]);
  });
});

// Query For update sale
router.post('/api/update_sale/:id', (req, res) => {
  const saleId = req.params.id;
  const formData = req.body;
  const saleValues = [
    formData.total_amount,
    formData.customer_id,
    formData.payment_method,
    saleId
  ];
  const updateSaleQuery = 'UPDATE sale_details SET total_amount = ?, customer_id = ?, payment_method = ? WHERE s_id = ?';

  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ success: false, message: 'Error starting transaction' });
    }

    // Update sale details
    db.query(updateSaleQuery, saleValues, (saleError, saleResults) => {
      if (saleError) {
        console.error('Error updating sale details:', saleError);
        return db.rollback(() => {
          res.status(500).json({ success: false, message: 'Error updating sale details' });
        });
      }
      const items = JSON.parse(formData.tableData);
      items.forEach(item => {
        const itemValues = [
          item.item_qty,
          item.item_price,
          item.discount_value,
          saleId,
          item.item_hsn_code
        ];
        const checkExistingQuery = 'SELECT COUNT(*) AS rowCount FROM sale_items_details WHERE sale_id = ? AND item_hsn_code = ?';
        db.query(checkExistingQuery, [saleId, item.item_hsn_code], (checkError, checkResults) => {
          if (checkError) {
            console.error('Error checking existing item:', checkError);
            return db.rollback(() => {
              res.status(500).json({ success: false, message: 'Error checking existing item' });
            });
          }

          const rowCount = checkResults[0].rowCount;

          if (rowCount > 0) {
            const updateProductQuery = 'UPDATE sale_items_details SET item_qty = ?, item_price = ?, discount_value = ? WHERE sale_id = ? AND item_hsn_code = ?';
            db.query(updateProductQuery, itemValues, (updateError, updateResults) => {
              if (updateError) {
                console.error('Error updating item:', updateError);
                return db.rollback(() => {
                  res.status(500).json({ success: false, message: 'Error updating item' });
                });
              }
            });

          } else {
            // Insert new item
            const insertProductQuery = 'INSERT INTO sale_items_details (item_qty, item_price, discount_value, sale_id, item_hsn_code) VALUES (?, ?, ?, ?, ?)';
            db.query(insertProductQuery, itemValues, (insertError, insertResults) => {
              if (insertError) {
                console.error('Error inserting item:', insertError);
                return db.rollback(() => {
                  res.status(500).json({ success: false, message: 'Error inserting item' });
                });
              }
            });
          }
        });
      });


      db.commit(err => {
        if (err) {
          console.error('Error committing transaction:', err);
          return res.status(500).json({ success: false, message: 'Error committing transaction' });
        }
        res.status(200).json({ success: true, message: 'sale details updated successfully' });
      });
    });
  });
});



router.post('/api/delete_sale/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = `DELETE FROM sale_items_details WHERE s_item_id = ?`;
  db.query(sql, [itemId], (error, results) => {
    if (error) {
      console.error('Error deleting item from the database:', error);
      return res.status(500).json({ success: false, message: 'Internal server error' });
    }
    if (results.affectedRows > 0) {
      return res.status(200).json({ success: true, message: 'Item deleted successfully' });
    } else {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }
  });
});




module.exports = router;





