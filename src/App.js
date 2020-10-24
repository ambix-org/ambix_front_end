import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import superagent from 'superagent';

import Auth from './components/Auth/Auth';
import Spotify from './components/Spotify/Spotify';
import YouTube from './components/YouTube/Youtube';

import './App.scss';


// const AUTH_URI = 'https://ambix-server.herokuapp.com/authorize';
const AUTH_URI = 'http://localhost:4242/authorize';


class App extends Component {

  constructor(props) {
    super(props);
    const refreshToken = localStorage.getItem('refresh');
    
    this.state = {
      refreshToken: refreshToken,
      redirect: false,
      redirectURL: '',
    }
    
    this.isAuthorized = this.isAuthorized.bind(this);
    this.requestAuth = this.requestAuth.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  requestAuth() {
    superagent.get(AUTH_URI)
      .then(response => {
        this.setState({
          redirect: true,
          redirectURL: response.body.redirectURL
        })
      });
  }

  isAuthorized(refreshToken) {
    this.setState({
      refreshToken
    })
  }

  disconnect() {
    this.setState({ refreshToken: ''});
    localStorage.removeItem('refresh');
  }

  redirect() {
    console.log(`Redirecting to ${this.state.redirectURL}`)
    window.location = this.state.redirectURL;
  }

  render() {
    return (<>
      <Route path="/auth">
        <Auth refreshToken={this.state.refreshToken} isAuthorized={this.isAuthorized}/>
      </Route>
      <Route path="/">
        <main className="App">
          {this.state.redirect ? this.redirect() : false}
          <h1>Ambix</h1>
          { this.state.refreshToken ?
            <>
              <div className="media-modules">
                { this.state.refreshToken ? <Spotify refreshToken={this.state.refreshToken} /> : false }
                <YouTube />
              </div>
              <button className="disconnect" onClick={this.disconnect}>Disconnect</button>
            </>
            : 
            <button onClick={this.requestAuth}>Sign-In</button>
          }         
        </main>
      </Route>
    </>);
  }
}

export default App;
