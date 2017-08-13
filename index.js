const express 				= 			require('express');
const app 					= 			express();
const mongoose 				= 			require('mongoose');
const PaymentService 		= 			require('./PaymentService');
const time 					=			require('express-timestamp');
const paymentSvc 			= 			new PaymentService();


//db set-up
let url 			= 			process.env.DATABASEURL || "mongodb://127.0.0.1/pnplabs"
mongoose.connect(url);

//set up middleware
app.use(time.init);
app.use(function(req,res, next){
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

	next();
});



//set up route
app.get("/withdrawal/:userID/:amt", (req,res) => {

	paymentSvc.withdraw(req.params.userID, req.params.amt, req.timestamp)
			.then(bal => {
				
				res.status(200).json(bal);
			})
			.catch(err => {
				res.status(400).json(err);
			}); 
});


//listen for requests
app.listen((process.env.PORT || 3000), function(){

	console.log("pnplabs server is listening...");
});
