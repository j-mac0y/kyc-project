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
            isPep: false
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
                </Form>
            </div>
        )
    }

    handleChange = (event) => {
        this.setState({ [event.target.name]: event.target.type == "checkbox" ? event.target.checked: event.target.value });
      };

    handleSubmit = (event) => {
        // Prevent HTML form submit.
        event.preventDefault();
        console.log(this.state);
    }
}

export default NewCustomer;