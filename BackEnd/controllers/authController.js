const bcrypt = require("bcrypt");
const db = require("../config/db");
const generateToken = require("../utils/jwt");

const registerStudent = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            roll_number,
            department_id,
            semester,
            section,
            phone
        } = req.body;

        if (
            !full_name ||
            !email ||
            !password ||
            !roll_number ||
            !department_id ||
            !semester ||
            !section
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory."
            });
        }

        const [existingUser] = await db.execute(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [userResult] = await connection.execute(
                `INSERT INTO users
                (full_name, email, password, role)
                VALUES (?, ?, ?, 'student')`,
                [full_name, email, hashedPassword]
            );

            await connection.execute(
                `INSERT INTO students
                (user_id, roll_number, department_id, semester, section, phone)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    userResult.insertId,
                    roll_number,
                    department_id,
                    semester,
                    section,
                    phone
                ]
            );

            await connection.commit();

            return res.status(201).json({
                success: true,
                message: "Student registered successfully."
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const registerTeacher = async (req, res) => {
    try {
        const {
            full_name,
            email,
            password,
            employee_id,
            department_id,
            designation,
            phone
        } = req.body;

        if (
            !full_name ||
            !email ||
            !password ||
            !employee_id ||
            !department_id
        ) {
            return res.status(400).json({
                success: false,
                message: "All required fields are mandatory."
            });
        }

        const [existingUser] = await db.execute(
            "SELECT user_id FROM users WHERE email = ?",
            [email]
        );

        if (existingUser.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Email already exists."
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const connection = await db.getConnection();

        try {
            await connection.beginTransaction();

            const [userResult] = await connection.execute(
                `INSERT INTO users
                (full_name, email, password, role)
                VALUES (?, ?, ?, 'teacher')`,
                [full_name, email, hashedPassword]
            );

            await connection.execute(
                `INSERT INTO teachers
                (user_id, employee_id, department_id, designation, phone)
                VALUES (?, ?, ?, ?, ?)`,
                [
                    userResult.insertId,
                    employee_id,
                    department_id,
                    designation,
                    phone
                ]
            );

            await connection.commit();

            return res.status(201).json({
                success: true,
                message: "Teacher registered successfully."
            });

        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
        }

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const login = async (req, res) => {
    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required."
            });
        }

        const [users] = await db.execute(
            "SELECT * FROM users WHERE email = ?",
            [email]
        );

        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const user = users[0];

        const validPassword = await bcrypt.compare(
            password,
            user.password
        );

        if (!validPassword) {
            return res.status(401).json({
                success: false,
                message: "Incorrect password."
            });
        }

        const token = generateToken(user);

        return res.status(200).json({
            success: true,
            message: "Login successful.",
            token,
            user: {
                id: user.user_id,
                name: user.full_name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const logout = (req, res) => {
    return res.status(200).json({
        success: true,
        message: "Logout successful."
    });
};

module.exports = {
    registerStudent,
    registerTeacher,
    login,
    logout
};