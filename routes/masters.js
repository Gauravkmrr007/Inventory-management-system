const express = require('express');
const router = express.Router();
const mysql = require('mysql2');
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Gaurav@7488",
  database: "stock",
});

// START BRAND-LIST ===============================
// ================================================
router.get('/masters/brand-list', (req, res) => {
  const sql = 'SELECT * FROM brand_list';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/brand-list', { brandList: data, users: data, error: '', message: '' });
  });
});

// add brand to database from brand-list
router.post('/brand-list/add', (req, res) => {
  const brandName = req.body.brand_name;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM brand_list WHERE brand_name = ?';
  db.query(checkIfExistsSQL, [brandName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/brand', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'Brand name already exists' });
    }
    const insertSQL = 'INSERT INTO brand_list (brand_name) VALUES (?)';
    db.query(insertSQL, [brandName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: brandName, success: true, message: "successfuly added" });
    });
  });
});

//brand-list edit & delete
router.get('/brand-list/edit/:id', (req, res) => {
  const brandId = req.params.id;
  const sql = 'SELECT * FROM brand_list WHERE brand_id = ?';
  db.query(sql, [brandId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/brand-list', { brand: result[0], message: '', users: result });
  });
});

// update brand-list data
router.post('/brand-list/edit/:id', (req, res) => {
  const brandId = req.params.id;
  const updatedBrand = {
    brand_name: req.body.brand_name,
  };
  const sql = 'UPDATE brand_list SET ? WHERE brand_id = ?';
  db.query(sql, [updatedBrand, brandId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete brand-list data
router.get('/brand-list/delete/:id', (req, res) => {
  const brandId = req.params.id;
  const sql = 'DELETE FROM brand_list WHERE brand_id = ?';
  db.query(sql, [brandId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});


// START CATEGORY ==============================
// =============================================
router.get('/masters/category', (req, res) => {
  const editUserId = req.query.edit;
  if (editUserId) {
    const sql = 'SELECT * FROM category_list WHERE category_id = ?';
    db.query(sql, [editUserId], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Internal Server Error');
      }
      res.render('masters/category', { userData: result[0], message: '', editMode: true, error: '' });
    });
  } else {
    res.render('masters/category', { error: '' });
  }
});

// add category to database from category-list
router.post('/category-list/add', (req, res) => {
  const categoryName = req.body.category_name;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM category_list WHERE category_name = ?';
  db.query(checkIfExistsSQL, [categoryName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/category', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'Category name already exists' });
    }
    const insertSQL = 'INSERT INTO category_list (category_name) VALUES (?)';
    db.query(insertSQL, [categoryName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: categoryName, success: true, message: "Successfuly added" });
    });
  });
});
// START CATEGORY-LIST =============================
// =================================================
router.get('/masters/category-list', (req, res) => {
  const sql = 'SELECT * FROM category_list';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/category-list', { categoryList: data, users: data, error: '', message: '' });
  });
});

// edit & delete route 
router.get('/category-list/edit/:id', (req, res) => {
  const categoryId = req.params.id;
  const sql = 'SELECT * FROM category_list WHERE category_id = ?';
  db.query(sql, [categoryId], (err, result) => {
    ``
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/category-list', { category: result[0], message: '', users: result });
  });
});

// update category-list
router.post('/category-list/edit/:id', (req, res) => {
  const categoryId = req.params.id;
  const updatedcategory = {
    category_name: req.body.category_name,
  };
  const sql = 'UPDATE category_list SET ? WHERE category_id = ?';
  db.query(sql, [updatedcategory, categoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete category
router.get('/category-list/delete/:id', (req, res) => {
  const categoryId = req.params.id;
  const sql = 'DELETE FROM category_list WHERE category_id = ?';
  db.query(sql, [categoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });

  });
});


// START SUBCATEGORY ==============================
// ================================================
router.get('/masters/sub-category', (req, res) => {
  const sqlCategoryList = 'SELECT * FROM category_list';
  db.query(sqlCategoryList, (errCategoryList, categoryListData) => {
    if (errCategoryList) {
      console.error(errCategoryList);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    const subcategoryList = 'SELECT sub_category.*, category_list.category_name FROM sub_category JOIN category_list ON sub_category.cat_id = category_list.category_id';
    db.query(subcategoryList, (errSubCategory, subcategoryListData) => {
      if (errSubCategory) {
        console.error(errSubCategory);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
      }

      res.render('masters/sub-category', {
        categoryList: categoryListData,
        subcategoryList: subcategoryListData,
        users: [...categoryListData, ...subcategoryListData]
      });
    });
  });
});

// add SUB-category to database from subcategory-list
router.post('/sub-category/add', (req, res) => {
  const cat_id = req.body.category_name;
  const subcategoryName = req.body.subcategory_name;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM sub_category WHERE subcategory_name = ?';
  db.query(checkIfExistsSQL, [subcategoryName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/sub-category', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'subcategory name already exists' });
    }
    const insertSQL = 'INSERT INTO sub_category (cat_id,subcategory_name) VALUES (?,?)';
    db.query(insertSQL, [cat_id, subcategoryName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: subcategoryName, success: true, message: 'Successfully added' });
    });
  });
});

