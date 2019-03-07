
//requiring files
const express=require('express');
const app=express();
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const jwt = require("jsonwebtoken");
const checkAuth=require('./middleware/checkAuth');
var cors = require('cors')
require('dotenv').config();

//Enabling Cors
app.use(cors())
app.use( (req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  next();
});

//database connection
mongoose.Promise=global.Promise;
mongoose.connect('mongodb://localhost/HRMS',{useMongoClint:true})
.then(()=> console.log('MongoDB Connected...'))
.catch(err =>console.log(err));

//defining mongoose variables
require('./model/project');
const projectmod=mongoose.model('project');

require('./model/users');
const usermod=mongoose.model('users');

require('./model/skills');
const skillmod=mongoose.model('skills');

//body parser for getting data
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

//test
app.get('/', (req,res)=>{
   res.send("hello");
});

//getting skills for user
app.get('/userhomepage/getskills',checkAuth, (req,res)=>{
  skillmod.find({})
 .then(skills => { res.send({skills:skills})})
});

//add skills in skill table
app.post('/adminhomepage/addskill',checkAuth, (req,res)=>{
  	console.log(req.body);
   const skill={
    Skillsname:(req.body.Skillsname)
   }
   new skillmod(skill)
   .save()
   .then(()=> {return res.status(200).json({
                          message:'skill has been added'
                         });console.log('done.........')})
   .catch(err =>console.log(err));
});
//get one user
app.get('/userhomepage/getuserdetails/:Username', (req,res)=>{
  usermod.findOne({
	Username:req.params.Username
  })
 .then(users => { res.send({users:users})})
});

//add in user table
app.post('/adminhomepage/adduser',checkAuth,(req,res)=>{
   //console.log(req.body);
   usermod.find({Username:req.body.Username})
     .exec()
     .then(users =>{
      if(users.length >= 1){
        return res.status(409).json({
          message:'Mail Exists'
        });
      }
      else{
          bcrypt.hash(req.body.Password,10,(err,hash)=>{
            if(err){
              return res.status(500).json({
                error:err
                 });
               }
            else{
             const user={
                  Username:(req.body.Username),
                  Password:hash,
                  Usertype:(req.body.Usertype),
                  Skills:(req.body.Skills)
                  }
             console.log(user);
             new usermod(user)
             .save()
             .then(()=>{ return res.status(200).json({
                          message:'user has been added'
                         });console.log('done.........')})
             .catch(err =>{console.log(err)});
            }
         })
      }
   })
   
});
//login api
app.post('/login', (req,res,next)=>{
  usermod.find({Username:req.body.Username})
    .exec()
    .then(user =>{
      if(user < 1){
        return res.status(404).json({
          message: 'not found'
        })
      }
      else{
        bcrypt.compare(req.body.Password, user[0].Password, (err,result)=>{
          if(err){
            return res.status(401).json({
              message: 'login failed'
            });
          }
          else{
              //token
              const token=jwt.sign({
                Username:user[0].Username,
                Usertype:user[0].Usertype
              },
               process.env.JWT_KEY,
               {
                expiresIn: "1h"
               }
              );

              return res.status(200).json({
                message: 'login successfull',
              token:token,
              role:user[0].Usertype,
              username:user[0].Username
              });
                        
          }
          res.status(401).json({
          message: "Auth failed"
          });
        });
       }
    })
  .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
});
//get matched user
app.get('/userhomepage/matcheduserdetails/', (req,res)=>{
 usermod.find()
.then(users => {res.send({users:users})
 });
});

//update user skills
app.put('/adminhomepage/updateUserskills/:Username',(req,res)=>{
usermod.findOne({
  Username:req.params.Username
})
.then(users => {
      
      users.Username = req.body.Username;
      users.Password = req.body.Password;
      users.Usertype = req.body.Usertype;
      users.Skills = req.body["Skills[]"];
      console.log(req.body["Skills[]"]); 
      users.save()
      });
 });

//get projects
app.get('/adminhomepage/getprojects/:pno',checkAuth, (req,res)=>{

console.log(req.headers)
//projectmod.find().count().then(count=>{res.send({count:count})});
var pageNo;
var pageSize=10;

  //var count = projectmod.find({}).count();
// if(req.params.pno=='undefined')
// {
//   pageNo=1;
//   pageSize=4;

//   console.log("PAGE SIZE inside if",req.params)
// }

pageNo=parseInt(req.params.pno);


console.log("PAGE SIZE",pageSize);
  
  var skip=pageSize*(pageNo-1);
  projectmod.find().limit(pageSize).skip(skip)
 .then(project => { usermod.find()
  .then(users => {projectmod.find().count()
   .then(count=> {res.send({count:count,users:users, project:project})})})});
});

//add projects
app.post('/adminhomepage/addproject', (req,res)=>{
   console.log(req.body);
   const prjt={
   	Projectname:(req.body.Projectname),
   	Projectdesc:(req.body.Projectdesc),
   	Techstack:(req.body['Techstack[]']),
   	Userassigned:(req.body.Usersassigned)
   }

   new projectmod(prjt)
   .save()
   .then(()=>{return res.status(200).json({
                          message:'project has been added'
                         }); console.log('done.........')})
   .catch(err =>console.log(err));

});

//select one project for update
app.get('/adminhomepage/getOneprojects/:id', (req,res)=>{
 projectmod.findOne({
   _id:req.params.id
 })
 .then(project => { res.send({project:project})})
});

//update the one project
app.put('/adminhomepage/updateproject/:id',(req,res)=>{
 projectmod.findOne({
  _id:req.params.id
 })  
 .then(project => {
      console.log(req.body);
      project.Projectname = req.body.Projectname;
      project.Projectdesc = req.body.Projectdesc;
      project.Techstack = req.body.Techstack;
      project.Userassigned = req.body.Userassigned; 
      project.save();
      });
});

//delete project
app.delete('/adminhomepage/deleteproject/:id', (req,res)=>{
 projectmod.deleteOne({_id:req.params.id})
 .then(()=> res.send({}))
.catch(err =>console.log(err));
});
//assigning user to project
app.put('/adminhomepage/assignusertoproject/:id',(req,res)=>{
  projectmod.findOne({
  _id:req.params.id
 })
 .then(project => {
      console.log(req.body);
      project.Projectname = req.body.Projectname;
      project.Projectdesc = req.body.Projectdesc;
      project.Techstack = req.body["Techstack[]"];
      project.Userassigned=req.body.Userassigned;
      project.save()
      });

 });
//ser starting
const port=5000;
app.listen(port, ()=>{
console.log("server started on the port "+port);
});



