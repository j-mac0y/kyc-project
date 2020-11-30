pragma solidity >=0.4.22 <0.8.0;
import "@openzeppelin/contracts/access/Ownable.sol";

// @title Know Your Customer prototype
// @author j-mac0y (GitHub)
// @notice This contract is only a prototype and should not be used in production. It stores details of identity verification performed on customers by a financial institution, so that the verification only has to be done once for each customer.
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

    // @notice Get signature and validation details of a customer from the customer mapping by address
    // @param address The account address of the customer
    // @return All customer details stored in the Customer struct
    function getCustomer(address customerAddr) 
    public view returns (bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided, bool exists) {
        signature = customers[customerAddr].signature;
        verifiedBy = customers[customerAddr].verifiedBy;
        verifiedAt = customers[customerAddr].verifiedAt;
        documentProvided = customers[customerAddr].documentProvided;
        exists = customers[customerAddr].exists;
        return (signature, verifiedBy, verifiedAt, documentProvided, exists);
    }

    // @notice Add a new customer to the mapping, showing the details of their identity verification
    // @param customerAddr The account address of the customer to add
    // @param signature The signature of the customer (hashed and encrypted on client side)
    // @param verifiedBy The account that verified them (same as the customer for this prototype)
    // @param verifiedAt Time the user was verified using UTC timestamp since epoch format
    // @param documentProvided The document used to verify the details they provided (hard coded - out of scope for prototype)
    function addCustomer(address customerAddr, bytes memory signature, address verifiedBy, string memory verifiedAt, string memory documentProvided) 
    public isNotStopped() isNotCustomer(customerAddr) {
        emit LogAddCustomer(customerAddr);
        customers[customerAddr] = Customer({signature: signature, verifiedBy: verifiedBy, verifiedAt: verifiedAt, documentProvided: documentProvided, exists: true});
        customerCount = customerCount + 1;
    }

    // @notice Clears verification details for a customer. 
    // @dev For demonstration purposes only, should be disabled in production.
    function clearCustomer(address customerAddr)
    public isNotStopped() {
        emit LogClearCustomer(customerAddr);
        customers[customerAddr].signature = "";
        customers[customerAddr].verifiedBy = address(0);
        customers[customerAddr].verifiedAt = "";
        customers[customerAddr].documentProvided = "";
        customers[customerAddr].exists = false;
    }

    // @notice Implement circuit breaker design pattern to freeze adding customers.
    function stopContract()
    public onlyOwner() {
        emit LogContractStopped();
        stopped = true;
    }

    // @notice Implement mortal design pattern in case the contract should be self destructed.
    function kill()
    public onlyOwner()
    {
           selfdestruct(address(uint160(owner()))); // cast owner to address payable
    }
}