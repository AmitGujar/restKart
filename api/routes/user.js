const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserController = require("../controllers/user")
const User = require("../models/user");
const checkAuth = require("../middleware/check-auth");
// sign up route
router.post("/signup", UserController.user_signup);

// user login
router.post("/login", UserController.user_login);

// delete user
router.delete("/:userId", checkAuth, UserController.user_delete);

module.exports = router;
