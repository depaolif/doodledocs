import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setTool, setLineWidth } from '../actions/doodle'

class ToolBox extends Component {
	constructor() {
		super()

		this.state = {
			focusedItem: null
		}

		this.handleChange = this.handleChange.bind(this)
		this.handleClick = this.handleClick.bind(this)
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

	render() {
		return (
			<div className="toolbox">
				<input type="text" name="width" placeholder="Line Width" onChange={this.handleChange} />
				<button name="free" onClick={this.handleClick}>Free</button>
				<button name="line" onClick={this.handleClick}>Line</button>
				<button name="circle" onClick={this.handleClick}>Circle</button>
				<button name="rectangle" onClick={this.handleClick}>Rectangle</button>
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
	}
})

const ConnectedToolBox = connect(null, mapDispatchToProps)(ToolBox)

export default ConnectedToolBox