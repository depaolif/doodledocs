import React, {Component} from 'react'
import axios from 'axios'
import { connect } from 'react-redux'
import { Router, browserHistory } from 'react-router'

class Logout extends React.Component {

  componentDidMount() {
    axios({
      method: 'DELETE',
      url: `http://localhost:3001/v1/sessions/${this.props.account.id}`
    })
    .then((resp) => {
      this.props.history.push('/')
    })
  }
  render() {
    <h1>Logging Out...</h1>
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const ConnectedLogout = connect(mapStateToProps)(Logout)

export default ConnectedLogout
