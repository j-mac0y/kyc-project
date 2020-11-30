import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

class NewCustomer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            givenNames: '',
            familyName: '',
            city: '',
            isPep: false,
        }

        this.clearForm = this.clearForm.bind(this);
    }

    render() {
        return (
            <div className="container">
                <h1>{this.props.customer.exists ? "Verify existing customer" : "Add customer"}</h1>
                <Form onSubmit={this.handleSubmit}>
                    <Form.Group controlId="formGivenNames">
                        <Form.Label>Given Name(s)</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter given name(s)"
                            name="givenNames"
                            value={this.state.givenNames}
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formFamilyName">
                        <Form.Label>Family Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter family name"
                            name="familyName"
                            value={this.state.familyName}
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formCity">
                        <Form.Label>City</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter city"
                            name="city"
                            value={this.state.city}
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Form.Group controlId="formIsPep">
                        <Form.Check
                            type="checkbox"
                            label="Are you a Politically Exposed Person (PEP)?"
                            name="isPep"
                            checked={this.state.isPep}
                            onChange={this.handleChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

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

        // Clear the form of inputs
        this.clearForm();

        // Generated signature from customer data and encrypted customer data
        let customerData = {
            givenNames: this.state.givenNames,
            familyName: this.state.familyName,
            city: this.state.city,
            isPep: this.state.isPep,
        }
        customerData = JSON.stringify(customerData);

        const dataHash = this.props.web3.utils.sha3(customerData);
        if (this.props.customer.exists) {
            this.props.verifyExistingCustomer(dataHash);
        } else {
            this.newCustomer(dataHash);
        }
    }

    async newCustomer(dataHash) {
        const signature = await this.props.web3.eth.personal.sign(dataHash, this.props.accounts[0]);

        // Generate timestamp to be used as a nonce
        const timestamp = Date.now();

        // Add customer
        const customerAcc = this.props.accounts[0];
        // In reality, this request would need to come from a back end with access to a Ethereum account that is a "verifier". To avoid needing a backend for this prototype, the customer is able to add themselves to the list.
        await this.props.contract.methods.addCustomer(customerAcc, signature, customerAcc, timestamp.toString(), "Australian Drivers License").send({ from: customerAcc });

        await this.props.getCustomer(customerAcc);
    }

    clearForm() {
        this.setState({
            givenNames: '',
            familyName: '',
            city: '',
            isPep: false
        });
    }
}

export default NewCustomer;