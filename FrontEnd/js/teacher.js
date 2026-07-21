const token = localStorage.getItem("token");

if (!token) {
    window.location.href = "login.html";
}

document.getElementById("welcome").innerText =
    "Welcome, " + localStorage.getItem("name");

document.getElementById("logoutBtn").onclick = () => {

    localStorage.clear();

    window.location.href = "login.html";

};

document.getElementById("createBtn").onclick = createSession;

async function createSession() {

    const body = {

        subject_id: Number(document.getElementById("subjectId").value),

        classroom_id: Number(document.getElementById("classroomId").value),

        start_time: document.getElementById("startTime").value.replace("T"," "),

        end_time: document.getElementById("endTime").value.replace("T"," ")

    };

    const response = await fetch(
        "http://localhost:5000/api/session/create",
        {

            method:"POST",

            headers:{
                "Content-Type":"application/json",
                Authorization:"Bearer "+token
            },

            body:JSON.stringify(body)

        }
    );

    const data = await response.json();

    if(!data.success){

        alert(data.message);

        return;

    }

    document.getElementById("qrImage").src =
        data.session.qr_code_image;

    document.getElementById("sessionCode").innerText =
        "Session Code : " + data.session.session_code;

    loadSessions();

}

async function loadSessions(){

    const response = await fetch(

        "http://localhost:5000/api/session/active",

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    const data = await response.json();

    const body=document.getElementById("sessionBody");

    body.innerHTML="";

    data.sessions.forEach(session=>{

        body.innerHTML+=`

        <tr>

        <td>${session.session_id}</td>

        <td>${session.subject_name}</td>

        <td>${session.room_number}</td>

        <td>${session.session_code}</td>

        <td>

        <button onclick="endSession(${session.session_id})">

        End

        </button>

        </td>

        <td>

        <button onclick="viewAttendance(${session.session_id})">

        View

        </button>

        </td>

        </tr>

        `;

    });

}

async function endSession(id){

    await fetch(

        "http://localhost:5000/api/session/end/"+id,

        {

            method:"PUT",

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    loadSessions();

}

async function viewAttendance(id){

    const response=await fetch(

        "http://localhost:5000/api/attendance/session/"+id,

        {

            headers:{

                Authorization:"Bearer "+token

            }

        }

    );

    const data=await response.json();

    const body=document.getElementById("attendanceBody");

    body.innerHTML="";

    data.attendance.forEach(student=>{

        body.innerHTML+=`

        <tr>

        <td>${student.roll_number}</td>

        <td>${student.full_name}</td>

        <td>${student.attendance_status}</td>

        <td>${new Date(student.marked_at).toLocaleString()}</td>

        </tr>

        `;

    });

}

loadSessions();