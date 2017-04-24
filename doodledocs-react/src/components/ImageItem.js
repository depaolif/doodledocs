import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import '../css/ImageItem.scss'

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
		const titleLink = title ? title : "Untitled"
		return (
			<div className='image-item'>
				<img className="image" alt={title} src={preview} width='300' height='300' />
				<Link className="image-item-link" to={url}>{titleLink}</Link>
				<br></br>
				{this.props.onDelete ? <button onClick={this.handleDelete} className="delete-btn">Delete</button> : false}
			</div>
		)
	}
}

export default ImageItem
