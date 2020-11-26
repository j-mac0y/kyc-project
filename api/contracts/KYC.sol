pragma solidity >=0.4.22 <0.8.0;

contract KYC {
    
    address public owner;
    uint public customerCount;

    // Store customers in a mapping
    mapping (address => Customer) private customers;

    address[] private verifiers;

    struct Customer {
        bytes signature;
        address verifiedBy;
        string verifiedAt;
        string documentProvided;
        bool exists;
    }

    event LogNewCustomer(address customerAddr);

    modifier isOwner() {
        require(msg.sender == owner);
        _;
    }

    modifier isNotCustomer(address customerAddr) {
        require(!customers[customerAddr].exists);
        _;
    }

    constructor() public {
        // Set the account that instantiated the contract as the owner
        owner = msg.sender;
        customerCount = 0;
    }

    function getCustomer(address customerAddr) public view returns (bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided, bool exists) {
        signature = customers[customerAddr].signature;
        verifiedBy = customers[customerAddr].verifiedBy;
        verifiedAt = customers[customerAddr].verifiedAt;
        documentProvided = customers[customerAddr].documentProvided;
        exists = customers[customerAddr].exists;
        return (signature, verifiedBy, verifiedAt, documentProvided, exists);
    }

    function addCustomer(address customerAddr, bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided) 
    public isOwner() isNotCustomer(customerAddr) returns(bool) {
        emit LogNewCustomer(customerAddr);
        customers[customerAddr] = Customer({signature: signature, verifiedBy: verifiedBy, verifiedAt: verifiedAt, documentProvided: documentProvided, exists: true});
        customerCount = customerCount + 1;
        return true;
    }

}