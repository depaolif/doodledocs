import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth, setImageSrc, setColor } from '../actions/doodle'
import { SketchPicker } from 'react-color'


class ToolBox extends Component {
	constructor() {
		super()

		this.state = {
			focusedItem: null,
			showColor: false
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleImageUpload = this.handleImageUpload.bind(this)
		this.handleChangeComplete = this.handleChangeComplete.bind(this)
		this.showOrHideColor = this.showOrHideColor.bind(this)
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
		// let reader = new FileReader();
  //       reader.onload = imageIsLoaded;
  //       reader.readAsDataURL(this.files[0]);
		// let src = window.prompt("Enter image source:", "http://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png");
		// let tempImage = new Image()
		// tempImage.src = src
		// if (tempImage.height > 500 || tempImage.width > 500 || tempImage.height == 0 || tempImage.width == 0) {
		// 	window.alert("No images bigger than 500x500")
		// 	src = "http://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png"
		// }
		// this.props.setImageSrc(src)
	}

	showOrHideColor() {
		const show = this.state.showColor ? false : true
		this.setState({
			showColor: show
		});
	}

	render() {
		return (
			<div className="toolbox">
				{this.state.showColor ? <SketchPicker
					color={this.props.doodle.color}
					onChangeComplete={this.handleChangeComplete} /> : false}
				<button name="color" onClick={this.showOrHideColor}>Color</button>
				<input type="text" name="width" placeholder="Line Width" onChange={this.handleChange} />
				<button name="free" onClick={this.handleClick}>Free</button>
				<button name="line" onClick={this.handleClick}>Line</button>
				<button name="circle" onClick={this.handleClick}>Circle</button>
				<button name="rectangle" onClick={this.handleClick}>Rectangle</button>
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
