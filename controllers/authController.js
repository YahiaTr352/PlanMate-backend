const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validateSignUp, validateLogin } = require("../utils/authValidation");

const SignUpUser = async (req, res) => {
    try {
        const { name, email, password, passwordC } = req.body;
        const errors = validateSignUp({ name, email, password, passwordC });

        const existingEmail = await User.findOne({ email });
        const existingName = await User.findOne({ name });

        if (existingName) errors.name = "userName is used";
        if (existingEmail) errors.email = "email is used";

        if (Object.keys(errors).length > 0) return res.status(400).json(errors);

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            name,
            email,
            password: hashedPassword
        });

        await newUser.save();

        const token = jwt.sign(
            { userId: newUser._id, role: newUser.role },
            "secretKey"
        );

        res.status(200).json({ newUser, token });

    } catch (error) {
        console.error("Signup Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

const LoginUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const errors = validateLogin({ name, email, password });

        if (Object.keys(errors).length > 0) {
            return res.status(400).json(errors);
        }

        const existingUser = await User.findOne({ email });

        if (!existingUser) {
            return res.status(400).json({ email: "invalid email or password" });
        }

        if (existingUser.name !== name) {
            return res.status(400).json({ name: "name is not found" });
        }

        const validPassword = await bcrypt.compare(password, existingUser.password);
        if (!validPassword) {
            return res.status(400).json({ password: "invalid email or password" });
        }

        const token = jwt.sign(
            { userId: existingUser._id, role: existingUser.role },
            "secretKey"
        );

        res.status(200).json({ user: existingUser, token });

    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Something went wrong" });
    }
};

module.exports = {
    SignUpUser,
    LoginUser
};
