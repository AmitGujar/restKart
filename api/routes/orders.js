const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const checkAuth = require("../middleware/check-auth")
const Order = require("../models/order");
const Product = require("../models/product");

// view all orders
router.get("/", checkAuth, (req, res, next) => {
    Order.find()
    .select("_id product quantity")
    .populate("product", "name")
    .exec()
    .then(docs =>{
        res.status(200).json({
            count: docs.length,
            orders: docs.map(doc => {
              return {
                _id: doc._id,
                product: doc.product,
                quantity: doc.quantity,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/orders/" + doc._id
                }
              }  
            })
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
// create order
router.post("/", checkAuth, (req, res, next) => {
    Product.findById(req.body.productId)
    .then(product => {
        if (!product) {
            return res.status(404).json({
                message:"product not found"
            });
        }
        const order = new Order({
            _id: mongoose.Types.ObjectId(),
            quantity: req.body.quantity,
            product: req.body.productId, 
        });
        return order.save()
    })
    .then(result => {
        console.log(result);
        res.status(201).json({
            message:"Order created successfully",
            createdOrder: {
                _id: result._id,
                quantity: result.quantity,
                product: result.product
            },
            request: {
                type:"GET",
                url:"http://localhost:3000/orders/" + result._id
            }
        });
    }) 
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
// get individual order
router.get("/:orderId", checkAuth, (req, res, next) => {
    Order.findById(req.params.orderId)
    .populate("product")
    .exec()
    .then(order => {
        if (order === null) {
            return res.status(404).json({
                message:"order not found"
            });
        }
        res.status(200).json({
            order: order,
            request: {
                type: "GET",
                url: "http://localhost:3000/orders/",
                description: "get all orders"
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    })
});
// delete orders
router.delete("/:orderId", checkAuth, (req, res, next) => {
    Order.remove({_id: req.params.orderId})
    .exec()
    .then(result => {
        res.status(200).json({
            message:"Order deleted successfully",
            request: {
                type: "POST",
                url: "http://localhost:3000/orders/",
                description: "create new order",
                body : {
                    productId:  "ID",
                    quantity: "Number"
                }
            }
        });
    })
    .catch(err => {
        res.status(500).json({
            error: err
        });
    });
});

module.exports = router;