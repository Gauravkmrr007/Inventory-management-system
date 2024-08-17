// <!-- excel converter script -->
$(function () {
  $("#example1").DataTable({
    "responsive": true, "lengthChange": false, "autoWidth": false,
    "buttons": ["excel"]
  }).buttons().container().appendTo('#example1_wrapper .col-md-6:eq(0)');
  $('#example2').DataTable({
    "paging": true,
    "lengthChange": false,
    "searching": false,
    "ordering": true,
    "info": true,
    "autoWidth": false,
    "responsive": true,
  });
});

// select dropdown script
$(function () {
  $('.select2').select2()
});

//  choose image script 
$(function () {
  bsCustomFileInput.init();
});

// table row display function
function showEditForm(userId) {
  document.getElementById('edit-form-' + userId).style.display = 'table-row';
}

// show message after deletion and updation
function showMessageAfterReload(type, message) {
  setTimeout(function () {
    showMessage(type, message);
  }, 500);
}
function showMessage(type, text) {
  var messageContainer = $("#messageContainer");
  var alertClass = 'alert-' + type;
  var alertElement = $('<div class="alert ' + alertClass + ' alert-dismissible fade show" role="alert">' +
    '<strong>' + text + '</strong>' +
    '<button type="button" class="close" data-dismiss="alert" aria-label="Close">' +
    '<span aria-hidden="true">&times;</span></button></div>');

  messageContainer.empty().append(alertElement);
  setTimeout(function () {
    messageContainer.empty();
  }, 2000);
}


function validateInput(input, minLength, maxLength) {
  input.value = input.value.replace(/\D/g, '');
  const inputValueLength = input.value.length;

  if (inputValueLength > maxLength) {
    input.value = input.value.slice(0, maxLength);
  }
  const errorMessage = `Please enter at least ${minLength} digits.`;
  input.setCustomValidity(inputValueLength < minLength ? errorMessage : '');
}
function validatePhoneNumber(input) {
  validateInput(input, 10, 10);
}
function validateAadhaarNumber(input) {
  validateInput(input, 12, 12);
}

// PAGE SPECIFIC SCRIPTS START ================================
// ============================================================
// MASTERS
// ============================================================

//======================================= BRAND SCRIPTS, add, update, delete ====================
function addBrand() {
  var brandName = $("#addBrandName").val();
  var addFormId = "#addBrandForm";
  $(".responseloader").show();

  $.ajax({
    url: "/brand-list/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Brand added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Brand name already exists ' + data.message);
      }
    }
  });
}


function updateBrand(userId) {
  var brandName = $("#editBrandName" + userId).val();
  var editFormId = "#editBrandForm" + userId;
  $(".responseloader").show();
  $.ajax({
    url: "/brand-list/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Brand updated successfully');
        }, 2000);
        showMessageAfterReload('success', 'Brand updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update brand. ' + data.message);
      }
    }
  });
}

// ===================== delete script =====================
function deleteBrand(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/brand-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Brand deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to delete brand. ' + data.message);
      }
    }
  });
}


//======================================= CATEGORY SCRIPTS, add, update, delete ====================
function addCategory() {
  var categoryName = $("#addcategoryName").val();
  var addFormId = "#addcategoryForm";
  $(".responseloader").show();
  $.ajax({
    url: "/category-list/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Category added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Category name already exists!. ' + data.message);
      }
    }
  });
}

function updatecategory(userId) {
  var categoryName = $("#editcategoryName" + userId).val();
  var editFormId = "#editcategoryForm" + userId;
  $(".responseloader").show();
  $.ajax({
    url: "/category-list/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'category updated successfully');
        }, 2000);
        showMessageAfterReload('success', 'category updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update category. ' + data.message);
      }
    }
  });
}

function deletecategory(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/category-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'category deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to delete category. ' + data.message);
      }
    }
  });

}
//======================================= SUBCATEGORY SCRIPTS, add, update, delete ====================

// add subcategory list  
function addsubcategory() {
  var subcategoryName = $("#addsubcategoryName").val();
  var addFormId = "#addsubcategoryForm";
  $(".responseloader").show();
  $.ajax({
    url: "/sub-category/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'subcategory added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', ' Subcategory name already exists!. ' + data.message);
      }
    }
  });
}