// edit & delete route
router.get('/sub-category/edit/:id', (req, res) => {
  const subcategoryId = req.params.id;
  const sql = 'SELECT * FROM sub_category WHERE sub_id = ?';
  db.query(sql, [subcategoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/sub-category', { subcategory: result[0], message: '' });
  });
});
// update subcategory list
router.post('/sub-category/edit/:id', (req, res) => {
  const subcategoryId = req.params.id;
  const updatedsubcategory = {
    subcategory_name: req.body.subcategory_name,
  };
  const sql = 'UPDATE sub_category SET ? WHERE sub_id = ?';
  db.query(sql, [updatedsubcategory, subcategoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete subcategory
router.get('/sub-category/delete/:id', (req, res) => {
  const subcategoryId = req.params.id;
  const sql = 'DELETE FROM sub_category WHERE sub_id = ?';
  db.query(sql, [subcategoryId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});



// ===================================== COLOR route  ========================================
router.post('/color/add', (req, res) => {
  const colorName = req.body.color_name;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM color WHERE color_name = ?';
  db.query(checkIfExistsSQL, [colorName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/color', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'color name already exists' });
    }
    // color name does not exist, proceed with insertion
    const insertSQL = 'INSERT INTO color (color_name) VALUES (?)';
    db.query(insertSQL, [colorName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: colorName, success: true, message: "Successfuly added" });
    });
  });
});
// add color route 
router.get('/masters/color', (req, res) => {
  const sql = 'SELECT * FROM color';
  db.query(sql, (err, data) => {
    if (err) {

      return res.status(500).send('Internal Server Error');
    }

    res.render('masters/color', { color: data, users: data, error: '', message: '' });
  });
});
// edit & delete route
router.get('/color/edit/:id', (req, res) => {
  const colorId = req.params.id;
  const sql = 'SELECT * FROM color WHERE color_id = ?';
  db.query(sql, [colorId], (err, result) => {
    ``
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/color', { color: result[0], message: '', users: result });
  });
});
router.post('/color/edit/:id', (req, res) => {
  const colorId = req.params.id;
  const updatedColor = {
    color_name: req.body.color_name,
  };
  const sql = 'UPDATE color SET ? WHERE color_id = ?';
  db.query(sql, [updatedColor, colorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});
// Delete color route
router.get('/color/delete/:id', (req, res) => {
  const colorId = req.params.id;
  const sql = 'DELETE FROM color WHERE color_id = ?';
  db.query(sql, [colorId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});


// ===================================== SIZE Route ========================================
router.get('/masters/size', (req, res) => {
  const sql = 'SELECT * FROM size';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/size', { size: data, users: data, error: '', message: '' });
  });

});

// add size route
router.post('/size/add', (req, res) => {
  const sizeName = req.body.size_name;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM size WHERE size_name = ?';
  db.query(checkIfExistsSQL, [sizeName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/size', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'size name already exists' });
    }
    // size name does not exist, proceed with insertion
    const insertSQL = 'INSERT INTO size (size_name) VALUES (?)';
    db.query(insertSQL, [sizeName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: sizeName, success: true, message: "Successfuly added" });
    });
  });
});

// edit & delete route 
router.get('/size/edit/:id', (req, res) => {
  const sizeId = req.params.id;
  const sql = 'SELECT * FROM size WHERE size_id = ?';
  db.query(sql, [sizeId], (err, result) => {
    ``
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/size', { size: result[0], message: '', users: result });
  });
});
router.post('/size/edit/:id', (req, res) => {
  const sizeId = req.params.id;
  const updatedSize = {
    size_name: req.body.size_name,
  };
  const sql = 'UPDATE size SET ? WHERE size_id = ?';
  db.query(sql, [updatedSize, sizeId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete size route
router.get('/size/delete/:id', (req, res) => {
  const sizeId = req.params.id;
  const sql = 'DELETE FROM size WHERE size_id = ?';
  db.query(sql, [sizeId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});

// ===================================== DISCOUNT Route ========================================
router.get('/masters/discount', (req, res) => {
  const sql = 'SELECT * FROM discount';
  db.query(sql, (err, data) => {
    if (err) {
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/discount', { discountList: data, users: data, error: '', message: '' });
  });
});

// add discount to database from discount
router.post('/discount/add', (req, res) => {
  const discountName = req.body.discount_value;
  const checkIfExistsSQL = 'SELECT COUNT(*) as count FROM discount WHERE discount_value = ?';
  db.query(checkIfExistsSQL, [discountName], (checkErr, checkResult) => {
    if (checkErr) {
      return res.status(500).render('masters/discount', { server_error: 'Internal Server Error' });
    }
    if (checkResult[0].count > 0) {
      return res.json({ already_error: 'discount name already exists' });
    }
    const insertSQL = 'INSERT INTO discount (discount_value) VALUES (?)';
    db.query(insertSQL, [discountName], (insertErr, result) => {
      if (insertErr) {
        console.error('Error executing MySQL query:', insertErr);
        return res.status(500).send('Internal Server Error');
      }
      res.json({ dataother: discountName, success: true, message: "successfuly added" });
    });
  });
});

//discount edit & delete
router.get('/discount/edit/:id', (req, res) => {
  const discountId = req.params.id;
  const sql = 'SELECT * FROM discount WHERE discount_id = ?';
  db.query(sql, [discountId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Internal Server Error');
    }
    res.render('masters/discount', { discount: result[0], message: '', users: result });
  });
});

// update discount data
router.post('/discount/edit/:id', (req, res) => {
  const discountId = req.params.id;
  const updatedDiscount = {
    discount_value: req.body.discount_value,
  };
  const sql = 'UPDATE discount SET ? WHERE discount_id = ?';
  db.query(sql, [updatedDiscount, discountId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Updated successfully' });
  });
});

// Delete discount data
router.get('/discount/delete/:id', (req, res) => {
  const discountId = req.params.id;
  const sql = 'DELETE FROM discount WHERE discount_id = ?';
  db.query(sql, [discountId], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
    res.json({ success: true, message: 'Deleted successfully' });
  });
});
module.exports = router;