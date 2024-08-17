const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

// add_purchase ROUTE
router.get('/manage_purchase/add_purchase', (req, res) => {
  const sql = 'SELECT * FROM pg_suppliers';
  const sql2 = 'SELECT * FROM product_list';
  const sql3 = 'SELECT * FROM discount';

  db.query(sql, (err, supplierList) => {
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
        res.render('manage_purchase/add_purchase', { purchase: {}, supplierList: supplierList, productList: productList, discountList: discountList });
      });
    });
  });
});

// supplier list api for fetching supplier details
router.get('/api/supplier/:id', (req, res) => {
  const supplierId = req.params.id;
  const sql = 'SELECT * FROM pg_suppliers WHERE sup_id = ?';
  db.query(sql, [supplierId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    if (data.length === 0) {
      return res.status(404).send('Supplier not found');
    }
    res.json(data[0]);
  });
});

// product list api
router.get('/api/product/:id', (req, res) => {
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


router.post('/api/add_purchase', (req, res) => {
  const formData = req.body;
  const insertPurchaseQuery = 'INSERT INTO purchase_details (supplier_id, payment_method, total_amount) VALUES (?, ?, ?)';
  const purchaseValues = [
    formData.sup_id,
    formData.payment_method,
    formData.total_amount,
  ];
  db.query(insertPurchaseQuery, purchaseValues, (purchaseError, purchaseResults) => {
    if (purchaseError) {
      console.error('Error inserting data into the purchase_details table:', purchaseError);
      return res.status(500).json({ success: false, message: 'Error inserting data into the database' });
    }
    const purchaseId = purchaseResults.insertId;
    const items = JSON.parse(formData.tableData);
    if (Array.isArray(items) && items.length > 0) {
      const insertProductQuery = 'INSERT INTO purchase_items_details (purchase_id, item_hsn_code, item_qty, discount_value, item_price) VALUES ?';
      const itemsValues = items.map(item => [
        purchaseId,
        item.item_hsn_code,
        item.item_qty,
        item.discount_value,
        item.item_price,
      ]);
      db.query(insertProductQuery, [itemsValues], (productError, productResults) => {
        if (productError) {
          console.error('Error inserting data into the purchase_items_details table:', productError);
          return res.status(500).json({ success: false, message: 'Error inserting data into the database' });
        }
        return res.json({ success: true, message: 'Data successfully stored in the database' });
      });
    } else {
      return res.json({ success: true, message: 'Data successfully stored in the database' });
    }
  });
});


// ======================================== PURCHASE-LIST Routes =============================================

router.get('/manage_purchase/purchase_list', (req, res) => {
  const sql = 'SELECT purchase_details.*, ps.supplier_name FROM purchase_details purchase_details JOIN pg_suppliers ps ON purchase_details.supplier_id = ps.sup_id';
  db.query(sql, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_purchase/purchase_list', { users: data });
  });
});

// Delete purchase route
router.get('/purchase-list/delete/:id', (req, res) => {
  const purchaseId = req.params.id;
  const sql = 'DELETE FROM purchase_details WHERE p_id = ?';
  db.query(sql, [purchaseId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});


// ================================= UPDATE PURCHASE ============================================
router.get('/manage_purchase/update_purchase', (req, res) => {
  const purchaseId = req.query.id;
  if (purchaseId) {
    const purchaseDetailsSql = 'select * from purchase_details a left join pg_suppliers b on a.supplier_id=b.sup_id where a.p_id = ?';
    db.query(purchaseDetailsSql, [purchaseId], (err, purchaseData) => {
      if (err) {
        return res.status(500).send('Internal Server Error');
      }
      if (purchaseData.length === 0) {
        return res.status(404).send('Purchase not found');
      }
      const supplierListSql = 'SELECT * FROM pg_suppliers';
      const productListSql = 'SELECT * FROM product_list';
      const discountListSql = 'SELECT * FROM discount';
      const purchaseListSql = 'SELECT * FROM purchase_items_details WHERE purchase_id = ?';
      db.query(supplierListSql, (err, supplierList) => {
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
            db.query(purchaseListSql, [purchaseId], (err, purchaseList) => {
              if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
              }
              res.render('manage_purchase/update_purchase', {
                user: {},
                purchaseList: purchaseList,
                purchase: purchaseData[0],
                supplierList: supplierList,
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



// Query For update purchase
router.post('/api/update_purchase/:id', (req, res) => {
  const purchaseId = req.params.id;
  const formData = req.body;
  const purchaseValues = [
    formData.total_amount,
    formData.supplier_id,
    formData.payment_method,
    purchaseId
  ];
  const updatePurchaseQuery = 'UPDATE purchase_details SET total_amount = ?, supplier_id = ?, payment_method = ? WHERE p_id = ?';

  // Begin transaction
  db.beginTransaction(err => {
    if (err) {
      console.error('Error starting transaction:', err);
      return res.status(500).json({ success: false, message: 'Error starting transaction' });
    }

    // Update purchase details
    db.query(updatePurchaseQuery, purchaseValues, (purchaseError, purchaseResults) => {
      if (purchaseError) {
        console.error('Error updating purchase details:', purchaseError);
        return db.rollback(() => {
          res.status(500).json({ success: false, message: 'Error updating purchase details' });
        });
      }

      // Parse items data

      const items = JSON.parse(formData.tableData);

      // Process each item
      items.forEach(item => {
        const itemValues = [
          item.item_qty,
          item.item_price,
          item.discount_value,
          purchaseId,
          item.item_hsn_code
        ];

        // Check if item already exists
        const checkExistingQuery = 'SELECT COUNT(*) AS rowCount FROM purchase_items_details WHERE purchase_id = ? AND item_hsn_code = ?';
        db.query(checkExistingQuery, [purchaseId, item.item_hsn_code], (checkError, checkResults) => {
          if (checkError) {
            console.error('Error checking existing item:', checkError);
            return db.rollback(() => {
              res.status(500).json({ success: false, message: 'Error checking existing item' });
            });
          }

          const rowCount = checkResults[0].rowCount;

          if (rowCount > 0) {
            const updateProductQuery = 'UPDATE purchase_items_details SET item_qty = ?, item_price = ?, discount_value = ? WHERE purchase_id = ? AND item_hsn_code = ?';
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
            const insertProductQuery = 'INSERT INTO purchase_items_details (item_qty, item_price, discount_value, purchase_id, item_hsn_code) VALUES (?, ?, ?, ?, ?)';
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
        res.status(200).json({ success: true, message: 'Purchase details updated successfully' });
      });
    });
  });
});

// supplier list api for fetching supplier details
router.get('/api/supplierUpdate/:id', (req, res) => {
  const supplierId = req.params.id;
  const sql = 'SELECT * FROM pg_suppliers WHERE sup_id = ?';
  db.query(sql, [supplierId], (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    if (data.length === 0) {
      return res.status(404).send('Supplier not found');
    }
    res.json(data[0]);
  });
});


router.post('/api/delete_purchase/:id', (req, res) => {
  const itemId = req.params.id;
  const sql = `DELETE FROM purchase_items_details WHERE p_item_id = ?`;
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





