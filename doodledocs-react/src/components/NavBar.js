import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'
import { connect } from 'react-redux'

class NavBar extends Component {
	render() {
		return (
			<div className="navbar">
				<NavLink to="/">Doodle</NavLink>
				<NavLink to="/profile">Profile</NavLink>
				{!this.props.token ? <NavLink to="/login">Login</NavLink> : <NavLink to='/logout'>Logout</NavLink>}
				{!this.props.token ? <NavLink to="/register">Register</NavLink> : false}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	token: state.account.token
})

const ConnectedNavBar = connect(mapStateToProps, null)(NavBar)

export default ConnectedNavBar
