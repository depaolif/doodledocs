import React, {Component} from 'react'
import { connect } from 'react-redux'
import ConnectedImageItem from './ImageItem'
import axios from 'axios'

class Profile extends Component {

	constructor() {
		super()
	}

	componentDidMount() {
		// axios({
		// 	method: 'GET',
		// 	url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images`
		// })
		// .then(resp => {
		// 	this.setState({
		// 		imagePreviewList: resp.data,
		// 		loadedImages: true
		// 	})
		// })
	}

	render() {
		const images = this.props.images.list.map((image, i) => {
			return <ConnectedImageItem key={image.id} image={image} account={this.props.account} history={this.props.history}/>
		})
		return (
			<div className="profile">
				<h1>{this.props.account.username}</h1>
				<ul>
					{images}
				</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	account: state.account,
	images: state.images
})

const ConnectedProfile = connect(mapStateToProps)(Profile)
export default ConnectedProfile
