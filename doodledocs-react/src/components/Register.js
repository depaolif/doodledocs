import React, {Component} from 'react'
import { connect } from 'react-redux'
import { setToken, setUsername, setId } from '../actions/account'
import { setImageList } from '../actions/image'
import axios from 'axios'
import '../css/Login.scss'

class Register extends Component {
	constructor() {
		super()

		this.state = {
			username: '',
			password: '',
			usernameValidation: 'empty',
			passwordValidation: 'empty',
			failed: false
		}

		this.handleInput = this.handleInput.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
	}

	handleInput(event) {
		this.setState({
			[event.target.name]: event.target.value,
			failed: false
		})
		this.validateInput(event.target.name, event.target.value)
	}

	validateInput(input, value) {
		const stateInput = input === 'username' ? 'usernameValidation' : 'passwordValidation'
		if (value.length >= 6 && !/\W/.test(value)) {
			this.setState({
				[stateInput]: true
			});
		} else {
			this.setState({
				[stateInput]: false
			});
		}
	}

	handleSubmit(event) {
		event.preventDefault()
		axios({
			method: 'POST',
			url: 'http://localhost:3001/v1/accounts',
			data: {account: {username: this.state.username, password: this.state.password}}
		})
		.then(resp => {
			this.props.setToken(resp.data.token)
			localStorage.setItem('token', resp.data.token)
			return resp.data.token
		})
		.then((token) => {
			axios({
				method: 'GET',
				url: `http://localhost:3001/v1/me`,
				headers: {bearer: token}
			})
			.then(resp => {
				this.props.setUsername(resp.data.username)
				this.props.setId(resp.data.id)
				localStorage.setItem('id', resp.data.id)
				this.props.setImageList(resp.data.images)
				this.props.history.push('/')
			})
		})
		.catch((error) => {
			this.setState({
				failed: true
			});
		})
	}

	render() {
		const failMessage = this.state.failed ?
			<div id="failedLogin">
				<p>Someone with that username already exists. Please try a different username.</p>
			</div> :
			null
		const usernameValid = this.state.usernameValidation ? null : <div>Your username must be more than 6 characters.</div>
		const passwordValid = this.state.passwordValidation ? null : <div>Your password must be more than 6 characters.</div>
		const isDisabled = this.state.usernameValidation === true && this.state.passwordValidation === true ? null : 'disabled'
		return (
			<form onSubmit={this.handleSubmit} className="login_signup" >
				{failMessage}
				<label>Username: </label><input type="text" name="username" value={this.state.username} onChange={this.handleInput} />
				<br></br>
				{usernameValid}
				<label>Password: </label><input type="password" name="password" value={this.state.password} onChange={this.handleInput} />
				{passwordValid}
				<br></br>
				<input type="submit" value="Register" id="button" disabled={isDisabled}/>
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
	},
	setId: (id) => {
		dispatch(setId(id))
	},
	setImageList: (imageList) => {
		dispatch(setImageList(imageList))
	}
})

const ConnectedRegister = connect(null, mapDispatchToProps)(Register)

export default ConnectedRegister
