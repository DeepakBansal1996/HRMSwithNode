
var temp=null;
var temp2=null;
var pageNumber=1;
var pageSize=10;
var token=localStorage.getItem("token");
var found= new Set();
var i;
function showprojects(i,psize)

{
    var pno= i;
    if(!pno){
        pno=1;
    }

    $.ajax	({

        url: "http://localhost:5000/adminhomepage/getprojects/"+pno,

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
            console.log(data);
            console.log("hii",temp.count);
            var table=document.getElementById("tbodyid");

            //console.log(table);
            $("#tbodyid").empty();

            for (var i=0; i<data.project.length; i++){

                var row=table.insertRow(table.length);
                //console.log("pallalalala",table.length);
                row.insertCell(0).innerHTML=i+1;
                row.insertCell(1).innerHTML=data.project[i].Projectname;
                row.insertCell(2).innerHTML=data.project[i].Projectdesc;
                row.insertCell(3).innerHTML=data.project[i].Techstack;
                var b=document.createElement("br");
                var t= document.createTextNode(row.insertCell(4).innerHTML=data.project[i].Userassigned);
                b.appendChild(t);

                row.insertCell(5).innerHTML="<input style='box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); background-color:white; border:2px solid #BABABA;' type='button' value='Assign Users' style='color:white;' class='btn mx-2 editbutton' data-toggle='modal' data-target='#updateProjects' id= 'deletebutton' onclick=\'assign(\""+data.project[i]._id+"\")'>";
                row.insertCell(6).innerHTML="<input style=' box-shadow: 2px 2px 2px 1px rgba(0, 0, 0, 0.2); background-color:white; border:2px solid #BABABA;' type='button' value='Delete' class=' btn  deletebutton' id= 'deletebutton' onclick=\'deleteproject(\""+data.project[i]._id+"\")'>";

            }
            console.log("han",table);  
            getTotal();
        }

    });

}

function getTotal() 
{
    var count=temp.count;
    numberOfPages = Math.ceil(count / pageSize);
    console.log(numberOfPages);
    buttons = '';
    for( i=1; i<=numberOfPages; i++)
    {
        pageNumber=i;
        buttons += '<button class="btn" id="pagingbutton" style="margin-left:2px;" onclick="showprojects('+pageNumber+')">'  + pageNumber + '</button>';
    }
    // console.log("totaldata",data);
    $('#pagin').html(buttons);

}


function createtechstack(){
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
            var skills = data.skills;
            for(skillNumber in skills)
            {
                var skill = skills[skillNumber]['Skillsname'];
                $("#TechStack").append('<option value = "'+skill+'">'+skill+'</option>' )
            }


        }
    });
}



function adduser(){
    var username = document.getElementById("useradduser").value;
    var password = document.getElementById("passwordadduser").value;
    var usertype = document.getElementById("usertypeadduser").value;
    var datafornewuser={
        "Username": username,
        "Password": password,
        "Usertype": usertype,
        "Skills": "none"
    }
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/adduser',
        type: 'POST',
        dataType: 'json',
        data: datafornewuser,
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res){
            console.log("adkfjja");
            alert("User has been added succesfully");
            //window.location="adminhomepage.html";
        },
        error:function(err){
            alert(err);
        }				
    });
}


function user2(){
    userlistbutton();
    showusers();

}
function userlistbutton()
{
    var countusers=temp.users.length;
    console.log("usercount",countusers);
    var numberOfuPages = Math.ceil(countusers / 15);
    buttons = '';
    for( i=1; i<=numberOfuPages; i++)
    {
        pageNumber=i;
        buttons += '<button class="btn" style="margin-left:2px;" onclick="showusers('+pageNumber+')">'  + pageNumber + '</button>';
        console.log('pageNumber');
    }
    $('#userpagin').html(buttons);
}
function showusers(pagenumber){
    var userpagenumber = pagenumber;
    var ps=15;
    if(!userpagenumber){
        userpagenumber = 1;
    }

    var skip=ps*(userpagenumber-1);
    var newtable=document.getElementById("userbodyid");
    $("#userbodyid").empty();

    for (i=skip; i<ps+skip; i++){
        console.log(temp)
        var row=newtable.insertRow(newtable.length);
        row.insertCell(0).innerHTML=i+1;
        row.insertCell(1).innerHTML=temp.users[i].Username;
        row.insertCell(2).innerHTML=temp.users[i].Skills;
    }
}


