const db = require("../config/db");
const generateSessionCode = require("../utils/sessionCodeGenerator");
const generateQRCode = require("../utils/qrGenerator");

const createSession = async (req, res) => {
    try {
        const {
            subject_id,
            classroom_id,
            start_time,
            end_time
        } = req.body;

        const userId = req.user.userId;

        if (
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

        const [teacherRows] = await db.execute(
            "SELECT teacher_id FROM teachers WHERE user_id = ?",
            [userId]
        );

        if (teacherRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }

        const teacherId = teacherRows[0].teacher_id;

        const [subjectRows] = await db.execute(
            `SELECT *
             FROM teacher_subjects
             WHERE teacher_id = ?
             AND subject_id = ?`,
            [teacherId, subject_id]
        );

        if (subjectRows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Teacher is not assigned to this subject."
            });
        }

        const sessionCode = generateSessionCode();

        const qrCode = await generateQRCode(sessionCode);

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
            VALUES
            (?,?,?,?,?,?,?)`,
            [
                teacherId,
                subject_id,
                classroom_id,
                sessionCode,
                sessionCode,
                start_time,
                end_time
            ]
        );

        res.status(201).json({
            success: true,
            message: "Attendance session created successfully.",
            session: {
                session_id: result.insertId,
                session_code: sessionCode,
                qr_code_image: qrCode,
                teacher_id: teacherId,
                subject_id,
                classroom_id,
                start_time,
                end_time,
                session_status: "ACTIVE"
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            sqlMessage: error.sqlMessage || null,
            code: error.code || null
        });
    }
};

const getActiveSessions = async (req, res) => {
    try {

        const [sessions] = await db.execute(
            `SELECT
                s.session_id,
                s.session_code,
                s.start_time,
                s.end_time,
                sub.subject_name,
                c.room_number,
                c.building_name
            FROM attendance_sessions s
            INNER JOIN subjects sub
                ON s.subject_id = sub.subject_id
            INNER JOIN classrooms c
                ON s.classroom_id = c.classroom_id
            WHERE s.session_status = 'ACTIVE'
            ORDER BY s.start_time DESC`
        );

        res.status(200).json({
            success: true,
            count: sessions.length,
            sessions
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            sqlMessage: error.sqlMessage || null,
            code: error.code || null
        });
    }
};

const endSession = async (req, res) => {
    try {

        const { sessionId } = req.params;
        const userId = req.user.userId;

        const [teacherRows] = await db.execute(
            "SELECT teacher_id FROM teachers WHERE user_id = ?",
            [userId]
        );

        if (teacherRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }

        const teacherId = teacherRows[0].teacher_id;

        const [result] = await db.execute(
            `UPDATE attendance_sessions
             SET session_status = 'ENDED'
             WHERE session_id = ?
             AND teacher_id = ?
             AND session_status = 'ACTIVE'`,
            [sessionId, teacherId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Active session not found or already ended."
            });
        }

        res.status(200).json({
            success: true,
            message: "Session ended successfully."
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message,
            sqlMessage: error.sqlMessage || null,
            code: error.code || null
        });
    }
};

module.exports = {
    createSession,
    getActiveSessions,
    endSession
};