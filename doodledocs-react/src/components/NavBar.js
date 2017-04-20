import '../css/NavBar.css'
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
				<Link id="new-doodle" className="nav-links" to="/" onClick={this.handleClick} >New Doodle</Link>
				{!this.props.token ? <Link id="login" className="nav-links" to="/login">Login</Link> : <Link id="profile" className="nav-links" to="/profile">Profile</Link>}
				{!this.props.token ? <Link id="register" className="nav-links" to="/register">Register</Link> : <Link id="logout" className="nav-links" to='/logout'>Logout</Link>}
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
