
var temp=null;
var temp2=null;
var pageNumber=1;
var pageSize=4;
var token=localStorage.getItem("token")
var found= new Set();
var i;
function showprojects(i,psize)

{
    //console.log("kjsn",token);
   // console.log("no and size=",pno,psize)
  var pno= i;
   if(!pno){
       pno=1;
    }
    // console.log(PageNumber);
    
    //pno=i;
			$.ajax	({
               
                url: "http://localhost:5000/adminhomepage/getprojects/"+pno,
				
				type: 'GET',
				dataType: 'json',
                headers: {
                    "Content-Type": "application/json",
                    "cache-control": "no-cache" ,
                    "Authorization": token
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
     
				 row.insertCell(5).innerHTML="<input type='button' value='Assign Users' style='color:white;' class='btn btn-lg btn-warning mx-2'data-toggle='modal' data-target='#updateProjects' editbutton' onclick=\'assign(\""+data.project[i]._id+"\")'>";
				 row.insertCell(6).innerHTML="<input type='button' value='Delete' class=' btn btn-lg btn-danger deletebutton' onclick=\'deleteproject(\""+data.project[i]._id+"\")'>";
                
				     }
                     console.log("han",table);  
                    getTotal();
           }
        
		});
  //setTimeout(,3000);
}

function getTotal()
{
   var count=temp.count;
    console.log("kk",count);
         numberOfPages = Math.ceil(count / pageSize);
           console.log(numberOfPages);
        buttons = '';
            for( i=1; i<=numberOfPages; i++)
            {
                pageNumber=i;
             buttons += '<button class="btn" style="margin-left:2px;" onclick="showprojects('+pageNumber+')">'  + pageNumber + '</button>';
            }
           // console.log("totaldata",data);
            $('#pagin').html(buttons);
            showPage = function(page) {
                $(".line-content").hide();
                $(".line-content").each(function(n) {
                    if (n >= pageSize * (pageNumber - 1) && n < pageSize * page)
                        $(this).show();
                }); 
            }
    
        }


function createtechstack(){
     $.ajax({
        url: 'http://localhost:5000/userhomepage/getskills',
        type: 'GET',
        dataType: 'json', 
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
        "Skills": "none",
        //"token":token
		}
	$.ajax({
		url: 'http://localhost:5000/adminhomepage/adduser',
        type: 'POST',
        dataType: 'json',
	   data: datafornewuser,
//        headers: {
//             			"Content-Type": "application/json",
//			            "cache-control": "no-cache" ,
//                        "Authorization": token
//                         },
        success: function(res){
                      alert("user has been added");
					  window.location="adminhomepage.html";
         },
			error:function(err){
                //alert(err);
            }				
        });
}

function user()
{
   // $("#tbodyid").empty();
  //console.log("show=",temp.users);    
  var table=document.getElementById("userbodyid");
 $("#userbodyid").empty();
  for (var i=0; i<temp.users.length; i++){
            var row=table.insertRow(table.length);
            row.insertCell(0).innerHTML=i+1;
            row.insertCell(1).innerHTML=temp.users[i].Username;
            row.insertCell(2).innerHTML=temp.users[i].Skills;
                }
     var countusers=temp.users.length;
console.log("usercount",countusers);
   
   
				 
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
        success: function(res)
								{
						alert("Skill has been added");
						window.location="adminhomepage.html";
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
        success: function(res)
							{
                      alert("Project has been added");
					  window.location="adminhomepage.html";
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
//                        row.insertCell(3).innerHTML=`
//                            <input type='button' value='Add' class='btn btn-lg btn-warning mx-2' data-toggle='modal' data-target='' onclick="usertoproject(${usermatched[i]._id},${usermatched[i].Username})">
//                        `;
                
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
		data: dataforassign,
        success: function(res)
							{
                              //  console.log(res);
							alert("Project has been updated succesfully");
							//window.location="adminhomepage.html";
							}				
        });

    
}