pragma solidity >=0.4.22 <0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

contract KYC is Ownable {
    
    uint public customerCount;
    bool public stopped;

    // Store customers in a mapping
    mapping (address => Customer) private customers;

    struct Customer {
        bytes signature;
        address verifiedBy;
        string verifiedAt;
        string documentProvided;
        bool exists;
    }

    event LogNewCustomer(address customerAddr);
    event LogContractStopped();
    
    modifier isNotCustomer(address customerAddr) {
        require(!customers[customerAddr].exists);
        _;
    }

    // Implement circuit breaker pattern
    modifier isNotStopped() {
        require(!stopped);
        _;
    }

    constructor() public {
        // Set the account that instantiated the contract as the owner
        customerCount = 0;
        stopped = false;
    }

    function getCustomer(address customerAddr) 
    public view isNotStopped() returns (bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided, bool exists) {
        signature = customers[customerAddr].signature;
        verifiedBy = customers[customerAddr].verifiedBy;
        verifiedAt = customers[customerAddr].verifiedAt;
        documentProvided = customers[customerAddr].documentProvided;
        exists = customers[customerAddr].exists;
        return (signature, verifiedBy, verifiedAt, documentProvided, exists);
    }

    function addCustomer(address customerAddr, bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided) 
    public isNotStopped() isNotCustomer(customerAddr) returns(bool) {
        emit LogNewCustomer(customerAddr);
        customers[customerAddr] = Customer({signature: signature, verifiedBy: verifiedBy, verifiedAt: verifiedAt, documentProvided: documentProvided, exists: true});
        customerCount = customerCount + 1;
        return true;
    }

    // Implement circuit breaker design pattern
    function stopContract()
    public onlyOwner() returns(bool) {
        emit LogContractStopped();
        stopped = true;
        return true;
    }

    // Implement mortal design pattern
    function kill()
    public onlyOwner()
    {
           selfdestruct(address(uint160(owner()))); // cast owner to address payable
    }

}