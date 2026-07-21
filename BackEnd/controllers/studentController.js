const db = require("../config/db");

const getStudentProfile = async (req, res) => {
    try {
        const userId = req.user.userId;

        const [student] = await db.execute(
            `SELECT
                u.user_id,
                u.full_name,
                u.email,
                s.roll_number,
                d.department_name,
                s.semester,
                s.section,
                s.phone
            FROM users u
            JOIN students s ON u.user_id = s.user_id
            JOIN departments d ON s.department_id = d.department_id
            WHERE u.user_id = ?`,
            [userId]
        );

        if (student.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Student not found."
            });
        }

        res.status(200).json({
            success: true,
            student: student[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getStudentProfile
};