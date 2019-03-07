const jwt=require('jsonwebtoken');
//var tokenVal = null
module.exports = (req,res,next)=>{
	try{
		var token = req.headers.authorization.split(" ")[1];
 
		//tokenVal = req.get('Authorization')
		console.log("okbabya",token);
		const decoded=jwt.verify(token, process.env.JWT_KEY);
		next();
	}
	catch(error){
		return res.status(401).json({
			message: "auth failed",
			//token: req.headers.Authorization
		})
	}
}