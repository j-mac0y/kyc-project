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
        const id = "3d5b4a7c-8a12-4041-9ba5-4c97ca212702";
        const signature = "PZ6n2k2r9cu6HUzA33NEskam4ye/7phfja8/C54CM4UlV2NhmETydcsMV6yeAND+FzQXNvGQaGUss0kz6KVIlueYrVpVWbs4vuFDOniUe8euI6mpHr+O596tcoaKV6UBIEezX2HP0rCNW/c46aBFAbbQRzEpYs34K9yvfc7sxLk=";
        const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBPpTDpu+MRRfnjf7XbbQoqNzeYFnmftecJnDuhhg76RsBG8R+ztZYU25ot5qyf5mSCbWgFdEq/GM36qX//Sbz+SaLTBhhUpfY5iMx94s4qfI8oy/8oN51wB8xCFw7U5RHeEY+8u62bDIyzlf3DBOlabRtRJzaBCbVU2JjHait/wIDAQAB";
        const timestamp = "1606086072714";
        await kyc.addCustomer(id, signature, publicKey, timestamp);
        const result = await kyc.getCustomer.call(id);
        
        assert.equal(result[0], signature, 'The signature of the customer does not match the stored value');
        assert.equal(result[1], publicKey, 'The public key of the customer does not match the stored value');
        assert.equal(result[2], timestamp, 'The timestamp of the customer does not match the stored value');
    })

    it("should log an event when a new Customer is added", async() => {
        const id = "3d5b4a7c-8a12-4041-9ba5-4c97ca212702";
        const signature = "PZ6n2k2r9cu6HUzA33NEskam4ye/7phfja8/C54CM4UlV2NhmETydcsMV6yeAND+FzQXNvGQaGUss0kz6KVIlueYrVpVWbs4vuFDOniUe8euI6mpHr+O596tcoaKV6UBIEezX2HP0rCNW/c46aBFAbbQRzEpYs34K9yvfc7sxLk=";
        const publicKey = "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBPpTDpu+MRRfnjf7XbbQoqNzeYFnmftecJnDuhhg76RsBG8R+ztZYU25ot5qyf5mSCbWgFdEq/GM36qX//Sbz+SaLTBhhUpfY5iMx94s4qfI8oy/8oN51wB8xCFw7U5RHeEY+8u62bDIyzlf3DBOlabRtRJzaBCbVU2JjHait/wIDAQAB";
        const timestamp = "1606086072714";
        const tx = await kyc.addCustomer(id, signature, publicKey, timestamp);
        
        assert.equal(tx.logs[0].event, "LogNewCustomer", 'should emit an event when a new Customer is added');
    })
})