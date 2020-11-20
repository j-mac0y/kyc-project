pragma solidity >=0.4.22 <0.8.0;

contract KYC {
    address public owner;
    uint public customerCount;

    // Store customers by unique ID
    mapping (bytes32 => Customer) private customers;

    struct Customer {
        bytes32 signature;
        bytes32 publicKey;
        bytes16 timestamp;
    }

    event LogNewCustomer(bytes32 id);

    constructor() public {
        owner = msg.sender;
        customerCount = 0;
    }

    function getCustomer(bytes32 id) public view returns (bytes32 signature, bytes32 publicKey, bytes16 timestamp) {
        signature = customers[id].signature;
        publicKey = customers[id].publicKey;
        timestamp = customers[id].timestamp;
        return (signature, publicKey, timestamp);
    }

    function addCustomer(bytes32 id, bytes32 signature, bytes32 publicKey, bytes16 timestamp) public payable returns(bool) {
        emit LogNewCustomer(id);
        customers[id] = Customer({signature: signature, publicKey: publicKey, timestamp: timestamp});
        customerCount = customerCount + 1;
        return true;
    }

}