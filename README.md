# PaymentWithdrawalMicroService
sample payment microservice in node, express, mongo,mongoose with unit tests

Assumptions and My Understanding of the Requirements of the Skill Test: 

This skill exercise is not testing me on how I design the microservice architecture for the overall Payment Service application. 

Rather, the architecture is already designed and I need to implement one of the specified microservices.

authorization and authentication is handled by some other microservice and creating those microservices is not part of this skill test. 

Logging service of transactions is a separate microservice. I am not required to show that here. 

The database for the purpose of this skill test is be very simple -  one collection (named useraccts) having a set of documents with each document having a userID and balance. eg {userID: "u01", bal: 2000}

userID and amt are sent as url parameters and not through a form body. 

When amount requested is more than the balance, there is no need to update the database. It is sufficient to simply reject the request.



The deliverables do not require me to submit a deployed application. 

Comment on approach: 
Regarding, handling concurrent requests, my approach is as follows: there is always a fraction of a difference between two requests. Node queues them up based on that little difference. So the logic is going to check whether the difference between the current request and the last transaction time is greater than a specified consifgurable time. Only then will the second request get processed. In my example, I have set that to 5 min (=300s).

Unit Tests: 

The unit tests for the paymentservice are in the tests folder. Only 2 out of the 3 unit tests work. The third one, for testing concurrent requests is not working. I have nevertheless uploaded it to get help on the matter. The issue is that the tests times out. 


To run the application, run the following commands:

npm install
node server.js

You'll also need a mongoDB locally installed with default DB privileges (none). It should be accessible through "mongodb://127.0.0.1/pnplabs"
alternatovely, the environment must set the url to the DB through the PROCESS.ENV.URl variable. Further the environment must also set the PROCESS.ENV.PORT variable. 

The db must have a database called 'pnplabs'
The database should have a collection called 'useraccts'
The collection should have sample data in the form {userID: "u01", bal: 2000}

Once the node server starts listening on port 3000, you can go to 
http://localhost:3000/withdrawal/u01/23    (where the lat two url parameters are the userID and amount)

and get the balance displayed in the browser from the server

Any other api point called will error out. 

