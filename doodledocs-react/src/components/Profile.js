import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setCurrentImage, removeImage } from '../actions/image'
import ImageItem from './ImageItem'
import axios from 'axios'

class Profile extends Component {
	constructor() {
		super()

		this.handleDelete = this.handleDelete.bind(this)
	}

	handleDelete(id) {
		event.preventDefault()
		axios({
			method: "DELETE",
			url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images/${id}`
		})
		.then(resp => {
			this.props.removeImage(id)
		})
	}

	render() {
		const imageList = this.props.images.list.map((image, i) => 
			<ImageItem 
				key={image.id}
				id={image.id}
				title={image.title}
				preview={image.data_url}
				onDelete={this.handleDelete} />
		)
		return (
			<div className="profile">
				<h1>{this.props.account.username}</h1>
				<ul>
					{imageList}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	account: state.account,
	images: state.images
})

const mapDispatchToProps = (dispatch) => ({
	removeImage: (image) => {
		dispatch(removeImage(image))
	}
})

const ConnectedProfile = connect(mapStateToProps, mapDispatchToProps)(Profile)

export default ConnectedProfile
