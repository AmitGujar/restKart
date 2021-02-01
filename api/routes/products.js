const express = require('express');
const router = express.Router();
const mongoose = require("mongoose");
const Product = require("../models/product");

// show all products
router.get("/", (req, res, next) => {
    Product.find()
    .select("name price _id") 
    .exec()
    .then(docs => {
        const response = {
            count: docs.length,
            products: docs.map(doc => {
                return {
                    name: doc.name,
                    price: doc.price,
                    _id: doc.id,
                    request: {
                        type: "GET",
                        url: "http://localhost:3000/products/" + doc.id
                    }
                }
            })
        };
        // if (docs.length >= 0) { 
            res.status(200).json(response);            
        // } else {
        //     res.status(404).json({
        //         message: "No entries found"
        //     });
        // }
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        });
    });
});
// storing product
router.post("/", (req, res, next) => {
    const product = new Product ({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        price: req.body.price
    });
    product.save().then(result => {
        console.log(result);
        res.status(201).json({
            message: "Created product successfully",
            createdProduct: {
                name:result.name,
                price: result.price,
                _id: result._id,
                request: {
                    type: "GET",
                    url: "http://localhost:3000/products/" + result._id
                }
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

// fetching product by ID
router.get("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.findById(id)
    .select("name price _id") 
    .exec()
    .then(doc =>  {
        console.log("From Database",doc);
        if(doc){
            res.status(200).json({
                product: doc,
                request : {
                    type: "GET",
                    description: "Get all products",
                    url: "http://localhost:3000/products"
                }
            });
        } else {
            res.status(404).json({
                message: "No valid entry found for provided ID"
            });
        }
    }).catch((err) => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});

//updating products 
router.patch("/:productId", (req, res, next) => {
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.updateOne({_id: id}, {$set: updateOps})
    .exec()
    .then(result => {
        console.log(result);
        res.status(200).json({
            message: "Product updated successfully",
            request: {
                type: "GET",
                description: "Product Details",
                url: "http://localhost:3000/products/" + id
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

// deleting product by id
router.delete("/:productId", (req, res, next) => {
    const id = req.params.productId;
    Product.remove({_id: id})
    .exec()
    .then(result => {
        console.log("Item Deleted");
       res.status(200).json({
           message: "Product Deleted successfully",
           request: {
               type: "POST",
               url: "http://localhost:3000/products",
               data: {
                    name: "String",
                    price: "Number"
               }
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

module.exports = router;