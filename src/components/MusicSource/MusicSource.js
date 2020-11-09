import React, { Component } from 'react';
import { Route } from 'react-router-dom';
import superagent from 'superagent';

import Auth from './components/Auth/Auth';
import Spotify from './components/Spotify/Spotify';
import YouTubePlaylist from './components/YouTubePlaylist/YoutubePlaylist';


const AUTH_URI = 'http://localhost:4242/authorize';
// const AUTH_URI = 'https://ambix-dev-server.herokuapp.com/authorize';
// const AUTH_URI = 'https://ambix-server.herokuapp.com/authorize';


class MusicSource extends Component {

  constructor(props) {
    super(props);
    const refreshToken = localStorage.getItem('refresh');
    
    this.state = {
      musicSource: null,
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
    localStorage.removeItem('refresh');
    localStorage.removeItem('_spharmony_device_id');
    window.location.reload();
  }

  redirect() {
    window.location = this.state.redirectURL;
  }

  render() {
    return (<>
      <Route path="/auth">
        <Auth refreshToken={this.state.refreshToken} isAuthorized={this.isAuthorized}/>
      </Route>
      <Route path="/">
        {this.state.redirect ? this.redirect() : false}
        { this.state.musicSource === null ? 
          <section className="media-module audio-source">
            <h2>Audio source</h2>
            <div className="button-container">
              <button onClick={() => this.setState({musicSource: 'Spotify'})}>Spotify Premium</button>
              <button onClick={() => this.setState({musicSource: 'YouTube'})}>YouTube Playlist</button>
            </div>
            <div className="bumper"></div>
          </section>
          : false
        }
        { this.state.musicSource === 'YouTube' ? 
          <YouTubePlaylist />
          : false
        }
        { this.state.musicSource === 'Spotify'  && this.state.refreshToken ?
          <Spotify refreshToken={this.state.refreshToken} /> 
          : false
        }
        { this.state.musicSource === 'Spotify' && !this.state.refreshToken ?
          <div className="media-module">
            <button className="disconnect" onClick={this.requestAuth}>
                <i className="fa fa-spotify spotify-logo" aria-hidden="true"></i>
              <div className="button-text">
                <p className="account-text" >Sign In</p>
              </div>
            </button>
          </div>
          : false
        }
        { this.state.musicSource === 'Spotify' && this.state.refreshToken ? 
          <div className="button-container">
            <button className="disconnect" onClick={this.disconnect}>
                <i className="fa fa-spotify spotify-logo" aria-hidden="true"></i>
              <div className="button-text">
                <p className="account-text" >Disconnect</p>
              </div>
            </button>
          </div>
          : <div className="button-container"></div>
        }
      </Route>
    </>);
  }
}

export default MusicSource;