// Fetch category names and populate the dropdown when the modal is shown
$(document).ready(function () {
  $('#addSubCategoryModel').on('show.bs.modal', function () {
    $.ajax({
      url: '/sub-category',
      method: 'GET',
      dataType: 'JSON',
      success: function (data) {
        if (data.success) {
          console.log(data);
          $('#categoryId').empty();
          $('#categoryId').append('<option value="" disabled selected>Select Category</option>');
          $.each(data.categoryList, function (index, category) {
            $('#categoryId').append('<option value=' + category.category_id + '>' +
              category.category_name + '</option>');
          });
        } else {
          console.error('Failed to fetch Categories.');
        }
      },
    });
    $('#categoryId').on('change', function () {
      var selectedCategoryId = $(this).val();
      $('#selectedCategoryId').val(selectedCategoryId);
    });
  });
});

function updatesubcategory(userId) {
  var subcategoryName = $("#editsubcategoryName" + userId).val();
  var editFormId = "#editsubcategoryForm" + userId;
  $(".responseloader").show();
  $.ajax({
    url: "/sub-category/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'subcategory updated successfully');
        }, 2000);
        showMessageAfterReload('success', 'subcategory updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update subcategory. ' + data.message);
      }
    }
  });
}
// ============================ delete subcategory-form loader and message =========================
function deletesubcategory(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/sub-category/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'subcategory deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to delete subcategory. ' + data.message);
      }
    }
  });
}

//======================================= COLOR SCRIPTS, add, update, delete ====================
function addColor() {
  var brandName = $("#addColorName").val();
  var addFormId = "#addColorForm";
  $(".responseloader").show();

  $.ajax({
    url: "/color/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Brand added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to add brand. ' + data.message);
      }
    }
  });
}

function updateColor(userId) {
  var colorName = $("#editColorName" + userId).val();
  var editFormId = "#editColorForm" + userId;

  $(".responseloader").show();
  $.ajax({
    url: "/color/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Brand updated successfully');
        }, 2000);

        showMessageAfterReload('success', 'Brand updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update brand. ' + data.message);
      }
    }
  });
}

function deleteColor(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/color/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Brand deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Color. ' + data.message);
      }
    }
  });
}

// ============================================= SIZE SCRIPTS, add, update, delete ====================================
function addSize() {
  var sizeName = $("#addSizeName").val();
  var addFormId = "#addSizeForm";
  $(".responseloader").show();

  $.ajax({
    url: "/size/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Size added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Same size Already Exists!');
      }
    }
  });
}

function updateSize(userId) {
  var sizeName = $("#editSizeName" + userId).val();
  var editFormId = "#editSizeForm" + userId;

  $(".responseloader").show();
  $.ajax({
    url: "/size/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Size updated successfully');
        }, 1000);

        showMessageAfterReload('success', 'Size updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Updation Failed. ' + data.message);
      }
    }
  });
}

// ===================== delete script =====================
function deleteSize(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/size/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 1000);
        showMessageAfterReload('danger', 'Size deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Size. ' + data.message);
      }
    }
  });
}


//======================================= DISCOUNT SCRIPTS, add, update, delete ====================
function addDiscount() {
  var brandName = $("#addDiscountName").val();
  var addFormId = "#addDiscountForm";
  $(".responseloader").show();

  $.ajax({
    url: "/discount/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Discount added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Discount name already exists ' + data.message);
      }
    }
  });
}


function updateDiscount(userId) {
  var discount = $("#editDiscountName" + userId).val();
  var editFormId = "#editDiscountForm" + userId;
  $(".responseloader").show();
  $.ajax({
    url: "/discount/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Discount updated successfully');
        }, 2000);
        showMessageAfterReload('success', 'Discount updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update Discount. ' + data.message);
      }
    }
  });
}

// ===================== delete script =====================
function deleteDiscount(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/discount/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Discount deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to delete Discount. ' + data.message);
      }
    }
  });
}


// ============================================================
// MANAGE PRODUCT 
// ============================================================

