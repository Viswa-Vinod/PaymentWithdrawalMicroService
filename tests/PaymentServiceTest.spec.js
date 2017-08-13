
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');

const moment = require('moment');

const expect = chai.expect;
const sinon = require('sinon');
const paymentModel = require('../payment-model');
const PaymentSvc = require('../PaymentService')
const paymentSvc = new PaymentSvc();
chai.use(chaiAsPromised);

describe('The payment service module', function () {  
  var sandbox;
  const userID = "u01";  
  const reqTime = moment(Date.now());    

  beforeEach(() => {
  
    sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    sandbox.restore();
  
  });
  

  it('should return updated balance if amt requested is within balance and is not part of a concurrent request', function  () {
    let amt = 2;
    const userDB = [{userID: "u01", createdAt: Date.now() - 1200000, updatedAt: Date.now()/1000 - 600, bal: 1000}];
    const findStub = sandbox.stub(paymentModel, 'find').callsFake( (userObj, cb)=>{cb(null, userDB)}) ;
    const findOneAndUpdateStub  = sandbox.stub(paymentModel, 'findOneAndUpdate').callsFake( 
                                  (userObj, updatedUserObj, cb) => {
                                    cb(null,1);
                                  });  
    
      
      var result = paymentSvc.withdraw(userID, amt, reqTime);
      return expect(result).to.eventually.equal(998);   
   
  });

  it('should return insufficient balance message if amt requested is greater than balance', function  () {
    let amt = 3000;
    const userDB = [{userID: "u01", createdAt: Date.now() - 1200000, updatedAt: Date.now()/1000 - 600, bal: 1000}];
    const findStub = sandbox.stub(paymentModel, 'find').callsFake((userObj, cb)=>{cb(null, userDB)}) ;
    // const findOneAndUpdateStub  = sandbox.stub(paymentModel, 'findOneAndUpdate', 
    //                               (userObj, updatedUserObj, cb) => {
    //                                 cb(null,1);
    //                               });     
    
      var result = paymentSvc.withdraw(userID, amt, reqTime);
      return expect(result).to.be.rejectedWith("insufficient balance");   
      //return expect(result).to.eventually.be("sdfsdfsdf");
   
    
  });

  it('should return "transaction rejected" message if request is within 5min of previous request', function () {
    this.timeout(15000);
    let amt = 2;
    const userDB = [{userID: "u01", createdAt: Date.now() - 1200000, updatedAt: Date.now()/1000 - 200, bal: 1000}];
    const findStub = sandbox.stub(paymentModel, 'find').callsFake((userObj, cb)=>{cb(null, userDB)}) ;
    // const findOneAndUpdateStub  = sandbox.stub(paymentModel, 'findOneAndUpdate', 
    //                               (userObj, updatedUserObj, cb) => {
    //                                 cb(null,1);
    //                               });     
   
    var result = paymentSvc.withdraw(userID, amt, reqTime);
    return expect(result).to.be.rejectedWith("Transaction rejecte"); 
   
  });
});