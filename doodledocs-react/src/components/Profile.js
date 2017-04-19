import React, {Component} from 'react'
import { connect } from 'react-redux'
import ConnectedImageItem from './ImageItem'

class Profile extends Component {

	render() {
		const images = this.props.imageList.map((el, i) => {
			return <ConnectedImageItem key={i} imageId={el.id} imageTitle={el.title} history={this.props.history} />
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
	imageList: state.images.list
})

const ConnectedProfile = connect(mapStateToProps)(Profile)
export default ConnectedProfile