// ============================================= Add PRODUCT ====================================
document.addEventListener('DOMContentLoaded', function () {
  $.ajax({
    url: '/category-list/fetch',
    method: 'GET',
    dataType: 'JSON',
    success: function (data) {
      if (data.success) {
        console.log(data);
        $('#categoryId').empty();
        $('#categoryId').append('<option value="" disabled selected>Select Category</option>');
        $.each(data.categoryList, function (index, category) {
          $('#categoryId').append('<option value=' + category.category_id + '>' +
            category.category_name + '</option>');
        });
      } else {
        console.error('Failed to fetch Categories.');
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX Request Error:', status, error);
    }
  });

  $('#categoryId').on('change', function () {
    var selectedCategoryId = $(this).val();
    $('#selectedCategoryId').val(selectedCategoryId);
  });
});
// ============ brand list controller for fetching data
document.addEventListener('DOMContentLoaded', function () {
  $.ajax({
    url: '/brand-list/fetch',
    method: 'GET',
    dataType: 'JSON',
    success: function (data) {
      if (data.success) {
        console.log(data);
        $('#brandId').empty();
        $('#brandId').append('<option value="" disabled selected>Select Brand</option>');
        $.each(data.brandList, function (index, brand) {
          $('#brandId').append('<option value=' + brand.brand_id + '>' +
            brand.brand_name + '</option>');
        });
      } else {
        console.error('Failed to fetch Brands.');
      }
    },
    error: function (xhr, status, error) {
      console.error('AJAX Request Error:', status, error);
    }
  });

  $('#brandId').on('change', function () {
    var selectedbrandId = $(this).val();
    $('#selectedbrandId').val(selectedbrandId);
  });
});


// ================== ADD PRODUCT CONTROLLER FOR SENDING DATA
function addProduct() {
  var form = document.getElementById('addProductForm');
  if (!form.checkValidity()) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
  } else {
    var formData = new FormData(form);

    $(".responseloader").show();
    $.ajax({
      url: "/product/add",
      method: "POST",
      data: formData,
      dataType: "JSON",
      contentType: false, // Important to prevent jQuery from processing the data
      processData: false,
      // Important to prevent jQuery from processing the data
      success: function (data) {
        setTimeout(function () {
          $(".responseloader").hide();
          if (data.success) {
            Swal.fire({
              title: "Pokho Group",
              text: data.message,
              icon: "success"
            }).then(function () {
              location.reload();
            });
          }
        }, 1000);
      }
    });
  }
}




function handleImageChange(input) {
  var file = input.files[0];
  var formData = new FormData();
  formData.append('product_image', file);
  $.ajax({
    url: '/upload-image',
    method: 'POST',
    data: formData,
    contentType: false,
    processData: false,
    success: function (data) {
      console.log('Image uploaded successfully:', data);
    },
    error: function (xhr, status, error) {
      console.error('Image upload failed:', status, error);
    }
  });
}

// ========================================== PRODUCT LIST ===========================================
function updateProduct(userId) {
  var productName = $("#editProductName" + userId).val();
  var editFormId = "#editProductForm" + userId;

  $(".responseloader").show();
  $.ajax({
    url: "/product_list/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Product updated successfully');
        }, 2000);
        showMessageAfterReload('success', 'Product updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update Product. ' + data.message);
      }
    }
  });
}
// ===================== delete script =====================
function deleteProduct(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/product_list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Customer deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Customer. ' + data.message);
      }
    }
  });
}

// ============================================================
// MANAGE CUSTOMER 
// ============================================================

// ============================================= Add CUSTOMER ====================================
function addCustomer() {
  var form = document.getElementById('addCustomerForm');
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
  } else {
    var customer_name = $("#addCustomerName").val();
    var customer_address = $("#addCustomerAddress").val();
    var customer_phone = $("#addCustomerPhone").val();
    var customer_aadhaar = $("#addCustomerAadhaar").val();
    $(".responseloader").show();
    $.ajax({
      url: "/customer/add",
      method: "POST",
      data: {
        customer_name: customer_name,
        address: customer_address,
        phone_number: customer_phone,
        aadhaar_number: customer_aadhaar,
      },
      dataType: "JSON",
      success: function (data) {
        setTimeout(function () {
          $(".responseloader").hide();
          if (data.success) {
            Swal.fire({
              title: "Pokho Group",
              text: data.message,
              icon: "success"
            }).then(function () {
              location.reload();
            });
          }
        }, 1000);
      }
    });
  }
}
// ===========================================CUSTOMER -LIST ==================================
function addCustomerModal() {
  var form = document.getElementById('addCustomerModalForm');
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
  } else {
    var customerName = $("#addCustomerName").val();
    var customerAddress = $("#addCustomerAddress").val();
    var customerPhone = $("#addCustomerPhone").val();
    var customerAadhaar = $("#addCustomerAadhaar").val();
    var addFormId = "#addCustomerForm";
    $(".responseloader").show();

    $.ajax({
      url: "/customer-list/add",
      method: "POST",
      data: $(addFormId).serialize(),
      dataType: "JSON",
      success: function (data) {
        if (data.success) {
          setTimeout(function () {
            $(".responseloader").hide();
            location.reload();
          }, 2000);
          showMessageAfterReload('success', 'Customer details added successfully');
        } else {
          $(".responseloader").hide();
          showMessage('danger', 'Failed to add Customer details. ' + data.message);
        }
      }
    });
  }
}

