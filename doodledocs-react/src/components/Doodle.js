import React, {Component} from 'react'
import { SketchPicker } from 'react-color'
import { setColor } from '../actions/color_change'
import { connect } from 'react-redux'
import axios from 'axios'

class Doodle extends Component {
	constructor() {
		super()
		this.canvas = null
		this.context = null
		this.isPainting = false
		this.history = []
    this.redoHistory = []

		this.handleChangeComplete = this.handleChangeComplete.bind(this)
		this.handleSave = this.handleSave.bind(this)
		this.handleRestore = this.handleRestore.bind(this)
	}

	handleRestore(event) {
		event.preventDefault()
		axios({
			method: 'GET',
			url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images/1`,
		})
		.then(resp => {
			let imageData = JSON.parse(resp.data.image_data)
			this.history = imageData
			this.drawImage(this.context, this.history)
		})
	}

	drawImage(context, history) {
		context.clearRect(0, 0, 1500, 1500)
		for (let i = 0; i < history.length; i++) {
			this.context.beginPath()
			this.context.moveTo(history[i].start.x, history[i].start.y)
			this.context.strokeStyle = history[i].start.color
			for (let j = 0; j < history[i].line.length; j++) {
				this.context.lineTo(history[i].line[j].x, history[i].line[j].y)
				this.context.stroke()
			}
		}
	}

	handleSave(event) {
		event.preventDefault()
		axios({
			method: 'POST',
			url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.images.current.image.id}`,
			headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
			data: JSON.stringify(this.history)
		})
		.then(resp => {
			console.log("Saved...")
	      	//response is 'Nice'
  		})
	}

  	componentDidMount() {
  		this.canvas = document.getElementById('app-canvas');
    	this.context = this.canvas.getContext('2d')

    	this.canvas.addEventListener('mousedown', (event) => {
      		this.context.strokeStyle=this.props.color
      		let mousePos = this.getMousePos(this.canvas, event)
      		this.context.beginPath() //begins path
      		this.context.moveTo(mousePos.x, mousePos.y)
          this.redoHistory = []
      		this.history.push({start: {x: mousePos.x, y: mousePos.y, color: this.props.color}, line: new Array()})
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
      		console.log(this.history.reduce((sum, val) => { return val.line.length + sum},0))
    	}, false)

    	// undo feature
    	document.addEventListener('keydown', (event) => {
      		if (event.keyCode == 90 && event.ctrlKey &&
      		    !this.isPainting && this.history.length > 0) {
            this.redoHistory.push(this.history[this.history.length-1])
            console.log(this.redoHistory.length)
      			this.history = this.history.slice(0, -1)
				    this.drawImage(this.context, this.history)
      		} else if (event.keyCode == 82 && event.ctrlKey &&
            !this.isPainting && this.redoHistory.length > 0) {
            console.log('redoing')
            this.history.push(this.redoHistory[this.redoHistory.length-1])
            this.redoHistory = this.redoHistory.slice(0, -1)
            this.drawImage(this.context, this.history)
          }
    	})
  	}

  	componentDidUpdate(prevProps, prevState) {
    	this.canvas = document.getElementById('app-canvas');
    	this.context = this.canvas.getContext('2d')
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
    	this.props.setColor(color.hex)
  	}

	render() {
		return (
			<div className="doodle">
				<SketchPicker
      			  color={this.props.color}
      			  onChangeComplete={this.handleChangeComplete} />
      			<input onClick={this.handleSave} type="submit" value="Save" />
      			<input onClick={this.handleRestore} type="submit" value="Restore" />
      			<canvas tabIndex='1' id="app-canvas" width={1000} height={1000} />
      		</div>
		)
	}
}

const mapStateToProps = (state) => ({
	color: state.color,
	account: state.account,
  images: state.images
})

const mapDispatchToProps = (dispatch) => ({
	setColor: (color) => {
		dispatch(setColor(color))
	}
})

const ConnectedDoodle = connect(mapStateToProps, mapDispatchToProps)(Doodle);

export default ConnectedDoodle
