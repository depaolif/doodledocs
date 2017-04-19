import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setCurrentImage } from '../actions/image'

class ImageItem extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(evt) {
		evt.preventDefault()
		this.props.setCurrentImage(this.props.imageId)
		this.props.history.push('/')
	}

	render() {
		return (
			<li>
				<a href='#' onClick={this.handleClick}>Image {this.props.imageId}</a>
			</li>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setCurrentImage: (imageId) => {
		dispatch(setCurrentImage(imageId))
	}
})

const ConnectedImageItem = connect(null, mapDispatchToProps)(ImageItem)

export default ConnectedImageItem
