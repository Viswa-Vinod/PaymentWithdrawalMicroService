
const chai = require('chai');
var expect = chai.expect;
var sinon = require('sinon');
const paymentModel = require('../payment-model');
const PaymentSvc = require('../PaymentService')



describe('The payment service module', function () {  
  beforeEach(() => {
    this.sandbox = sinon.sandbox.create();
  });

  afterEach(() => {
    this.sandbox.restore();
  });

  const paymentSvc = new PaymentSvc();
  const userID = "u01";
  
  const reqTime = Date.now();   

  it('should return updated balance if amt requested is within balance and is not part of a concurrent request', function * () {
    let amt = 2;
    const userDB = [{userID: "u01", updatedAt: new Date(Date.now() - 600), bal: 1000}];
    const findStub = this.sandbox.stub(paymentModel, 'find', (userObj, cb)=>{cb(null, userDB)}) ;
    const findOneAndUpdateStub  = this.sandbox.stub(paymentModel, 'findOneAndUpdate', 
                                  (userObj, updatedUserObj, cb) => {
                                    cb(null,1);
                                  });  
  
      
    const result = yield paymentSvc.withdraw(userID, amt, Date.now())
    
    expect(findStub).to.have.been.calledWith({userID: userID});
    expect(paymentSvc.processRequest).to.have.been.calledWith(reqTime, userDB.updatedAt, userDB[0], amt);
    expect(findOneAndUpdateStub).to.have.been.calledWith({userID: userID}, {bal:998, updatedAt: reqTime});
    expect(result).to.equal(998);
  
  });

  it('should return "insufficient balance" message if amt requested is greater than balance', function * () {
    let amt = 3000;
    const userDB = [{userID: "u01", updatedAt: new Date(Date.now() - 600), bal: 1000}];
    const findStub = this.sandbox.stub(paymentModel, 'find', (userObj, cb)=>{cb(null, userDB)}) ;
    const findOneAndUpdateStub  = this.sandbox.stub(paymentModel, 'findOneAndUpdate', 
                                  (userObj, updatedUserObj, cb) => {
                                    cb(null,1);
                                  });     
    
    
          
    const result = yield paymentSvc.withdraw(userID, amt, Date.now())
    
    expect(findStub).to.have.been.calledWith({userID: userID});
    
    expect(paymentSvc.processRequest).to.have.been.calledWith(reqTime, userDB.updatedAt, userDB[0], amt);
    expect(findOneAndUpdateStub).to.not.have.been.called();
    expect(result).to.deep.equal("insufficient balance");
    
  });

  it('should return "transaction rejected" message if request is within 5min of previous request', function * () {
    let amt = 2;
    const userDB = [{userID: "u01", updatedAt: new Date(Date.now() - 200), bal: 1000}];
    const findStub = this.sandbox.stub(paymentModel, 'find', (userObj, cb)=>{cb(null, userDB)}) ;
    const findOneAndUpdateStub  = this.sandbox.stub(paymentModel, 'findOneAndUpdate', 
                                  (userObj, updatedUserObj, cb) => {
                                    cb(null,1);
                                  });     
    
    
    const result = yield paymentSvc.withdraw(userID, amt, Date.now());

    expect(findStub).to.have.been.calledWith({userID: userID});
    expect(paymentSvc.processRequest).to.have.been.calledWith(reqTime, userDB.updatedAt, userDB[0], amt);
    expect(findOneAndUpdateStub).to.not.have.been.called();
    expect(result).to.equal("Transaction rejected");
    
  });
});