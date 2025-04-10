const {SignUpUser,LoginUser} = require("../controllers/authController");
const express = require("express");
const router = express.Router();

router.post("/signup" , SignUpUser);
router.post("/login" , LoginUser);

module.exports = router;