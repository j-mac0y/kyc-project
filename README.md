# Know Your Customer Prototype
This prototype was created for the Consensys Blockchain Developer course final project.

Author: James MacNaughton

## Context - KYC
Know Your Customer (KYC) processes are important steps that financial institutions such as banks must perform in order to comply with regulations. These regulations ensure banks and other financial institutions perform customer due diligence, or in other words, ensure that customers are who they say they are. This is primarily to avoid the bank being used in money laundering or financing of terrorism. At a basic level, a KYC process between a bank and an individual would involve the individual providing some basic information including:
- Given names
- Family name
- Address and date of birth
- Whether they are a Politically Exposed Person (PEP)

This information would be provided along with an identifying document such as a drivers license or passport. The bank would then compare the information provided with the document to verify the identity of the customer. KYC verification would often involve more steps like checking the validity of the document, but this is outside the scope of this prototype.

## Context - How blockchain fits in
Traditional KYC systems involve lengthy verification procedures that must be repeated whenever a customer needs to prove their identity to a new organisation. This redundancy causes long wait times for customers and increases costs for financial institutions. A blockchain KYC system can provide an immutable and distributed record of KYC verification. Sharing an immutable record of verified customers between organisations removes the need to repeat the full verification process every time a customer's identity must be checked. Rather, the customer can prove that they are the same person who originally registered (in this case using the public key cryptography inherent in an Ethereum account) and was verified, without the need to re-upload their documents and wait for verification to be completed by the financial institution.

## Assumptions
Certain assumptions have been made to simplify the prototype from a KYC perspective so that the focus can be on the blockchain dapp, including:
1. No upload of documents or comparison of data to documents is included in the app, this is assumed to have been completed by the financial institution. 
2. Any account is able to add customers to the smart contract. In reality, only the contract owner, or a list of approved verifiers, would be allowed to add customers as verified to the list. However, this would have required a back-end app to submit transactions as a verifier account on behalf of customer accounts, and was determined to be too difficult to accomplish as part of the prototype.

## Directory structure
- api (Smart contract)
  - test (Javascript unit tests)
  - contracts (Solidity contracts)
  - .secret (File for your Metamask mnemonic if you plan to `truffle migrate` to Rinkeby)
- client (React)
  - components
    - AccountInfo
    - CustomerForm
    - ProcessInfo
  - contracts (Contract artifacts)
  - utils
    - getWeb3.js

## Stack
- Ethereum smart contracts
  - Truffle & Solidity (framework)
  - Ganache-cli (developer network)
- React client
  - web3js (API for interface with Ethereum networks)

## To run project locally (Rinkeby test network)
4. Connect to Rinkeby in Metamask
5. Run `npm install` in the **client** directory
6. Run `npm start` in the **client** directory
7. Browse to **localhost:3000**

## To run project locally (local network)
1. Run `ganache-cli`
2. Run `truffle migrate` in the **api** directory
3. Open browser and connect metamask to the ganache network (default localhost:8545)
4. Import the first account from the ganache-cli into metamask using the private key
5. Run `npm install` in the **client** directory
6. Run `npm start` in the **client** directory
7. Browse to **localhost:3000**

## To migrate to Testnet (to Rinkeby)
1. Make a file called **.secret** in the api directory and paste your Metamask mnemonic in there.
2. Run `truffle migrate --network rinkeby`

## To run tests
1. `ganache-cli` on port 8545
2. `truffle test`