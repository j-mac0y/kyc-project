import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import getWeb3 from '../utils/getWeb3';

class NewCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            givenNames: '',
            familyName: '',
            city: '',
            isPep: false,
            showKey: false,
            web3: null,
            accounts: null
        }
    }

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();
      
            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();
      
            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            // const deployedNetwork = SimpleStorageContract.networks[networkId];
            // const instance = new web3.eth.Contract(
            //   SimpleStorageContract.abi,
            //   deployedNetwork && deployedNetwork.address,
            // );
      
            // // Set web3, accounts, and contract to the state, and then proceed with an
            // // example of interacting with the contract's methods.
            // this.setState({ web3, accounts, contract: instance }, this.runExample);
            this.setState({ web3, accounts});
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
            <div className="container">
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGivenNames">
                        <Form.Label>Given Name(s)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter given name(s)"
                            name="givenNames"
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formFamilyName">
                        <Form.Label>Family Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter family name"
                            name="familyName"
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter city"
                            name="city"
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formIsPep">
                        <Form.Check
                            type="checkbox"
                            label="Are you a PEP?"
                            name="isPep"
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

                    {this.state.showKey &&
                        <div>
                            <p className="pt-3">
                                Your data has been verified! Record your private key so you can skip verification in future.
                            </p>
                            <p className="pt-3">
                                Your private key is: {this.privateKey}
                            </p>
                        </div>
                    }

                </Form>
            </div>
        )
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.type === "checkbox" ? event.target.checked : event.target.value });
    };

    handleSubmit = async (event) => {
        // Prevent HTML form submit.
        event.preventDefault();

        this.setState({ showKey: true });

        // Generated signature from customer data and encrypted customer data
        let customerData = {
            givenNames: this.state.givenNames,
            familyName: this.state.familyName,
            city: this.state.city,
            isPep: this.state.isPep
        }
        customerData = JSON.stringify(customerData);
        
        // Generate timestamp and userID to store alongside signature in blockchain
        const timestamp = Date.now();

        console.log(this.state.accounts);
        console.log(this.state.web3.eth.defaultAccount);
        const dataHash = this.state.web3.utils.sha3('Apples');
        const signature = await this.state.web3.eth.personal.sign(dataHash, this.state.web3.eth.defaultAccount());

        console.log(dataHash);

    }
}

export default NewCustomer;