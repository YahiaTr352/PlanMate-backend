const validateSignUp = ({ name, email, password, passwordC }) => {
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";
    if (password !== passwordC) errors.passwordC = "passwords do not match";

    return errors;
};

const validateLogin = ({ name, email, password }) => {
    const errors = {};

    if (!name) errors.name = "name is required";
    if (!email) errors.email = "email is required";
    if (!password) errors.password = "password is required";

    return errors;
};

module.exports = {
    validateSignUp,
    validateLogin
};
