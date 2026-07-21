const registerForm=document.getElementById("registerForm");

registerForm.addEventListener("submit",(e)=>{

    e.preventDefault();

    const name=document.getElementById("name").value.trim();
    const email=document.getElementById("email").value.trim();
    const password=document.getElementById("password").value;
    const confirmPassword=document.getElementById("confirmPassword").value;
    const department=document.getElementById("department").value;
    const semester=document.getElementById("semester").value;
    const role=document.getElementById("role").value;

    if(
        name==="" ||
        email==="" ||
        password==="" ||
        confirmPassword===""){
        alert("Please fill all the fields.");
        return;
    }

    if(password!==confirmPassword){
        alert("Passwords do not match.");
        return;
    }

    const user={
        name,
        email,
        password,
        department,
        semester,
        role
    };

    localStorage.setItem("registeredUser",JSON.stringify(user));

    alert("Registration Successful");

    window.location.href="index.html";

});