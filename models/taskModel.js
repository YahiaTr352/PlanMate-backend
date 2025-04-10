const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
    title : {type : String , required : true},
    description : {type : String , required : true},
    postedDate : {type : Date , default : Date.now()},
    priority : {type : String , enum : ["Low" , "Medium" , "High"] , default : "Low"},
    dueDate : {type : Date , requried : true},
    status : {type : String , enum : ["Panding" , "In-Progress" , "Completed"]},
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User"}  
})

const Task = mongoose.model("Task" , taskSchema);

module.exports = Task;
