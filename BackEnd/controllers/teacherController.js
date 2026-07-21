const db = require("../config/db");
const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs");

const startSession = async (req, res) => {

    try {

        const {

            teacher_id,
            subject_id,
            classroom_id,
            start_time,
            end_time

        } = req.body;

        if (
            !teacher_id ||
            !subject_id ||
            !classroom_id ||
            !start_time ||
            !end_time
        ) {

            return res.status(400).json({

                success: false,

                message: "All fields are required."

            });

        }

        const sessionCode = Math.floor(
            100000 + Math.random() * 900000
        ).toString();

        const qrDirectory = path.join(__dirname, "../uploads/qr");

        if (!fs.existsSync(qrDirectory)) {

            fs.mkdirSync(qrDirectory, { recursive: true });

        }

        const qrPath = `uploads/qr/${sessionCode}.png`;

        await QRCode.toFile(

            path.join(__dirname, "../", qrPath),

            sessionCode

        );

        const [result] = await db.execute(

            `INSERT INTO attendance_sessions
            (
                teacher_id,
                subject_id,
                classroom_id,
                session_code,
                qr_code,
                start_time,
                end_time
            )
            VALUES (?,?,?,?,?,?,?)`,

            [

                teacher_id,
                subject_id,
                classroom_id,
                sessionCode,
                qrPath,
                start_time,
                end_time

            ]

        );

        res.status(201).json({

            success: true,

            message: "Attendance Session Started",

            session_id: result.insertId,

            session_code: sessionCode,

            qr_code: qrPath

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const endSession = async (req, res) => {

    try {

        const { session_id } = req.params;

        await db.execute(

            `UPDATE attendance_sessions
            SET session_status='ENDED'
            WHERE session_id=?`,

            [

                session_id

            ]

        );

        res.json({

            success: true,

            message: "Attendance Session Ended"

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

const activeSession = async (req, res) => {

    try {

        const [rows] = await db.execute(

            `SELECT *
             FROM attendance_sessions
             WHERE session_status='ACTIVE'
             ORDER BY session_id DESC
             LIMIT 1`

        );

        if (rows.length === 0) {

            return res.json({

                active: false

            });

        }

        res.json({

            active: true,

            session: rows[0]

        });

    }

    catch (error) {

        console.log(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

};

module.exports = {

    startSession,

    endSession,

    activeSession

};