function addskill(){
    var skillname = document.getElementById("skillnameaddskill").value;

    var datafornewskill={
        "Skillsname": skillname

    }
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/addskill',
        type: 'POST',
        dataType: 'json',
        data: datafornewskill,
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res)
        {
            alert("Skill has been added succesfully");
            //window.location="adminhomepage.html";
        }
    });
}

function addproject(){

    var projectname = document.getElementById("projectnameaddproject").value;
    var projectdesc = document.getElementById("projectdescaddproject").value;
    var techstack = $('#TechStack').val(); //document.getElementById("techstackaddproject").value
    //var recommendations = document.getElementById("recommendationsaddproject").value;
    console.log(techstack);
    var datafornewproject={
        "Projectname" : projectname,
        "Projectdesc": projectdesc,
        "Techstack": techstack,
        //"Usersassigned":"none"
    }
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/addproject',
        type: 'POST',
        dataType: 'json',
        data: datafornewproject,
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res)
        {
            alert("Project has been added succesfully");
            //window.location="adminhomepage.html";
        }				
    });
}


function updateproject(Id){
    var projectname = document.getElementById("projectnameupdateproject").value;
    var projectdesc = document.getElementById("projectdescupdateproject").value;
    var techstack = document.getElementById("techstackupdateproject").value;
    var recommendations = document.getElementById("recommendationsupdateproject").value;
    var dataforupdateproject={
        "Projectname" : projectname,
        "Projectdesc": projectdesc,
        "Techstack": techstack,
        "Usersassigned": recommendations
    }
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/updateproject/'+Id,
        type: 'PUT',
        dataType: 'json',
        data: dataforupdateproject,
        success: function(res)
        {
            alert("Project has been updated succesfully");
            window.location="adminhomepage.html";
        }				
    });
}



function deleteproject(Id){
    alert("are you sure you want to delete this project, Changes may be not be reversible");
    console.log(Id);
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/deleteproject/'+Id,
        type: 'DELETE',
        dataType: 'json',
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res){
            console.log(res);
            alert("Project has been deleted succesfully");
            window.location="adminhomepage.html";			
        }
    });
}

//assign users to project 

function assign(Id)
{


    console.log(Id);
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/getOneprojects/'+Id,
        type: 'GET',
        dataType: 'json',
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        success: function(res)
        {
            console.log(res);
            temp2=res;     
            var d2=[];
            //assigne project[0] skills
            d2=res.project.Techstack; 

            for(var i=0;i<temp.users.length;i++)//traverse users
            {
                for(var j=0;j<temp.users[i].Skills.length;j++) // user's skills
                { 
                    for(var k=0;k<d2.length;k++) // project's skills
                    { 
                        if(temp.users[i].Skills[j]==d2[k]) 
                        {    
                            found.add(temp.users[i]);
                        } 
                    }

                }
            }

            var usermatched = Array.from(found);
            var assignname=usermatched[0].Username;
            console.log(assignname);
            console.log("user after match",usermatched[0].Skills);
            // console.log(usermatched.length);
            var table1 = document.getElementById("usertable");

            for (var i=0; i<usermatched.length; i++){

                var row=table1.insertRow(table1.length);
                row.insertCell(0).innerHTML=i+1;
                row.insertCell(1).innerHTML=usermatched[i].Username;
                row.insertCell(2).innerHTML=usermatched[i].Skills;

                row.insertCell(3).innerHTML="<input type='button' value='Assign' class='btn btn-lg btn-warning mx-2'data-toggle='modal' data-target='#updateProjects' editbutton' onclick=\'usertoproject(\""+temp2.project._id+"\",\""+usermatched[i].Username+"\")'>";


            }

        }

    });

}

function usertoproject(Id,username)
{
    console.log("ljb",Id);
    console.log("name",username);


    var assine1 = username.concat( temp2.project.Userassigned);
    console.log("cot",assine1);

    dataforassign={
        "Projectname" : temp2.project.Projectname,
        "Projectdesc": temp2.project.Projectdesc,
        "Techstack": temp2.project.Techstack,
        "Userassigned":assine1
    } 

    console.log(dataforassign);
    $.ajax({
        url: 'http://localhost:5000/adminhomepage/assignusertoproject/'+Id,
        type: 'PUT',
        dataType: 'json',
        headers: {
            //            "Content-Type": "application/json",
            "cache-control": "no-cache" ,
            "Authorization": "Bearer "+token
        },
        data: dataforassign,
        success: function(res)
        {
            //console.log(res);
            //alert("User has been assigned succesfully");
            //window.location="adminhomepage.html";
        }				
    });

}

function logoutbutton()
{
    localStorage.clear();
    window.location="index.html";
}