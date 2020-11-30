# Design Pattern Decisions

## Restricting Access
Extended the Ownable contract from Openzeppelin to restrict access to certain functions including `stopContract()` and `kill()` in **KYC.sol**. This ensures only the owner of the contract can execute these admin features.

## Mortal
The mortal design pattern could be useful if the owner ever wanted to remove the list of customers from the blockchain completely. This was implemented in the `kill()` function which calls `selfdestruct()` and returns any Ether in the contract to the owner.

## Circuit breaker
The circuit breaker pattern has been implemented through a modifier which stops access to functions that change the state of the contract. You could use this if you wanted to stop new customers being added but still be able to see the customers that have already been verified.