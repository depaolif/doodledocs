import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setPublicImages, setCurrentPublicImage } from '../actions/publicimage'
import ImageItem from './ImageItem'
import axios from 'axios'

class ImageList extends Component {
	componentDidMount() {
		const headers = localStorage.getItem('token') ? {"bearer": localStorage.getItem('token')} : null
		axios({
			method: 'GET',
			url: 'http://localhost:3001/v1/images',
			headers: headers
		})
		.then(resp => {
			this.props.setPublicImages(resp.data)
		})
	}

	render() {
		const imageItems = this.props.publicImages.list.map(image =>
			<ImageItem
				key={image.id}
				id={image.id}
				title={image.title}
				preview={image.data_url} />
			)
		return (
			<div className="image-list">
				{imageItems}
			</div>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setPublicImages: (list) => {
		dispatch(setPublicImages(list))
	},
	setCurrentPublicImage: (image) => {
		dispatch(setCurrentPublicImage(image))
	}
})

const mapStateToProps = (state) => ({
	publicImages: state.publicImages
})

const ConnectedImageList = connect(mapStateToProps, mapDispatchToProps)(ImageList)

export default ConnectedImageList
