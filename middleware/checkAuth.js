const jwt=require('jsonwebtoken');
//var tokenVal = null
module.exports = (req,res,next)=>{
	try{
		tokenVal = req.get('Authorization')
		const decoded=jwt.verify(req.get('Authorization'), process.env.JWT_KEY);
		next();
	}
	catch(error){
		return res.status(401).json({
			message: "auth failed",
			//token: req.headers.Authorization
		})
	}
}