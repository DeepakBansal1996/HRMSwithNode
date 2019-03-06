const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const UserSchema=new Schema({
	
	Username:{
		type:String,
		required:true
	},
	Password:{
		type:String,
		required:true
	},
	Usertype:{
		type:String,
		required:true
	},
	Skills:{ type:Array}
})

mongoose.model('users', UserSchema);