import React, { Component } from "react";
import './App.css';
import NewCustomer from './components/CustomerForm';
import AccountInfo from './components/AccountInfo';
import ProcessInfo from './components/ProcessInfo';
import getWeb3 from './utils/getWeb3';
import KYCContract from "./contracts/KYC";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      accounts: null,
      contract: null,
      customer: null,
      isVerified: null
    };

    this.clearCustomer = this.clearCustomer.bind(this);
    this.getCustomer = this.getCustomer.bind(this);
    this.verifyExistingCustomer = this.verifyExistingCustomer.bind(this);
  }

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = KYCContract.networks[networkId];
      const kyc = new web3.eth.Contract(
        KYCContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state
      this.setState({ web3, accounts, contract: kyc }, () => {
        this.getCustomer(accounts[0]);
      });

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }

  }

  render() {
    return (
      <div>
        <div>
          <header className="app-header">
            <h1>Know Your Customer Prototype</h1>
          </header>
        </div>

        {this.state.customer &&
          <div>
            <AccountInfo accounts={this.state.accounts} customer={this.state.customer} clearCustomer={this.clearCustomer}></AccountInfo>

            <NewCustomer web3={this.state.web3} accounts={this.state.accounts} customer={this.state.customer} contract={this.state.contract} getCustomer={this.getCustomer} verifyExistingCustomer={this.verifyExistingCustomer}></NewCustomer>
          
            <ProcessInfo customer={this.state.customer} isVerified={this.state.isVerified}></ProcessInfo>
          </div>
        }

      </div>
    )
  }

  async getCustomer(customerAcc) {
    const response = await this.state.contract.methods.getCustomer(customerAcc).call({ from: customerAcc });
    this.setState({ customer: response });
  }

  async clearCustomer() {
    const customerAcc = this.state.accounts[0];
    await this.state.contract.methods.clearCustomer(customerAcc).send({from: customerAcc});
    this.getCustomer(customerAcc);
    this.setState({isVerified: null})
  }

  async verifyExistingCustomer(dataHash) {
    const signer = await this.state.web3.eth.personal.ecRecover(dataHash, this.state.customer.signature);
    debugger;
    if (signer.toLowerCase() === this.state.accounts[0].toLowerCase()) {
        this.setState({isVerified: true}, console.log("yes"));
    } else {
        this.setState({isVerified: false}, console.log("no"));
    }
}
}

export default App;
