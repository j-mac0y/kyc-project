import React, { Component } from "react";
import './App.css';
import Button from 'react-bootstrap/Button';
import NewCustomer from './components/NewCustomer';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    return (
      <div>
        <div>
          <header className="app-header">
            <h1>KYC</h1>
          </header>
        </div>
        <div className="container-fluid text-center pt-3">
          <div className="d-inline-flex">
            <Button variant="primary">New customer</Button>
          </div>
          <div className="d-inline-flex pl-2">
            <Button variant="primary">Existing customer</Button>
          </div>
        </div>
        <NewCustomer></NewCustomer>
      </div>
    )
  }
}

export default App;
