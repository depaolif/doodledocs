import React, { Component } from 'react';
import './App.css';

class App extends Component {

  constructor() {
      super()

      this.canvas = null
      this.getMousePos = this.getMousePos.bind(this)
      this.writeMessage = this.writeMessage.bind(this)
  }

  componentWillMount() {
  }

  componentDidMount() {
    this.canvas = document.getElementById('app-canvas');
    this.canvas.addEventListener('mousemove', (event) => {
      let mousePos = this.getMousePos(this.canvas, event);
      let message = 'Mouse position: ' + mousePos.x + ',' + mousePos.y;
      let context = this.canvas.getContext('2d')
      context.strokeText('YOOOO', mousePos.x, mousePos.y)
      this.writeMessage(this.canvas, message);
    }, false);
    let ctx = this.canvas.getContext('2d')
  }

  writeMessage(canvas, message) {
    let context = this.canvas.getContext('2d');
    context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    context.font = '18pt Calibri';
    context.fillStyle = 'black';
    context.fillText(message, 10, 25);
  }

  getMousePos(canvas, evt) {
    var rect = this.canvas.getBoundingClientRect()
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  render() {
    return (
      <div className="App">
      <canvas id="app-canvas" width={1000} height={1000} />
      </div>
      );
  }
}

export default App;
