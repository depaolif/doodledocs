import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <canvas id="app-canvas" width={1000} height={1000} />
      </div>
    );
  }
}

export default App;
