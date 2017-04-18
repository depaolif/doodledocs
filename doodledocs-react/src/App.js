import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import Login from './components/Login'
import Doodle from './components/Doodle'

class App extends Component {
  render() {
    return (
        <div className="App">
          {this.props.account.token ? <Doodle /> : <Login />}
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const ConnectedApp = connect(mapStateToProps, null)(App)

export default ConnectedApp
