const Task = require("../models/taskModel");
const User = require("../models/userModel");
const validateAddTask = require("../utils/taskValidation");
const AddTask = async (req, res) => {
    try {
        const userId = req.query.userId;
        const { title, description, priority, status, dueDate } = req.body;

        const errors = validateAddTask({ title, description, priority, status, dueDate });
        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        const foundUser = await User.findById(userId);
        if (!foundUser) return res.status(404).json({ message: "User not found" });

        const newTask = new Task({
            title,
            description,
            dueDate,
            priority,
            status,
            user: userId
        });

        await newTask.save();

        if (foundUser.tasks) {
            foundUser.tasks.push(newTask._id);
            await foundUser.save();
        }

        res.status(201).json(newTask);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong while adding the task" });
    }
};


const EditTask = async (req, res) => {
    try {
        const { title, description, dueDate, priority, status } = req.body;
        const updatedData = {};

        if (title) updatedData.title = title;
        if (description) updatedData.description = description;
        if (dueDate) updatedData.dueDate = dueDate;
        if (priority) updatedData.priority = priority;
        if (status) updatedData.status = status;

        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: "At least one field is required to update" });
        }

        const updatedTask = await Task.findByIdAndUpdate(
            req.params.id,
            updatedData,
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({ message: "Task not found" });
        }

        res.status(200).json(updatedTask);
    } catch (error) {
        res.status(500).json({ message: "Something went wrong while updating the task", error: error.message });
    }
};

const DeleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task) {
            return res.status(404).json({ message: "Task not found" });
        }

        await task.deleteOne();

        await User.updateOne(
            { tasks: task._id },
            { $pull: { tasks: task._id } }
        );

        res.status(200).json({ message: "Task deleted successfully" });

    } catch (error) {
        console.error("Error deleting task :", error);
        res.status(500).json({ message: "Something went wrong while deleting the task" });
    }
};

const getTodayTasksByUser = async (req, res) => {
    try {
        const userId = req.params.id;
        const now = new Date();

        const startOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            0, 0, 0, 0
        );
        
        const endOfDay = new Date(
            now.getFullYear(),
            now.getMonth(),
            now.getDate(),
            23, 59, 59, 999
        );
    

        const tasks = await Task.find({
            user: userId,
            dueDate: {
                $gte: startOfDay,
                $lte: endOfDay
            }
        });

        if (tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for today" });
        }

        res.status(200).json(tasks);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Something went wrong while fetching today's tasks" });
    }
};

const GetAllTasks = async (req, res) => {
    const userId  = req.query.userId; 

    try {
        const user = await User.findById(userId).populate("tasks");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (user.tasks.length === 0) {
            return res.status(404).json({ message: "No tasks found for this user" });
        }

        res.status(200).json(user.tasks);

    } catch (error) {
        res.status(500).json({ message: "Something went wrong while getting tasks" });
    }
};

module.exports = {
    AddTask,
    EditTask,
    DeleteTask,
    getTodayTasksByUser,
    GetAllTasks
}