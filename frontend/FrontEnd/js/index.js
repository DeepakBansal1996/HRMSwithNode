function showpass() {
    var x = document.getElementById("Passwordlogin");
    if (x.type === "password") {
        x.type = "text";
    } else {
        x.type = "password";
    }
}

function loginform() {
    var username = document.getElementById("Username").value;
    var password = document.getElementById("Password").value;
    var dataForLogin = {
        "Username": username,
        "Password": password
    }
    $.ajax({
        url: 'http://localhost:5000/login',
        type: 'POST',
        dataType: 'json',
        data: dataForLogin,
        //		headers: {
        //			"Content-Type": "application/json",
        //			"cache-control": "no-cache" 
        //            //"Authorization": token
        //		},
        success: function (res) {
            localStorage.setItem("token",res.token);
            console.log(res);
            alert("login successfull");

            if(res.role=='Admin'){
                window.location="adminhomepage.html";
            }
            else{
                window.location="userhomepage.html";
                localStorage.setItem("username",res.username);

            }       				
        }
    });
}