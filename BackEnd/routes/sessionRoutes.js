const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/authMiddleware");

const {
    createSession,
    getActiveSessions,
    endSession
} = require("../controllers/sessionController");

router.post("/create", verifyToken, createSession);

router.get("/active", verifyToken, getActiveSessions);

router.put("/end/:sessionId", verifyToken, endSession);

module.exports = router;