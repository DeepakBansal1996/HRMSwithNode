if(process.env.NODE_ENV =='production'){
	module.exports = {mongoURI: 'mongodb+srv://DeepakBansal123:Deepak@deepak-b51yv.mongodb.net/test?retryWrites=true'}
} 
else 
{
   module.exports = {mongoURI: 'mongodb://localhost/HRMS'}	
}