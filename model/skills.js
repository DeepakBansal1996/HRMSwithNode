const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const SkillsSchema=new Schema({
     Skillsname:{
         type:String,
         required:true
     }	
})

mongoose.model('skills', SkillsSchema);