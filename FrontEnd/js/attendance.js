const markAttendanceBtn = document.getElementById("markAttendanceBtn");

markAttendanceBtn.addEventListener("click", markAttendance);

async function markAttendance() {

    const sessionCode = document.getElementById("sessionCode").value.trim();

    if (!sessionCode) {

        status.innerText = "Please scan the QR Code first.";
        status.className = "error";
        return;

    }

    if (!navigator.geolocation) {

        status.innerText = "Geolocation is not supported.";
        status.className = "error";
        return;

    }

    status.innerText = "Getting your location...";

    navigator.geolocation.getCurrentPosition(

        async (position) => {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            const token = localStorage.getItem("token");

            if (!token) {

                status.innerText = "Please login first.";
                status.className = "error";
                return;

            }

            try {

                const response = await fetch("http://localhost:5000/api/attendance/mark", {

                    method: "POST",

                    headers: {

                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`

                    },

                    body: JSON.stringify({

                        session_code: sessionCode,
                        latitude,
                        longitude

                    })

                });

                const data = await response.json();

                if (data.success) {

                    status.innerText = "✅ Attendance Marked Successfully";
                    status.className = "success";

                } else {

                    status.innerText = data.message;
                    status.className = "error";

                }

            } catch (error) {

                console.error(error);

                status.innerText = "Server Error";
                status.className = "error";

            }

        },

        () => {

            status.innerText = "Location Permission Denied";
            status.className = "error";

        }

    );

}