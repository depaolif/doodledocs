import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { resetImage } from '../actions/image'

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(evt) {
		this.props.resetImage()
	}

	render() {
		return (
			<div className="navbar">
				<Link to="/" onClick={this.handleClick} >New Doodle</Link>
				{!this.props.token ? <Link to="/login">Login</Link> : <Link to="/profile">Profile</Link>}
				{!this.props.token ? <Link to="/register">Register</Link> : <Link to='/logout'>Logout</Link>}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	token: state.account.token
})

const mapDispatchToProps = (dispatch) => ({
	resetImage: () => {
		dispatch(resetImage())
	},
})

const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar)

export default ConnectedNavBar