function updateCustomer(userId) {
  var customerName = $("#editCustomerName" + userId).val();
  var editFormId = "#editCustomerForm" + userId;

  $(".responseloader").show();
  $.ajax({
    url: "/customer-list/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Customer updated successfully');
        }, 2000);

        showMessageAfterReload('success', 'Customer updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update Customer. ' + data.message);
      }
    }
  });
}

function deleteCustomer(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/customer-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Customer deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Customer. ' + data.message);
      }
    }
  });
}

// ============================================================
// MANAGE SUPPLIER 
// ============================================================

// ============================================= Add SUPPLIER ====================================
function addSupplier() {
  var form = document.getElementById('addSupplierForm');
  if (form.checkValidity() === false) {
    event.preventDefault();
    event.stopPropagation();
    form.classList.add('was-validated');
  } else {
    var supplier_name = $("#addSupplierName").val();
    var supplier_address = $("#addSupplierAddress").val();
    var supplier_phone = $("#addSupplierPhone").val();
    var supplier_aadhaar = $("#addSupplierAadhaar").val();
    var supplier_gst = $("#addSupplierGst").val();
    var supplier_state = $("#addSupplierState").val();
    $(".responseloader").show();
    $.ajax({
      url: "/supplier/add",
      method: "POST",
      data: {
        supplier_name: supplier_name,
        address: supplier_address,
        phone_number: supplier_phone,
        aadhaar_number: supplier_aadhaar,
        gst_number: supplier_gst,
        state: supplier_state
      },
      dataType: "JSON",
      success: function (data) {
        setTimeout(function () {
          $(".responseloader").hide();
          if (data.success) {
            Swal.fire({
              title: "Pokho Group",
              text: data.message,
              icon: "success"
            });
            $("#supplier_name").val("");
          } else if (data.aadhaar_exists) {
            $("#error-message").html(data.message);
          } else if (data.server_error) {
            $("#error-message").html(data.server_error);
          } else if (data.already_error) {
            $("#error-message").html(data.already_error);
          }
        }, 1000);
      }
    });
  }
}

// ============================================= SUPPLIER LIST ====================================
function addSupplierList() {
  var SupplierName = $("#addSupplierName").val();
  var SupplierAddress = $("#addSupplierAddress").val();
  var SupplierPhone = $("#addSupplierPhone").val();
  var SupplierAadhaar = $("#addSupplierAadhaar").val();
  var SupplierGST = $("#addSupplierGST").val();
  var SupplierState = $("#addSupplierState").val();
  var addFormId = "#addSupplierForm";
  $(".responseloader").show();

  $.ajax({
    url: "/supplier-list/add",
    method: "POST",
    data: $(addFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('success', 'Supplier details added successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to add Supplier details. ' + data.message);
      }
    }
  });
}

function updateSupplier(userId) {
  var SupplierName = $("#editSupplierName" + userId).val();
  var editFormId = "#editSupplierForm" + userId;

  $(".responseloader").show();
  $.ajax({
    url: "/supplier-list/edit/" + userId,
    method: "POST",
    data: $(editFormId).serialize(),
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
          showMessage('success', 'Supplier updated successfully');
        }, 2000);

        showMessageAfterReload('success', 'Supplier updated successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to update Supplier. ' + data.message);
      }
    }
  });
}

function deleteSupplier(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/supplier-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Supplier deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Supplier. ' + data.message);
      }
    }
  });
}

// ============================================================
// MANAGE PURCHASE 
// ============================================================

// ============================================= Add PURCHASE ====================================
// space for purchase
// ============================================= PURCHASE LIST ==================================== 
function deletePurchase(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/purchase-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Supplier deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Supplier. ' + data.message);
      }
    }
  });
}


// ============================================================
// MANAGE SALE 
// ============================================================

// ============================================= Add SALE ====================================
// space for add sale

// ============================================= SALE LIST ==================================== 
function deleteSale(userId) {
  $(".responseloader").show();
  $.ajax({
    url: "/sale-list/delete/" + userId,
    method: "GET",
    dataType: "JSON",
    success: function (data) {
      if (data.success) {
        setTimeout(function () {
          $(".responseloader").hide();
          location.reload();
        }, 2000);
        showMessageAfterReload('danger', 'Supplier deleted successfully');
      } else {
        $(".responseloader").hide();
        showMessage('danger', 'Failed to Delete Supplier. ' + data.message);
      }
    }
  });
}

