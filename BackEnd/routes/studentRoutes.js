const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");
const {
    getStudentProfile
} = require("../controllers/studentController");

router.get("/profile", verifyToken, getStudentProfile);

module.exports = router;