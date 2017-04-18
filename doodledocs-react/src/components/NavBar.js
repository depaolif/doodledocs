import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class NavBar extends Component {
	render() {
		let loggedIn
		if (this.props.isLoggedIn.length) {
			loggedIn = <NavLink to="/profile">Profile</NavLink>
		} else {
			loggedIn = <NavLink to="/login">Log In</NavLink>
		}
		return (
			<div className="navbar">
        		<NavLink to="/">Doodle</NavLink>
						{loggedIn}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	isLoggedIn: state.account
})

const ConnectedNavBar = connect(mapStateToProps)(NavBar)

export default ConnectedNavBar
