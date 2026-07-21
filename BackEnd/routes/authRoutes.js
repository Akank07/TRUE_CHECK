const express = require("express");

const router = express.Router();

const {
    registerStudent,
    registerTeacher,
    login,
    logout
} = require("../controllers/authController");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Route Working"
    });
});

router.post("/ping", (req, res) => {
    console.log("POST /ping Body:", req.body);

    res.json({
        success: true,
        message: "POST works",
        body: req.body
    });
});

router.post("/student/register", registerStudent);

router.post("/teacher/register", registerTeacher);

router.post("/login", login);

router.post("/logout", logout);

module.exports = router;