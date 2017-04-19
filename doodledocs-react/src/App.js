import './App.css';
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { BrowserRouter as Router, Route, browserHistory, Switch, Redirect } from 'react-router-dom'
import ConnectedLogin from './components/Login'
import ConnectedLogout from './components/Logout'
import ConnectedRegister from './components/Register'
import ConnectedDoodle from './components/Doodle'
import ConnectedProfile from './components/Profile'
import ConnectedNavBar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'
import { setToken, setUsername, setId } from '../actions/account'
import { setImageList } from '../actions/image'

class App extends Component {
  componentDidMount() {
    let token = localStorage.getItem('token')
    if (token) {
      this.props.setToken(token)
      axios({
        method: 'GET',
        url: 'http://localhost:3001/v1/me',
        headers: {bearer: token}
      })
      .then(resp => {
        this.props.setUsername(resp.data.username)
        this.props.setId(resp.data.id)
        this.props.setImageList(resp.data.images)
      })
    }
  }

  render() {
    return (
        <div className="App">
          <Router history={browserHistory}>
            <div>
              <Route path="/" component={ConnectedNavBar}/>
              <Switch>
                <Route exact path="/" component={ConnectedDoodle} />
                <Route path="/login" component={ConnectedLogin} />
                <Route path="/logout" component={ConnectedLogout} />
                <Route path="/register" component={ConnectedRegister} />
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
  setImageList: (list) => {
    dispatch(setImageList(list))
  },
})

const ConnectedApp = connect(mapStateToProps, mapDispatchToProps)(App)

export default ConnectedApp
