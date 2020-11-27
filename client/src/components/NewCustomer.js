import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import getWeb3 from '../utils/getWeb3';
import KYCContract from "../contracts/KYC";

class NewCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            givenNames: '',
            familyName: '',
            city: '',
            isPep: false,
            web3: null,
            accounts: null,
            contract: null,
            blockchainValue: null
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
            const deployedNetwork = KYCContract.networks[networkId];
            const kyc = new web3.eth.Contract(
                KYCContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            // Set web3, accounts, and contract to the state
            this.setState({ web3, accounts, contract: kyc });
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    }

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
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
                    <Form.Text className="text-muted">
                        Note: this prototype assumes that user also uploads an identification document (e.g. drivers license) for verification
                    </Form.Text>

                    {this.state.blockchainValue &&
                        <div>
                            <p className="pt-3">
                                The data you provided has been verified alongside your documentation!
                            </p>
                            <p className="pt-3">
                                The following data has been stored in the blockchain:
                                {this.state.blockchainValue}
                            </p>
                            <p className="pt-3">
                                The Ethereum account you used to sign your data can now be used to prove your identity to other organisations.
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

        // Generated signature from customer data and encrypted customer data
        let customerData = {
            givenNames: this.state.givenNames,
            familyName: this.state.familyName,
            city: this.state.city,
            isPep: this.state.isPep,
        }
        customerData = JSON.stringify(customerData);

        const dataHash = this.state.web3.utils.sha3(customerData);
        const signature = await this.state.web3.eth.personal.sign(dataHash, this.state.accounts[0]);

        // Generate timestamp to be used as a nonce
        const timestamp = Date.now();

        // Add customer
        const customerAcc = this.state.accounts[0];
        // In reality, this request would need to come from a back end with access to a Ethereum account that is a "verifier". To avoid needing a backend for this prototype, the customer is able to add themselves to the list.
        await this.state.contract.methods.addCustomer(customerAcc, signature, customerAcc, timestamp, "Australian Drivers License").send({ from: customerAcc });

        const response = await this.state.contract.methods.getCustomer(customerAcc).call({from: customerAcc});
        this.setState({ blockchainValue: response });
    }
}

export default NewCustomer;