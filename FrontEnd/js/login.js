const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const message = document.getElementById("message");

    try{

        const response = await fetch("http://localhost:5000/api/auth/login",{

            method:"POST",

            headers:{
                "Content-Type":"application/json"
            },

            body:JSON.stringify({
                email,
                password
            })

        });

        const data = await response.json();

        if(!data.success){

            message.innerText = data.message;
            return;

        }

        localStorage.setItem("token",data.token);

        localStorage.setItem("role",data.user.role);

        localStorage.setItem("name",data.user.name);

        if(data.user.role==="teacher"){

            window.location.href="teacher-dashboard.html";

        }else{

            window.location.href="student-dashboard.html";

        }

    }catch(err){

        message.innerText="Server Error";

    }

});