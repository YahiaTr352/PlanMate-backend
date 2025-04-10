const validateAddTask = ({  title, description, priority, status, dueDate }) => {
    const errors = {};

    if (!title) errors.title = "title is required";
    if (!description) errors.description = "description is required";
    if (!priority) errors.priority = "priority is required";
    if (!status) errors.status = "status is required";
    if (!dueDate) errors.dueDate = "dueDate do not match";

    return errors;
};

module.exports = validateAddTask
