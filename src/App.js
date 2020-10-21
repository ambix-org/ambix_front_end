import React, { Component } from 'react';
import {
  CookiesProvider,
  withCookies,
} from 'react-cookie';
import {
  BrowserRouter as Router,
} from 'react-router-dom';
import superagent from 'superagent';

import Spotify from './components/Spotify/Spotify';

import './App.scss';

class App extends Component {
  constructor(props) {
    super(props);

    const refreshToken = this.props.cookies.get('refreshToken');

    this.state = {
      refreshToken: refreshToken,
      redirect: false,
      redirectURL: '',
    }
    this.authorize = this.authorize.bind(this);
    this.disconnect = this.disconnect.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  authorize() {
    superagent.get('https://ambix-server.herokuapp.com/authorize')
      .then(response => {
        this.setState({
          redirect: true,
          redirectURL: response.body.redirectURL
        })
      })
  }

  disconnect() {
    this.setState({ refreshToken: ''});
    this.props.cookies.remove('refreshToken');
    document.location.reload()
  }

  redirect() {
    console.log(`Redirecting to ${this.state.redirectURL}`)
    window.location = this.state.redirectURL;
  }

  render() {
    return (
      <CookiesProvider>
        <Router>
          <main className="App">
            {this.state.redirect ? this.redirect() : false}
            <h1>Ambix</h1>
            { this.state.refreshToken ?
                <>
                  <div className="media-modules">
                    { this.state.refreshToken ? <Spotify refreshToken={this.state.refreshToken} /> : false }
                  </div>
                  <button className="disconnect" onClick={this.disconnect}>Disconnect</button>
                </>
                : <button onClick={this.authorize}>Sign-In</button>
            }         
          </main>
        </Router>
      </CookiesProvider>
    );
  }
}

export default withCookies(App);
