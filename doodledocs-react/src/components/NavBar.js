import '../css/NavBar.scss'
import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import { resetImage } from '../actions/image'
import { setTool } from '../actions/doodle'
import { setSliderValue } from '../actions/slider'

class NavBar extends Component {
	constructor(props) {
		super(props);
		this.handleClick = this.handleClick.bind(this)
	}

	handleClick(evt) {
		this.props.resetImage()
		this.props.setTool('free')
		this.props.setSliderValue(0)
	}

	render() {
		return (
			<div className="navbar">
				<Link id="new-doodle" className="nav-links" to="/" onClick={this.handleClick} >New Doodle</Link>
				<Link id="public-images" className="nav-links" to="/images">Latest Doodles</Link>
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
	setTool: (tool) => {
		dispatch(setTool(tool))
	},
	setSliderValue: (value) => {
		dispatch(setSliderValue(value))
	}
})

const ConnectedNavBar = connect(mapStateToProps, mapDispatchToProps)(NavBar)

export default ConnectedNavBar
