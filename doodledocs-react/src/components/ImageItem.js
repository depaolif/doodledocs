import React, {Component} from 'react'

class ImageItem extends Component {

	render() {
		return (
			<li>
				{this.props.imageTitle}
			</li>
		)
	}
}

export default ImageItem
