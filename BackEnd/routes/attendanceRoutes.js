const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    markAttendance,
    getAttendanceHistory,
    getSessionAttendance
} = require("../controllers/attendanceController");

router.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Attendance Routes Working"
    });
});

router.post("/mark", verifyToken, markAttendance);

router.get("/history", verifyToken, getAttendanceHistory);

router.get("/session/:sessionId", verifyToken, getSessionAttendance);

module.exports = router;