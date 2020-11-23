pragma solidity >=0.4.22 <0.8.0;

contract KYC {
    address public owner;
    uint public customerCount;

    // Store customers by unique ID
    mapping (string => Customer) private customers;

    struct Customer {
        string signature;
        string publicKey;
        string timestamp;
    }

    event LogNewCustomer(string id);

    constructor() public {
        owner = msg.sender;
        customerCount = 0;
    }

    function getCustomer(string memory id) public view returns (string memory signature, string memory publicKey, string memory timestamp) {
        signature = customers[id].signature;
        publicKey = customers[id].publicKey;
        timestamp = customers[id].timestamp;
        return (signature, publicKey, timestamp);
    }

    function addCustomer(string memory id, string memory signature, string memory publicKey, string memory timestamp) public returns(bool) {
        emit LogNewCustomer(id);
        customers[id] = Customer({signature: signature, publicKey: publicKey, timestamp: timestamp});
        customerCount = customerCount + 1;
        return true;
    }

}