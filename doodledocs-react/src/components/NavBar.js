import React, {Component} from 'react'
import { NavLink } from 'react-router-dom'

class NavBar extends Component {
	render() {
		return (
			<div className="navbar">
        		<NavLink to="/">Doodle</NavLink>
        		<NavLink to="/profile">Profile</NavLink>
			</div>
		)
	}
}

export default NavBar