import React, {Component} from 'react'
import { connect } from 'react-redux'
import axios from 'axios'
import ImageItem from './ImageItem'

class Profile extends Component {

	render() {
		const images = this.props.imageList.map((el, i) => {
			return <ImageItem key={i} imageId={el.id} imageTitle={el.title} />
		})
		return (
			<div className="profile">
					<h1>{this.props.username}</h1>
					<ul>
						{images}
					</ul>
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	username: state.account.username,
	imageList: state.imageList
})

export default const ConnectedProfile = connect(mapStateToProps)(Profile)
