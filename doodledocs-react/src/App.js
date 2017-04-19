import './App.css';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, browserHistory, Switch, Redirect } from 'react-router-dom'
import ConnectedLogin from './components/Login'
import ConnectedLogout from './components/Logout'
import Register from './components/Register'
import ConnectedDoodle from './components/Doodle'
import ConnectedProfile from './components/Profile'
import ConnectedNavBar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'

class App extends Component {
  render() {
    return (
        <div className="App">
          <Router history={browserHistory}>
            <div>
              <Route path="/" component={ConnectedNavBar}/>
              <Switch>
                <Route exact path="/" component={ConnectedDoodle} />
                <Route path="/login" component={ConnectedLogin} />
                <Route path="/register" component={Register} />
                <Route path="/logout" component={ConnectedLogout} />
                <PrivateRoute path="/profile" component={ConnectedProfile} />
              </Switch>
            </div>
          </Router>
        </div>
      );
  }
}

const mapStateToProps = (state) => ({
  account: state.account
})

const ConnectedApp = connect(mapStateToProps, null)(App)

export default ConnectedApp
