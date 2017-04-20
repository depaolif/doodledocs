import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth, setImageSrc } from '../actions/doodle'

class ToolBox extends Component {
	constructor() {
		super()

		this.state = {
			focusedItem: null
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.handleImageClick = this.handleImageClick.bind(this)
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

	handleImageClick(event) {
		this.setState({
			focusedItem: event.target.name
		})
		this.props.setTool(event.target.name)
		let src = window.prompt("Enter image source:", "http://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png");
		let tempImage = new Image()
		tempImage.src = src
		if (tempImage.height > 500 || tempImage.width > 500 || tempImage.height == 0 || tempImage.width == 0) {
			window.alert("No images bigger than 500x500")
			src = "http://cdn.bulbagarden.net/upload/thumb/0/0d/025Pikachu.png/250px-025Pikachu.png"
		}
		this.props.setImageSrc(src)
	}

	render() {
		return (
			<div className="toolbox">
				<input type="text" name="width" placeholder="Line Width" onChange={this.handleChange} />
				<button name="free" onClick={this.handleClick}>Free</button>
				<button name="line" onClick={this.handleClick}>Line</button>
				<button name="circle" onClick={this.handleClick}>Circle</button>
				<button name="rectangle" onClick={this.handleClick}>Rectangle</button>
				<button name="image" onClick={this.handleImageClick}>Image</button>
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setLineWidth: (width) => {
		dispatch(setLineWidth(width))
	},
	setImageSrc: (src) => {
		dispatch(setImageSrc(src))
	}
})

const ConnectedToolBox = connect(null, mapDispatchToProps)(ToolBox)

export default ConnectedToolBox