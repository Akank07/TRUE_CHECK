const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("welcome").innerText =
    "Welcome, " + localStorage.getItem("name");

document
    .getElementById("logoutBtn")
    .addEventListener("click", () => {

        localStorage.clear();

        window.location.href = "login.html";

    });

async function loadHistory() {

    try {

        const response = await fetch(
            "http://localhost:5000/api/attendance/history",
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await response.json();

        const tbody = document.getElementById("historyBody");

        tbody.innerHTML = "";

        if (!data.success) {
            return;
        }

        data.history.forEach(item => {

            tbody.innerHTML += `
                <tr>
                    <td>${item.subject_name}</td>
                    <td>${item.attendance_status}</td>
                    <td>${new Date(item.marked_at).toLocaleString()}</td>
                </tr>
            `;

        });

    } catch (err) {

        console.error(err);

    }

}

loadHistory();