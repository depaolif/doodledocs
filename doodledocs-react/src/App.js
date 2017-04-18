import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import Login from './components/Login'
import Doodle from './components/Doodle'

class App extends Component {

  constructor() {
    super()
  }

  render() {
    return (
        <div className="App">
          <Login />
          <Doodle />
        </div>
      );
  }
}

export default App
