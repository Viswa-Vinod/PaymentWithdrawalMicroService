
const paymentModel = require('./payment-model');
// const moment		= require('moment');
const minTimeBetweenTransInSeconds = 300; 


class PaymentService {

	
		
	withdraw(userID, amt, reqTime) {
		//express-timestamp generates a moment object that needs to be converted to a date object
		reqTime = reqTime.toDate(); 
		

		return new Promise((resolve, reject) => {

			paymentModel.find({userID: userID}, (err, userAcct) => {
					
					let userAcctObj = userAcct[0];

				if (err) reject('error fetching user');
				
				else {
						var latestTrans;
					
					//chk if there is an updatedAt value available against the user's balance
					
					if (userAcctObj.updatedAt) {
						latestTrans = userAcctObj.updatedAt;
					
					}
					//if updatedAt is not available then chk if createdAt is available
					else if (userAcct[0].createdAt) {
							latestTrans = userAcctObj.createdAt;
						} 
					//if neither are available simply set latestTrans to reqTime	
					else {
							latestTrans = reqTime;
						}					
						this.processRequest(reqTime, latestTrans, userAcctObj,amt)
						.then(result => resolve(result))
						.catch(err => reject(err));			
				}//end of else of getting userAcct from DB

				
			}); //end of paymentModel.find
		});//end of return new Promise
	} //end of withdraw function

	processRequest(reqTime, latestTrans, userAcctObj, amt) {

		return new Promise((resolve, reject) => {
			
			var timeDiff = (reqTime- latestTrans)/1000
					

					//timeDiff between 2 transactions is greater than 5min
					if (timeDiff >= minTimeBetweenTransInSeconds) {
						var bal = userAcctObj.bal;

						//chk if amt requested is more than balance
						if (amt > bal) reject("insufficient balance");
						
						//amt requested is less than or equal to balance
						else { 
								bal = bal - amt;
								userAcctObj.bal = bal;
								
								if ((userAcctObj.createdAt)===undefined) {userAcctObj.createdAt=reqTime; } ;
								
								
								var updatedData = {bal:userAcctObj.bal, 
													updatedAt: reqTime,
													createdAt: userAcctObj.createdAt
													} ;
								
								paymentModel.findOneAndUpdate({userID: userAcctObj.userID}, updatedData, (err, val) => {
									
									if (err) throw(err);

									resolve(bal);
								});												
						} //end of else of amt > bal	
					}//end of if timeDiff

					else reject("Transaction rejected");
		
		});//end of Promise
	}//end of processRequest 
}//end of class PaymentService

module.exports = PaymentService;