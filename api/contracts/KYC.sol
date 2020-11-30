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

    event LogAddCustomer(address customerAddr);
    event LogContractStopped();
    event LogClearCustomer(address customerAddr);
    
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
    public view returns (bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided, bool exists) {
        signature = customers[customerAddr].signature;
        verifiedBy = customers[customerAddr].verifiedBy;
        verifiedAt = customers[customerAddr].verifiedAt;
        documentProvided = customers[customerAddr].documentProvided;
        exists = customers[customerAddr].exists;
        return (signature, verifiedBy, verifiedAt, documentProvided, exists);
    }

    function addCustomer(address customerAddr, bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided) 
    public isNotStopped() isNotCustomer(customerAddr) {
        emit LogAddCustomer(customerAddr);
        customers[customerAddr] = Customer({signature: signature, verifiedBy: verifiedBy, verifiedAt: verifiedAt, documentProvided: documentProvided, exists: true});
        customerCount = customerCount + 1;
    }

    function clearCustomer(address customerAddr)
    public isNotStopped() {
        emit LogClearCustomer(customerAddr);
        customers[customerAddr].signature = "";
        customers[customerAddr].verifiedBy = address(0);
        customers[customerAddr].verifiedAt = "";
        customers[customerAddr].documentProvided = "";
        customers[customerAddr].exists = false;
    }

    // Implement circuit breaker design pattern
    function stopContract()
    public onlyOwner() {
        emit LogContractStopped();
        stopped = true;
    }

    // Implement mortal design pattern
    function kill()
    public onlyOwner()
    {
           selfdestruct(address(uint160(owner()))); // cast owner to address payable
    }

}