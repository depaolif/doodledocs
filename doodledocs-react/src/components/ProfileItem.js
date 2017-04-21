import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setCurrentImage, removeImage } from '../actions/image'
import axios from 'axios'

class ProfileItem extends Component {
	constructor(props) {
		super(props);

		this.handleClick = this.handleClick.bind(this)
		this.handleDelete = this.handleDelete.bind(this)
	}

	handleClick(evt) {
		evt.preventDefault()
		this.props.setCurrentImage({id: this.props.image.id, title: this.props.image.title})
		this.props.history.push('/')
	}

	handleDelete(event) {
		event.preventDefault()
		axios({
			method: "DELETE",
			url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${this.props.image.id}`
		})
		.then(resp => {
			this.props.removeImage(this.props.image.id)
		})
	}

	render() {
		return (
			<li>
				<img alt={this.props.image.title} src={this.props.image.data_url} width='50' height='50'></img>
				<a href='#' onClick={this.handleClick}>{this.props.image.title} -  id:{this.props.image.id}</a>
				<button onClick={this.handleDelete}>Delete</button>
			</li>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setCurrentImage: (imageId) => {
		dispatch(setCurrentImage(imageId))
	},
	removeImage: (image) => {
		dispatch(removeImage(image))
	}
})

const ConnectedProfileItem = connect(null, mapDispatchToProps)(ProfileItem)

export default ConnectedProfileItem
