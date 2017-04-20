import React, {Component} from 'react'
import { connect } from 'react-redux'
import ConnectedImageItem from './ImageItem'

class Profile extends Component {
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
