# Avoiding common attacks

Note: being quite a simple smart contract, in some cases the security vulnerabilities in 9.3 are not applicable. However, I will describe how I have considered them below.

## External Calls
No external calls are made in the smart contract, meaning it is not vulernable to re-entrancy attacks or other attacks that involve external calls like:
- Re-entracy Attacks (SWC-107)
- Denial of Service with Failed Call (SWC-113)

## Transaction Ordering and Timestamp Dependence (SWC-114)
The order of transactions is not important in my smart contract. So assuming that the customer has protected their private key meaning they are the only person with access to their Ethereum account, this vulnerability should not be a problem.

## Looping over dynamic arrays
My contract does not use any loops. I did consider creating a dynamic array that would store customer addresses so they could be looped over in a "clear all" function. However, I avoided extending the code this way as I knew it would be a vulnerability. Instead I implemented the `clearCustomer()` function that just clears one address, for demonstration purposes. In a real KYC use case I don't think you would want to be able to clear indiviudal customers from the list.