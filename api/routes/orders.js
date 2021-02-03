const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth");
const Order = require("../models/order");
const Product = require("../models/product");
const OrderController = require("../controllers/orders");

// view all orders
router.get("/", checkAuth, OrderController.orders_get_all);
// create order
router.post("/", checkAuth, OrderController.orders_create_order);
// get individual order
router.get("/:orderId", checkAuth, OrderController.orders_get_order);
// delete orders
router.delete("/:orderId", checkAuth, OrderController.orders_delete_order);

module.exports = router;