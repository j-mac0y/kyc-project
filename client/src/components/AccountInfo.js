import React, { Component } from "react";
import Button from 'react-bootstrap/Button';
import moment from 'moment';

class AccountInfo extends Component {   
    render() {
        return (
            <div className="container pt-3">
                {this.props.customer &&
                    <div>
                        <div className="container-fluid text-center pt-2">
                            <div className="d-inline-flex pl-2">
                                <p className="pr-3">Connected account: {this.props.accounts[0]}</p>
                                <Button variant="primary" disabled={!this.props.customer.signature} onClick={this.props.clearCustomer}>Clear customer</Button>
                            </div>
                        </div>
                        <h1>Blockchain state</h1>
                        <p>Signature: {this.props.customer.signature || "empty"}</p>
                        <p>Verified by: {this.props.customer.verifiedBy}</p>
                        <p>Verified at: {this.props.customer.verifiedAt ? moment(this.props.customer.verifiedAt, "x").format("MMMM Do YYYY, h:mm:ss a") : "empty"}</p>
                        <p>Document provided: {this.props.customer.documentProvided || "empty"}</p>
                    </div>
                }
            </div>
        )
    }
}

export default AccountInfo;