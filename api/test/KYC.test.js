const catchRevert = require("./exceptionsHelpers.js").catchRevert
const KYC = artifacts.require('KYC');

contract('KYC', function(accounts) {
    const jamesBank = accounts[0];
    const alice = accounts[1];
    const bob = accounts[2];

    let kyc;

    beforeEach(async () => {
        kyc = await KYC.new({from: jamesBank});
    })

    it("should add a Customer with the provided data", async() => {
        const signature = "0x9513dde33c2c331434f13a219314605ada5ad15b618770fc789c8d32d2f502de4434cf9ae6e976025246bec6084284ddbbc097f3b73a7b1f846e30d9eddbe7a51c";
        const verifiedBy = jamesBank;
        const verifiedAt = "1606086072714";
        const documentProvided = "Australian Drivers License";
        await kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank});
        
        const result = await kyc.getCustomer(alice, {from: jamesBank});
        assert.equal(result[0], signature, 'The signature of the customer does not match the stored value');
        assert.equal(result[1], verifiedBy, 'The verifiedBy of the customer does not match the stored value');
        assert.equal(result[2], verifiedAt, 'The verifiedAt of the customer does not match the stored value');
        assert.equal(result[3], documentProvided, 'The documentProvided of the customer does not match the stored value');
        assert.equal(result[4], true, 'The exists value of the customer does not match the stored value');
    })

    it("should log an event when a new Customer is added", async() => {
        const signature = "0x9513dde33c2c331434f13a219314605ada5ad15b618770fc789c8d32d2f502de4434cf9ae6e976025246bec6084284ddbbc097f3b73a7b1f846e30d9eddbe7a51c";
        const verifiedBy = jamesBank;
        const verifiedAt = "1606086072714";
        const documentProvided = "Australian Drivers License";
        const tx = await kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank});
        
        assert.equal(tx.logs[0].event, "LogAddCustomer", 'should emit an event when a new Customer is added');
    })

    it("should not allow the same account to verify twice", async() => {
        let signature = "0x9513dde33c2c331434f13a219314605ada5ad15b618770fc789c8d32d2f502de4434cf9ae6e976025246bec6084284ddbbc097f3b73a7b1f846e30d9eddbe7a51c";
        let verifiedBy = jamesBank;
        let verifiedAt = "1606086072714";
        let documentProvided = "Australian Drivers License";
        await kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank});
        
        // Change the data and attempt to add using Alice's account again
        signature = "0x521e27f7e427b79263f769c6b61476b855da7930339fc501e456c0651748718b57610be1fd4dd40fd33d30ae7aaf2fde850a2ad1d74f8b7ffc31e7e0e78190a41b";
        verifiedBy = jamesBank;
        verifiedAt = "1606370530198";
        documentProvided = "Australian Drivers License";
        await catchRevert(kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank}));
    })

    it("should not run if stopped", async() => {
        let signature = "0x9513dde33c2c331434f13a219314605ada5ad15b618770fc789c8d32d2f502de4434cf9ae6e976025246bec6084284ddbbc097f3b73a7b1f846e30d9eddbe7a51c";
        let verifiedBy = jamesBank;
        let verifiedAt = "1606086072714";
        let documentProvided = "Australian Drivers License";
        await kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank});

        // Stop the contract and test that the functions are no longer callable
        await kyc.stopContract({from: jamesBank});
        await catchRevert(kyc.getCustomer(alice, {from: jamesBank}));
        await catchRevert(kyc.addCustomer(bob, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank}));
    })

    it("should only allow an owner to stop or kill the contract", async() => {
        await catchRevert(kyc.stopContract({from: alice}));
        await catchRevert(kyc.kill({from: alice}));
    })

    it("should reset customer data completely upon clear", async() => {
        const initialCustomer = await kyc.getCustomer(alice, {from: jamesBank});

        let signature = "0x9513dde33c2c331434f13a219314605ada5ad15b618770fc789c8d32d2f502de4434cf9ae6e976025246bec6084284ddbbc097f3b73a7b1f846e30d9eddbe7a51c";
        let verifiedBy = jamesBank;
        let verifiedAt = "1606086072714";
        let documentProvided = "Australian Drivers License";
        await kyc.addCustomer(alice, signature, verifiedBy, verifiedAt, documentProvided, {from: jamesBank});
        await kyc.clearCustomer(alice, {from: jamesBank});
        
        const clearedCustomer = await kyc.getCustomer(alice, {from: jamesBank});
        assert.equal(initialCustomer.signature, clearedCustomer.signature, 'The signature of the customer does not match the cleared customer value');
        assert.equal(initialCustomer.verifiedBy, clearedCustomer.verifiedBy, 'The verifiedBy of the customer does not match the cleared customer value');
        assert.equal(initialCustomer.verifiedAt, clearedCustomer.verifiedAt, 'The verifiedAt of the customer does not match the cleared customer value');
        assert.equal(initialCustomer.documentProvided, clearedCustomer.documentProvided, 'The documentProvided of the customer does not match the cleared customer value');
        assert.equal(initialCustomer.exists, clearedCustomer.exists, 'The exists value of the customer does not match the cleared customer value');
    })
})