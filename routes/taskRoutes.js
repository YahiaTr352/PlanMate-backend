const VerifyTokenAndRole = require("../middlewares/VerifyTokenMiddleware");
const { AddTask, EditTask, DeleteTask, GetAllTasks, getTodayTasksByUser } = require("../controllers/taskController");
const express = require("express");
const router = express.Router();

router.post("/add-task" , VerifyTokenAndRole(["User"]) , AddTask);
router.put("/update-task/:id" , VerifyTokenAndRole(["User"]) , EditTask);
router.delete("/delete-task/:id" ,  VerifyTokenAndRole(["User"]) , DeleteTask);
router.get("/tasks-today/:id" , VerifyTokenAndRole(["User"]) , getTodayTasksByUser);
router.get("/all-tasks" , VerifyTokenAndRole(["User"]) , GetAllTasks);

module.exports = router;