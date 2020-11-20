const _deploy_contracts = require("../migrations/2_deploy_contracts");

let KYC = artifacts.require('KYC');

contract('KYC', function(accounts) {
    const owner = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    let kyc;

    beforeEach(async () => {
        kyc = await KYC.new();
    })

    it("should add a Customer with the provided data", async() => {
        const id = address(0);
        const signature = address(0);
        const publicKey = address(0);
        const timestamp = address(0);
        const tx = await kyc.addCustomer(id, signature, publicKey, timestamp);
        const result = await kyc.getCustomer.call(id);
        
        assert.equal(result[0], id, 'The name of the customer does not match the added value');
    })
})