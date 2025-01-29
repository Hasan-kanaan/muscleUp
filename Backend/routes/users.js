const express = require("express");

const router = express.Router();

const { logInUser, signUpUser } = require("../controllers/userController");
//log in
router.post("/login", logInUser);

//sign up
router.post("/signup", signUpUser);

module.exports = router;
