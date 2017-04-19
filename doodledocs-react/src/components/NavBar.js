import React, {Component} from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

class NavBar extends Component {
	render() {
		return (
			<div className="navbar">
				<Link to="/">Doodle</Link>
				{!this.props.token ? <Link to="/login">Login</Link> : <Link to="/profile">Profile</Link>}
				{!this.props.token ? <Link to="/register">Register</Link> : <Link to='/logout'>Logout</Link>}
			</div>
		)
	}
}

const mapStateToProps = (state) => ({
	token: state.account.token
})

const ConnectedNavBar = connect(mapStateToProps, null)(NavBar)

export default ConnectedNavBar
