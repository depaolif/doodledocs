import React, { Component } from 'react'
import { Link } from 'react-router-dom'

class ImageItem extends Component {
	constructor() {
		super()

		this.handleDelete = this.handleDelete.bind(this)
	}

	handleDelete(event) {
		event.preventDefault()
		this.props.onDelete(this.props.id)
	}

	render() {
		let {id, title, preview} = this.props
		let url = `/images/${id}`
		return (
			<div>
				<Link className="image-item-link" to={url}>{title}</Link>
				{this.props.onDelete ? <button onClick={this.handleDelete} id="delete-btn">Delete</button> : false}
				<img alt={title} src={preview} width='300' height='300' />
			</div>
		)
	}
}

export default ImageItem
