const express = require("express");

const router = express.Router();

const authenticate = require("../middleware/authMiddleware");

const {

    startSession,

    endSession,

    activeSession

} = require("../controllers/teacherController");

router.post(

    "/start-session",

    authenticate,

    startSession

);

router.put(

    "/end-session/:session_id",

    authenticate,

    endSession

);

router.get(

    "/active-session",

    authenticate,

    activeSession

);

module.exports = router;