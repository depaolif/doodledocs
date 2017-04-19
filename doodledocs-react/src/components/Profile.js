import React, {Component} from 'react'
import { connect } from 'react-redux'
import ConnectedImageItem from './ImageItem'
import axios from 'axios'

class Profile extends Component {

	constructor() {
		super()
		this.state = {
			imagePreviewList: [],
			loadedImages: false
		}
		this.images = null
	}

	componentDidMount() {
		axios({
			method: 'GET',
			url: `http://localhost:3001/v1/accounts/${this.props.account.id}/images`
		})
		.then(resp => {
			this.setState({
				imagePreviewList: resp.data,
				loadedImages: true
			})
		})
	}

	render() {
		if (this.state.loadedImages) {
			this.images = this.props.imageList.map((el, i) => {
				return <ConnectedImageItem key={this.state.imagePreviewList[i].id} imageId={this.state.imagePreviewList[i].id} imageTitle={this.state.imagePreviewList[i].title} history={this.props.history} preview={this.state.imagePreviewList[i].data_url} />
			})
		}
		return (
			<div className="profile">
					<h1>{this.props.account.username}</h1>
					<ul>
						{this.state.loadedImages ? this.images : false}
					</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	account: state.account,
	imageList: state.images.list
})

const ConnectedProfile = connect(mapStateToProps)(Profile)
export default ConnectedProfile
