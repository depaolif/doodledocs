import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setToken, setUsername } from '../actions/account'
import axios from 'axios'

class Login extends Component {
	constructor() {
		super()

		this.state = {
			username: '',
			password: ''
		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInput(event) {
		this.setState({
			[event.target.name]: event.target.value
		})
	}

	handleSubmit(event) {
		event.preventDefault()
		axios({
			method: 'POST',
			url: 'http://localhost:3001/v1/sessions',
			data: {username: this.state.username, password: this.state.password}
		})
		.then(resp => {
			this.props.setToken(resp.data.token)
			this.props.setUsername(resp.data.username)
		})
	}

	render() {
		return (
			<form onSubmit={this.handleSubmit}>
				<input type="text" name="username" value={this.state.username} onChange={this.handleInput} />
				<input type="password" name="password" value={this.state.password} onChange={this.handleInput} />
				<input type="submit" value="Login" />
			</form>
		)
	}
}

const mapDispatchToProps = (dispatch) => ({
	setToken: (token) => {
		dispatch(setToken(token))
	},
	setUsername: (username) => {
		dispatch(setUsername(username))
	}
})

const ConnectedLogin = connect(null, mapDispatchToProps)(Login)

export default ConnectedLogin