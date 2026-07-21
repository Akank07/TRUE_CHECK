const db = require("../config/db");
const calculateDistance = require("../utils/distanceCalculator");

const markAttendance = async (req, res) => {
    try {

        const {
            session_code,
            latitude,
            longitude
        } = req.body;

        const userId = req.user.userId;

        console.log("Decoded JWT:", req.user);
        console.log("User ID from Token:", userId);

        if (
            !session_code ||
            latitude === undefined ||
            longitude === undefined
        ) {
            return res.status(400).json({
                success: false,
                message: "Session code, latitude and longitude are required."
            });
        }

        const [studentRows] = await db.execute(
            `SELECT student_id
             FROM students
             WHERE user_id = ?`,
            [userId]
        );

        console.log("Student Query Result:", studentRows);

        if (studentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const studentId = studentRows[0].student_id;

        const [sessionRows] = await db.execute(
            `SELECT
                s.session_id,
                s.subject_id,
                s.session_status,
                s.start_time,
                s.end_time,
                c.latitude,
                c.longitude,
                c.allowed_radius
            FROM attendance_sessions s
            INNER JOIN classrooms c
                ON s.classroom_id = c.classroom_id
            WHERE s.session_code = ?`,
            [session_code]
        );

        if (sessionRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Invalid session code."
            });
        }

        const session = sessionRows[0];

        if (session.session_status !== "ACTIVE") {
            return res.status(400).json({
                success: false,
                message: "Attendance session is not active."
            });
        }

        const now = new Date();

        if (
            now < new Date(session.start_time) ||
            now > new Date(session.end_time)
        ) {
            return res.status(400).json({
                success: false,
                message: "Attendance session has expired."
            });
        }

        const [enrollment] = await db.execute(
            `SELECT *
             FROM student_subjects
             WHERE student_id = ?
             AND subject_id = ?`,
            [
                studentId,
                session.subject_id
            ]
        );

        if (enrollment.length === 0) {
            return res.status(403).json({
                success: false,
                message: "Student is not enrolled in this subject."
            });
        }

        const [duplicate] = await db.execute(
            `SELECT attendance_id
             FROM attendance
             WHERE session_id = ?
             AND student_id = ?`,
            [
                session.session_id,
                studentId
            ]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Attendance already marked."
            });
        }

        const distance = calculateDistance(
            Number(latitude),
            Number(longitude),
            Number(session.latitude),
            Number(session.longitude)
        );

        if (distance > Number(session.allowed_radius)) {
            return res.status(403).json({
                success: false,
                message: "You are outside the classroom radius.",
                distance: Number(distance.toFixed(2)),
                allowed_radius: session.allowed_radius
            });
        }

        await db.execute(
            `INSERT INTO attendance
            (
                session_id,
                student_id,
                latitude,
                longitude,
                distance,
                attendance_status
            )
            VALUES
            (?,?,?,?,?,?)`,
            [
                session.session_id,
                studentId,
                latitude,
                longitude,
                distance.toFixed(2),
                "PRESENT"
            ]
        );

        return res.status(201).json({
            success: true,
            message: "Attendance marked successfully.",
            attendance: {
                session_id: session.session_id,
                student_id: studentId,
                distance: Number(distance.toFixed(2)),
                attendance_status: "PRESENT"
            }
        });

    } catch (error) {

        console.error("Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
            sqlMessage: error.sqlMessage || null,
            code: error.code || null
        });
    }
};

const getAttendanceHistory = async (req, res) => {

    try {

        const userId = req.user.userId;

        const [studentRows] = await db.execute(
            `SELECT student_id
             FROM students
             WHERE user_id = ?`,
            [userId]
        );

        if (studentRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        const studentId = studentRows[0].student_id;

        const [history] = await db.execute(
            `SELECT
                s.subject_name,
                a.attendance_status,
                a.marked_at
            FROM attendance a
            INNER JOIN attendance_sessions ats
                ON a.session_id = ats.session_id
            INNER JOIN subjects s
                ON ats.subject_id = s.subject_id
            WHERE a.student_id = ?
            ORDER BY a.marked_at DESC`,
            [studentId]
        );

        return res.status(200).json({
            success: true,
            history
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

const getSessionAttendance = async (req, res) => {

    try {

        const { sessionId } = req.params;
        const userId = req.user.userId;

        const [teacherRows] = await db.execute(
            `SELECT teacher_id
             FROM teachers
             WHERE user_id = ?`,
            [userId]
        );

        if (teacherRows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found."
            });
        }

        const teacherId = teacherRows[0].teacher_id;

        const [sessionRows] = await db.execute(
            `SELECT session_id
             FROM attendance_sessions
             WHERE session_id = ?
             AND teacher_id = ?`,
            [sessionId, teacherId]
        );

        if (sessionRows.length === 0) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to view this session."
            });
        }

        const [attendance] = await db.execute(
            `SELECT
                st.roll_number,
                u.full_name,
                sub.subject_name,
                a.attendance_status,
                a.marked_at,
                a.distance
            FROM attendance a
            INNER JOIN students st
                ON a.student_id = st.student_id
            INNER JOIN users u
                ON st.user_id = u.user_id
            INNER JOIN attendance_sessions ats
                ON a.session_id = ats.session_id
            INNER JOIN subjects sub
                ON ats.subject_id = sub.subject_id
            WHERE a.session_id = ?
            ORDER BY a.marked_at ASC`,
            [sessionId]
        );

        return res.status(200).json({
            success: true,
            total_students: attendance.length,
            attendance
        });

    } catch (error) {

        console.error(error);

        return res.status(500).json({
            success: false,
            message: error.message,
            sqlMessage: error.sqlMessage || null,
            code: error.code || null
        });

    }

};

module.exports = {
    markAttendance,
    getAttendanceHistory,
    getSessionAttendance
};