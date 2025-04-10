const { DeleteUser, EditUser, GetUser, GetAllUsers } = require("../controllers/userController");
const VerifyTokenAndRole = require("../middlewares/VerifyTokenMiddleware");
const express = require("express");
const router = express.Router();


router.delete("/:id" , VerifyTokenAndRole(["Admin"]) , DeleteUser);
router.put("/update-user/:id" , VerifyTokenAndRole(["Admin"]) , EditUser);
router.get("/user/:id" , VerifyTokenAndRole(["Admin"]) , GetUser);
router.get("/all-users" ,VerifyTokenAndRole(["Admin"]) , GetAllUsers);

module.exports = router;