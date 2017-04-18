import React from 'react'
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom'
import { connect } from 'react-redux'

const PrivateRoute = ({ token, component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    token ? (
      <Component {...props}/>
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location }
      }}/>
    )
  )}/>
)

const mapStateToProps = (state) => ({
	token: state.account.token
})

const ConnectedPrivateRoute = connect(mapStateToProps, null)(PrivateRoute)

export default ConnectedPrivateRoute