import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class ImageItem extends Component {
	constructor() {
		super()
	}

	render() {
		let {id, title, preview} = this.props
		let url = `/images/${id}`
		return (
			<div>
				<Link className="image-item-link" to={url}>{title}</Link>
				<img alt={title} src={preview} width='300' height='300'></img>
			</div>
		)
	}
}

export default ImageItem