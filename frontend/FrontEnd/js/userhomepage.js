Id=localStorage.getItem("username");;

var temp=null;

var token=localStorage.getItem("token")
function FillDetails(){
    $.ajax({
        url: 'http://localhost:5000/userhomepage/getuserdetails/'+Id,
        type: 'GET',
        dataType: 'json', 
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(data)
        {
            temp=data; 
            tempskill= data.users.Skills
            console.log(tempskill);
            document.getElementById("displayUsername").innerHTML="@"+data.users.Username;  
            console.log("after name");

            var table=document.getElementById("mytable");
            for( i in  data.users.Skills)
            {
                if(data.users.Skills[i]=='none'){


                }else{


                    var row=table.insertRow(table.length);

                    row.insertCell(0).innerHTML=data.users.Skills[i];   
                    console.log(tempskill[i]);
                }

            }

        }

    });

}



function addskill(){ 
    var values=$('#showselect').val();

    var temp3= values.concat( temp.users.Skills);


    //console.log(temp.users.Username);
    //console.log(temp.users.Skills);
    var data=
        {
            "Username": temp.users.Username,
            "Password": temp.users.Password,
            "Usertype": temp.users.Usertype,
            "Skills": temp3
        }

    //console.log(data);

    $.ajax({
        url: 'http://localhost:5000/adminhomepage/updateUserskills/'+Id,
        type: 'PUT',
        dataType: 'json',
        data: data,
        headers: {
            // "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res)
        {
            console.log(res);
            alert("Skills Added succesfully");
            window.location="userhomepage.html";
        }				
    });

}

function showSkills(){
    $.ajax({
        url: 'http://localhost:5000/userhomepage/getskills',
        type: 'GET',
        dataType: 'json', 
        headers: {
            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(data){
            console.log("pallavi",data);
            var skills = data.skills;
            for(skillNumber in skills)
            {
                var skill = skills[skillNumber]['Skillsname'];
                $("#showselect").append('<option value = "'+skill+'">'+skill+'</option>' )
            }


        }
    });
}

function logoutbutton()
{
    localStorage.clear();
    window.location="index.html";
}