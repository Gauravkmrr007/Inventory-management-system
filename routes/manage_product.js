const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const multer = require("multer");
var path = require('path');
const upload = multer({ dest: "product_images" });
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

router.get('/manage_product/add_product', (req, res) => {
  const sql = 'SELECT * FROM product_list';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_product/add_product', { categoryList: data, brandList: data, colorList: data, sizeList: data, });
  });
});

// route for select category & table data 
router.get('/category-list/fetch', (req, res) => {
  const sqlCategoryList = 'SELECT * FROM category_list';
  db.query(sqlCategoryList, (err, categoryListData) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, categoryList: categoryListData });
  });
});

// Route to render select category in the add_product page
router.get('/manage_product/add_product', (req, res) => {
  const sqlCategoryList = 'SELECT * FROM category_list';
  db.query(sqlCategoryList, (errCategoryList, categoryListData) => {
    if (errCategoryList) {
      console.error(errCategoryList);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    const productCategory = 'SELECT product_list.*, category_list.category_name FROM product_list JOIN category_list ON product_list.product_cat_id = category_list.category_id';
    db.query(productCategory, (errSubCategory, subcategoryListData) => {
      if (errSubCategory) {
        console.error(errSubCategory);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }
      res.render('manage_product/add_product', {
        categoryList: categoryListData,
        subcategoryList: subcategoryListData,
        users: [...categoryListData, ...subcategoryListData]
      });
    });
  });
});

// route for select brand & table data 
router.get('/brand-list/fetch', (req, res) => {
  const sqlBrandList = 'SELECT * FROM brand_list';
  db.query(sqlBrandList, (err, brandListData) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, brandList: brandListData, });
  });
});
// Route to render select brand in the add_product page
router.get('/manage_product/add_product', (req, res) => {
  const sqlBrandList = 'SELECT * FROM brand_list';
  db.query(sqlBrandList, (errBrandList, brandListData) => {
    if (errBrandList) {
      console.error(errBrandList);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.render('manage_product/add_product', {
      brandList: brandListData,
      users: [...brandListData]
    });
  });
});

// script for converting original name of the image file into custom name
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    return cb(null, "./public/assets/product_images");
  },
  filename: function (req, file, cb) {
    return cb(null, `${Date.now()}-${file.originalname}`)
  },
});
const fileUpload = multer({ storage: storage });
//

router.post('/product/add', fileUpload.single('product_image'), (req, res) => {
  const brandId = req.body.brand_id;
  const categoryId = req.body.category_id;
  const productName = req.body.product_name;
  const hsnCode = req.body.hsn_code;
  const purchasePrice = req.body.purchase_price;
  const salePrice = req.body.sale_price;
  const productColors = req.body.product_color.join(', '); // Join colors into a string
  const productSizes = req.body.product_size.join(', '); // Join sizes into a string
  const productQuantity = req.body.product_quantity;

  let productImage = null;
  if (req.file) {
    productImage = req.file.filename;
  }

  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM product_list WHERE product_brand_id = ? AND product_cat_id = ? AND product_name = ? AND hsn_code = ? AND purchase_price = ? AND sale_price = ? AND product_quantity = ?';
  db.query(checkIfExistsSQL, [brandId, categoryId, productName, hsnCode, purchasePrice, salePrice, productQuantity], (checkErr, checkResult) => {
    if (checkErr) {
      console.error('Error checking if product exists:', checkErr);
      return res.status(500).send('Internal Server Error');
    }
    if (checkResult[0].count > 0) {
      return res.render('manage_product/add_product', { brandList: [], error: 'Product already exists' });
    }
    const insertSQL = 'INSERT INTO product_list (product_brand_id,product_cat_id,product_name, hsn_code, purchase_price, sale_price, product_image, product_color, product_size, product_quantity) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(insertSQL, [brandId, categoryId, productName, hsnCode, purchasePrice, salePrice, productImage, productColors, productSizes, productQuantity], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ success: true, message: "successfully added" });
    });
  });
});






// ========================================== PRODUCT LIST ======================================
router.get('/manage_product/product_list', (req, res) => {
  const sql = 'SELECT product_list.*, brand_list.brand_name, category_list.category_name ' +
    'FROM product_list ' +
    'JOIN brand_list ON product_list.product_brand_id = brand_list.brand_id ' +
    'JOIN category_list ON product_list.product_cat_id = category_list.category_id';

  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_product/product_list', { product: data, users: data });
  });
});

// edit & delete route 
router.get('/product_list/edit/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT * FROM product_list WHERE product_id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_product/product_list', { product: result[0], message: '', users: result });
  });
});

router.post('/product_list/edit/:id', (req, res) => {
  const productId = req.params.id;
  const updatedProduct = {
    product_name: req.body.product_name,
    hsn_code: req.body.hsn_code,
    purchase_price: req.body.purchase_price,
    sale_price: req.body.sale_price,
    product_color: req.body.product_color,
    product_size: req.body.product_size,
    product_quantity: req.body.product_quantity,
  };
  const sql = 'UPDATE product_list SET ? WHERE product_id = ?';
  db.query(sql, [updatedProduct, productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete Product route
router.get('/product_list/delete/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'DELETE FROM product_list WHERE product_id = ?';
  db.query(sql, [productId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});


// Add a new route for viewing a single product
router.get('/manage_product/view_product/:id', (req, res) => {
  const productId = req.params.id;
  const sql = 'SELECT product_list.*, brand_list.brand_name, category_list.category_name ' +
    'FROM product_list ' +
    'JOIN brand_list ON product_list.product_brand_id = brand_list.brand_id ' +
    'JOIN category_list ON product_list.product_cat_id = category_list.category_id ' +
    'WHERE product_list.product_id = ?';

  db.query(sql, [productId], (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('manage_product/view_product', { user: data[0] });
  });
});
router.use('/static', express.static('public'));
module.exports = router;