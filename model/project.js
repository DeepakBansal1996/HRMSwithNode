const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const ProSchema = new Schema({
	Projectname:{
		type:String,
		required:true
	},

	Projectdesc:{
        type:String,
		required:true
	},

	Techstack:{
		type:Array,
		required:true
	},

	Userassigned:{
		type:Array,
		
	}
});

mongoose.model('project',ProSchema);