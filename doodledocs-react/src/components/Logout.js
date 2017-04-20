import React, {Component} from 'react'
import { connect } from 'react-redux'
import { logOut } from '../actions/account'

class Logout extends Component {

  componentDidMount() {
    this.props.logOut()
    localStorage.removeItem("token")
    this.props.history.push('/')
  }
  render() {
    return <h1>Logging Out...</h1>
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const mapDispatchToProps = (dispatch) => ({
  logOut: () => {
		dispatch(logOut())
	},
})

const ConnectedLogout = connect(mapStateToProps, mapDispatchToProps)(Logout)

export default ConnectedLogout
