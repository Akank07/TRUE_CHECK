const studentName = document.getElementById("studentName");
const attendancePercentage = document.getElementById("attendancePercentage");
const presentCount = document.getElementById("presentCount");
const absentCount = document.getElementById("absentCount");
const sessionIndicator = document.getElementById("sessionIndicator");
const attendanceTable = document.getElementById("attendanceTable");

const joinButton = document.getElementById("joinButton");
const joinAttendance = document.getElementById("joinAttendance");
const logout = document.getElementById("logout");

const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "index.html";
}

window.addEventListener("DOMContentLoaded", () => {
    loadStudent();
    loadAttendanceSummary();
    loadAttendanceHistory();
    checkActiveSession();
});

joinButton.addEventListener("click", () => {

    if (joinButton.disabled) {
        return;
    }

    window.location.href = "attendance.html";

});

joinAttendance.addEventListener("click", () => {

    if (joinButton.disabled) {
        return;
    }

    window.location.href = "attendance.html";

});

logout.addEventListener("click", () => {

    localStorage.removeItem("token");

    window.location.href = "index.html";

});

async function loadStudent() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/student/profile",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        studentName.textContent = data.name;

    } catch (error) {

        console.log(error);

    }

}

async function loadAttendanceSummary() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/student/attendance-summary",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        attendancePercentage.textContent =
            data.attendancePercentage + "%";

        presentCount.textContent =
            data.present;

        absentCount.textContent =
            data.absent;

    } catch (error) {

        console.log(error);

    }

}

async function loadAttendanceHistory() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/student/attendance-history",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const history = await response.json();

        attendanceTable.innerHTML = "";

        history.forEach(record => {

            attendanceTable.innerHTML += `

                <tr>

                    <td>${record.date}</td>

                    <td>${record.subject}</td>

                    <td>${record.status}</td>

                </tr>

            `;

        });

    } catch (error) {

        console.log(error);

    }

}

async function checkActiveSession() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/session/active",
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const session = await response.json();

        if (session.active) {

            sessionIndicator.textContent = "ON";
            sessionIndicator.classList.remove("inactive");
            sessionIndicator.classList.add("active");

            joinButton.disabled = false;

            joinButton.textContent = "Join Session";

        } else {

            sessionIndicator.textContent = "OFF";
            sessionIndicator.classList.remove("active");
            sessionIndicator.classList.add("inactive");

            joinButton.disabled = true;

            joinButton.textContent = "No Active Session";

        }

    } catch (error) {

        console.log(error);

    }

}