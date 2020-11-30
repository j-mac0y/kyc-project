import React, { Component } from "react";


class ProcessInfo extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        return (
            <div className="container">
                <h1 className="pt-2">Info</h1>
                    {!this.props.customer.exists &&
                        <p>
                            This account has not been added as a customer yet. Provide details and upload a document (out of scope for prototype) so that your identity can be verified.
                        </p>
                    }

                    {this.props.customer.exists && this.props.isVerified === null &&
                        <div>
                            <p>
                                The data you provided has been verified alongside your documentation and stored securely in the blockchain.
                            </p>
                            <p>
                                The Ethereum account you used to sign your data can now be used to prove your identity to other organisations. Just re-enter your info, except this time you won't have to upload any documents or wait for verification.
                            </p>
                        </div>
                    }

                    {this.props.customer.exists &&
                        <div>
                            {this.props.isVerified === true &&
                                <div>
                                    <p>
                                        Your signature matches the value stored in the blockchain. Your identity is confirmed!
                                    </p>
                                    <p>
                                        Use the "Clear customer" button if you wish to demo the process again.
                                    </p>
                                </div>
                            }
                            {this.props.isVerified === false &&
                                <p>
                                    Your signature does not match the value stored in the blockchain, your identity cannot be confirmed. Please ensure your details and the Ethereum account you are using are the same as when you registered.
                                </p>
                            }
                        </div>
                    }
            </div>
        )
    }
} 

export default ProcessInfo;