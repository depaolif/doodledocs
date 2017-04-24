import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth, setImageSrc, setColor, setFontSize } from '../actions/doodle'
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
		if (this.props.doodle.tool === 'text')
			this.props.setFontSize(parseInt(event.target.value, 10))
		else
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
	    let reader = new FileReader()
	    reader.onload = (event) => {
	    	this.props.setImageSrc(event.target.result)
	    }
	    reader.readAsDataURL(event.target.files[0]);
	}

	showOrHideColor() {
		const show = this.state.showColor ? false : true
		this.setState({
			showColor: show
		})
	}

	handleWebCam(event) {
		this.setState({ showWebcam: true })
		navigator.mediaDevices.getUserMedia({ audio: false, video: { width: 1280, height: 720 } })
		.then((mediaStream) => {
			let video = document.getElementById('webcam-video')
			video.srcObject = mediaStream
			this.setState({ webCamStream: mediaStream })
			video.onloadedmetadata = (e) => {
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
	}

	render() {
		let selector = (
				this.props.doodle.tool !== 'text' ? <select value={this.props.doodle.lineWidth} onChange={this.handleChange}>
					<option value='1'>1</option>
					<option value='5'>5</option>
					<option value='10'>10</option>
					<option value='20'>20</option>
					<option value='30'>30</option>
					<option value='50'>50</option>
					<option value='100'>100</option>
				</select>
				:
					<input type="number" value={this.props.doodle.fontSize} onChange={this.handleChange} />
				)
		return (
			<div className="toolbox">
					<ColorPicker onChangeComplete={this.handleChangeComplete}/>
				{this.props.doodle.tool !== 'text' ? <img src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493061658/ic_line_weight_black_24dp_1x_a1dquz.png" alt="line width" className="icon" /> : <label>Font Size</label>}
				{selector}
				<img name="free" src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493061803/ic_gesture_black_24dp_1x_ui9sy3.png" alt="free" className="icon" onClick={this.handleClick} />
				<img name="line"
				src="http://res.cloudinary.com/dletp3dah/image/upload/a_90/v1493062257/ic_remove_black_24dp_1x_m1b9yy.png" alt="line" className="icon" onClick={this.handleClick}
				/>
				<img name="circle"
				src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493060454/ic_radio_button_unchecked_black_24dp_1x_hekiro.png" alt="circle" className="icon" onClick={this.handleClick}
				/>
				<img name="rectangle" src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493058803/ic_crop_din_black_24dp_1x_tmmokd.png" alt="square" className="icon" onClick={this.handleClick} />
				<img name="text"
				src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493061813/ic_text_format_black_24dp_1x_jdkbyd.png" alt="text" className="icon" onClick={this.handleClick}/>
				<img name="webcam-show"
				 src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493063205/ic_photo_camera_black_24dp_1x_yy0ca0.png" alt="webcam" className="icon" onClick={this.handleWebCam} />
				{this.state.showWebcam ? <video type='hidden' name="webcam-video" id="webcam-video" /> : false}
				{this.state.showWebcam ? <canvas type='hidden' id='webcam-canvas' /> : false}
				{this.state.showWebcam ? <button name="webcam" onClick={this.handleWebCamSave}>Take Picture</button> : false}
				<img src="http://res.cloudinary.com/dletp3dah/image/upload/c_scale,w_25/v1493063788/ic_attach_file_black_24dp_1x_fsd4du.png" alt="upload_image" className="icon"/>
				<input onChange={this.handleImageUpload} type="file" name="image"  />
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
	setFontSize: (num) => {
		dispatch(setFontSize(num))
	},
})

const ConnectedToolBox = connect(mapStateToProps, mapDispatchToProps)(ToolBox)

export default ConnectedToolBox
