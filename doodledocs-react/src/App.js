import React, { Component } from 'react';
import { connect } from 'react-redux'
import './App.css';
import { SketchPicker } from 'react-color'
import { bindActionCreators } from 'redux';
import { color_change } from './actions/color_change'

class App extends Component {

  constructor() {
    super()

    this.canvas = null
    this.context = null
    this.isPainting = false
    this.history = []
    this.count = 0

    this.handleChangeComplete = this.handleChangeComplete.bind(this)
  }

  componentDidMount() {
    this.canvas = document.getElementById('app-canvas');
    this.context = this.canvas.getContext('2d')
    this.canvas.addEventListener('mousedown', (event) => {
      let mousePos = this.getMousePos(this.canvas, event)
      this.context.beginPath() //begins path
      this.context.moveTo(mousePos.x, mousePos.y)
      this.history.push({start: {x: mousePos.x, y: mousePos.y}, line: new Array()})
      this.isPainting = true
    }, false)
    this.canvas.addEventListener('mousemove', (event) => {
      if (this.isPainting) {
        let mousePos = this.getMousePos(this.canvas, event)
        this.context.lineTo(mousePos.x, mousePos.y)
        this.context.stroke() //path gets a stroke
        this.history[this.history.length-1].line.push({x: mousePos.x, y: mousePos.y})
      }
    })
    this.canvas.addEventListener('mouseup', (event) => {
      this.isPainting = false
      console.log(this.history)
      this.count = this.count + 1
    }, false)

    // undo feature
    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 90 && event.ctrlKey) { // ctrl + z
        if (!this.isPainting && this.history.length > 0) {
          this.context.clearRect(0,0,1500,1500)
          this.history = this.history.slice(0, -1)
          for (let i = 0; i < this.history.length; i++) {
            this.context.beginPath()
            this.context.moveTo(this.history[i].start.x, this.history[i].start.y)
            for (let j = 0; j < this.history[i].line.length; j++) {
              this.context.lineTo(this.history[i].line[j].x, this.history[i].line[j].y)
              this.context.stroke()
            }
          }
        }
      }
    })
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

  handleChangeComplete(color) {
    this.props.color_change(color.hex)
  }

  render() {
    return (
      <div className="App">
        <SketchPicker
          color={this.props.color}
          onChangeComplete={this.handleChangeComplete} />
        <canvas tabIndex='1' id="app-canvas" width={1000} height={1000} />
      </div>
      );
  }
}

const mapStateToProps = (state) => {
  return { color: state.color }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    color_change: color_change
  }, dispatch);
}

export const ConnectedApp = connect(mapStateToProps,mapDispatchToProps)(App);
