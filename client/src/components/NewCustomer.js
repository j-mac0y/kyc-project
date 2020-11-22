import React, { Component } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import CryptoJS from 'crypto-js';
import JSEncrypt from 'jsencrypt';

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

    // Mock the keys (would have to retrieve from backend in real life)
    privateKey = `-----BEGIN RSA PRIVATE KEY-----
    MIICXgIBAAKBgQDBPpTDpu+MRRfnjf7XbbQoqNzeYFnmftecJnDuhhg76RsBG8R+
    ztZYU25ot5qyf5mSCbWgFdEq/GM36qX//Sbz+SaLTBhhUpfY5iMx94s4qfI8oy/8
    oN51wB8xCFw7U5RHeEY+8u62bDIyzlf3DBOlabRtRJzaBCbVU2JjHait/wIDAQAB
    AoGBALeVsZTSYh9bgKM+Fg4prY83JWWqGZ5NgJ5bMsyX3iwEf+Akth9WdvHAiVK4
    oyHS8V15FfB46Zcx4Ty9EmlI4hgZ1jn29cwPvshY93vocSa/7agLG3vTtEKPb++1
    eGkyWtLuJ+w017NZjptyYzNrNvGoDNDgnuTBGLmIxohwOSq5AkEA/MvCNdr8atgw
    1vFMsWiUqdxZ5EeQvh0Lma95WNmIf1f+zLG08+lJI8kGR+n513yIxoQI5h8hjamr
    6IOM8S7QPQJBAMOxmN0jHsLa1JpJdupl/nU6EJzsHj5KVG/36eRlIN8/IMUo7PAC
    el2EOIgH0mBCaCMOvOexKBvHOUIEHu+P/usCQQChU+e9NuOfzBhfE9892OAHBvjX
    FlTo/uBIVBO9ABZ8LkwNldtFTbu/eqrnegpX2sHu7pQ/R97B6WYsHMf1o0qBAkBp
    WikjlA6xdEHUtgww8KvmzFW5RVyayEVg6iSe8tqZlVC9E+VK6Oqbgd01TpCxhc6u
    YPbN/Q/MtJpcsf89lVX1AkEAi1R3WEjYho5rPs8MAYztqkgSQecgLfowqdS/cjwQ
    Rmt6sIIil5WEBBmQpKPYqsbaTr8wS15Vg8qqiQhJXUo+Uw==
    -----END RSA PRIVATE KEY-----`;

    publicKey = `-----BEGIN PUBLIC KEY-----
    MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDBPpTDpu+MRRfnjf7XbbQoqNze
    YFnmftecJnDuhhg76RsBG8R+ztZYU25ot5qyf5mSCbWgFdEq/GM36qX//Sbz+SaL
    TBhhUpfY5iMx94s4qfI8oy/8oN51wB8xCFw7U5RHeEY+8u62bDIyzlf3DBOlabRt
    RJzaBCbVU2JjHait/wIDAQAB
    -----END PUBLIC KEY-----`;

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
        this.setState({ [event.target.name]: event.target.type === "checkbox" ? event.target.checked: event.target.value });
    };

    handleSubmit = (event) => {
        // Prevent HTML form submit.
        event.preventDefault();
        
        const customerData = {
            givenNames: this.state.givenNames,
            familyName: this.state.familyName,
            city: this.state.city,
            isPep: this.state.isPep
        }
        const timestamp = Date.now();

        const jsEncrypt = new JSEncrypt();

        jsEncrypt.setPrivateKey(this.privateKey);
        // Hash the data with SHA256 then encrypt it using RSA to create signature.
        const signature = jsEncrypt.sign(customerData, CryptoJS.SHA256, "sha256");
        console.log(signature);

        jsEncrypt.setPublicKey(this.publicKey);        
        const encrypted = jsEncrypt.encrypt(customerData);
        console.log(encrypted);

        jsEncrypt.setPublicKey(this.publicKey);
        const verified = jsEncrypt.verify(customerData, signature, CryptoJS.SHA256);
        console.log(verified);

        jsEncrypt.setPrivateKey(this.privateKey);
        const decrypted = jsEncrypt.decrypt(encrypted);
        console.log(decrypted);
    }
}

export default NewCustomer;