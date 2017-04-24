import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth, setImageSrc, setColor } from '../actions/doodle'
import ColorPicker from './ColorPicker'
import '../css/ToolBox.css'



class ToolBox extends Component {
	constructor() {
		super()

		this.state = {
			focusedItem: null,
			showColor: false,
			webCamStream: null,
			showWebcam: false
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleImageUpload = this.handleImageUpload.bind(this)
		this.handleChangeComplete = this.handleChangeComplete.bind(this)
		this.showOrHideColor = this.showOrHideColor.bind(this)
		this.handleWebCam = this.handleWebCam.bind(this)
		this.handleWebCamSave = this.handleWebCamSave.bind(this)
	}

	componentDidMount() {
		this.props.setColor('#000')
		this.props.setLineWidth(1)
		this.props.setTool('free')
	}

	handleChangeComplete(color) {
		this.props.setColor(color.hex)
	}

	handleChange(event) {
		this.props.setLineWidth(parseInt(event.target.value, 10))
	}

	handleClick(event) {
		this.setState({
			focusedItem: event.target.name
		})
		this.props.setTool(event.target.name)
	}

	handleImageUpload(event) {
		this.setState({
			focusedItem: event.target.name
		})
		this.props.setTool(event.target.name)
	    let reader = new FileReader();
	    reader.onload = (event) => {
	    	this.props.setImageSrc(event.target.result)
	    }
	    reader.readAsDataURL(event.target.files[0]);
	}

	showOrHideColor() {
		const show = this.state.showColor ? false : true
		this.setState({
			showColor: show
		});
	}

	handleWebCam(event) {
		this.setState({ showWebcam: true })
		navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
		.then((mediaStream) => {
			let video = document.getElementById('webcam-video')
			video.srcObject = mediaStream
			this.setState({ webCamStream: mediaStream })
			video.onloadedmetadata = (e) => {
				console.log(this.state.showWebcam, 'onload')
				if (!this.state.showWebcam) {
		    		video.play()
		    	}
			}
		})
		.catch((err) => { console.log(err.name + ": " + err.message) })
	}

	handleWebCamSave(event) {
		let video = document.getElementById('webcam-video')
		let screenShotCanvas = document.getElementById('webcam-canvas')
		screenShotCanvas.getContext('2d').drawImage(video, 0, 0, screenShotCanvas.width, screenShotCanvas.height);
		this.state.webCamStream.getVideoTracks()[0].stop()
		video.src = ""
		video.pause()
		video.onloadedmetadata = (e) => { }
		this.props.setImageSrc(screenShotCanvas.toDataURL('image/jpeg', 0.1))
		this.props.setTool('image')
		this.setState({ showWebcam: false })
		console.log(this.state.showWebcam, 'save')
	}

	render() {
		console.log(this.state.showWebcam, 'render')
		return (
			<div className="toolbox">
					<ColorPicker onChangeComplete={this.handleChangeComplete}/>
				<label> Line Width: </label>
				<select value={this.props.doodle.lineWidth} onChange={this.handleChange}>
					<option value='1'>1</option>
					<option value='5'>5</option>
					<option value='10'>10</option>
					<option value='20'>20</option>
					<option value='30'>30</option>
					<option value='50'>50</option>
					<option value='100'>100</option>
				</select>
				<button name="free" onClick={this.handleClick}>Free</button>
				<button name="line" onClick={this.handleClick}>Line</button>
				<button name="circle" onClick={this.handleClick}>Circle</button>
				<button name="rectangle" onClick={this.handleClick}>Rectangle</button>
				<button name="text" onClick={this.handleClick}>Text</button>
				<button name="webcam-show" onClick={this.handleWebCam}>Webcam</button>
				{this.state.showWebcam ? <video type='hidden' name="webcam-video" id="webcam-video" /> : false}
				{this.state.showWebcam ? <canvas type='hidden' id='webcam-canvas' /> : false}
				{this.state.showWebcam ? <button name="webcam" onClick={this.handleWebCamSave}>Take Picture</button> : false}
				<label> Upload Image:</label>
				<input onChange={this.handleImageUpload} type="file" name="image" />
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	doodle: state.doodle
})

const mapDispatchToProps = (dispatch) => ({
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setLineWidth: (width) => {
		dispatch(setLineWidth(width))
	},
	setImageSrc: (src) => {
		dispatch(setImageSrc(src))
	},
	setColor: (color) => {
		dispatch(setColor(color))
	},
})

const ConnectedToolBox = connect(mapStateToProps, mapDispatchToProps)(ToolBox)

export default ConnectedToolBox
