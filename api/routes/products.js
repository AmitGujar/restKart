const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");
const checkAuth = require("../middleware/check-auth");
const ProductController = require("../controllers/products");
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
// image filter
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    // reject a file
    cb(new Error("Only jpg or png files are supported"), false);
  }
};
// upload rules
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5,
  },
  fileFilter: fileFilter,
});

const Product = require("../models/product");
// show all products
router.get("/", ProductController.products_get_all);
// storing product
router.post(
  "/",
  checkAuth,
  upload.single("productImage"),
  ProductController.products_create_product
);

// fetching product by ID
router.get("/:productId", ProductController.products_get_one);

//updating products
router.patch(
  "/:productId",
  checkAuth,
  ProductController.products_update_product
);

// deleting product by id
router.delete("/:productId", checkAuth, ProductController.products_delete);

module.exports = router;
