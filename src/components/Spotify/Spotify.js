import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import superagent from 'superagent';

const REFRESH_URI = 'http://localhost:4242/refresh'

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artworkURL: '',
      trackTitle: '',
      albumTitle: '',
      artists: '',
    }
    this.playerCheckInterval = null;
  }

  checkForPlayer() {
    console.log("Checking for player")

    if (window.Spotify !== null) {
      console.log("Player found")
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "ReAmbix",
        getOAuthToken: cb => {
          // Contacting Backend for new access token
          superagent.post(REFRESH_URI)
            .type('form')
            .send({ refreshToken: this.props.refreshToken })
            .then(response => {
              cb(response.body.accessToken);
            })
            .catch(err => console.error('TOKEN ERROR:', err));
        }
      });

      this.player.addListener('initialization_error', ({ message }) => {
        console.error('Initialization Error:', message);
      });
      this.player.addListener('authentication_error', ({ message }) => {
        console.error('Authentication Error:', message);
      });
      this.player.addListener('account_error', ({ message }) => {
        console.error('Account Error:', message);
      });
      this.player.addListener('playback_error', ({ message }) => {
        console.error('Playback Error:', message);
      });
      this.player.addListener('player_state_changed', state => {
        console.log('State Change: ', state);
      });
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.player.connect();
    }
  }

  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  render() {
    return (<>
      <p>This will be a Spotify Web Player!!</p>
    </>)
  }
}

export default withCookies(Spotify);
