import React, { Component } from 'react';
import { withCookies } from 'react-cookie';
import superagent from 'superagent';
import SpotifyPlayer from './components/SpotifyPlayer';


const REFRESH_URI = 'https://ambix-server.herokuapp.com/refresh';
// const REFRESH_URI = 'http://localhost:4242/refresh';

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerReady: false,
      artworkURL: '',
      albumTitle: '',
      trackTitle: 'Select \'ReAmbix\' in Spotify',
      artists: '',
      playable: false,
      paused: true,
      nextTracks: false,
      previousTracks: false,
    }
    this.checkForPlayer = this.checkForPlayer.bind(this);
    this.playerCheckInterval = null;
    this.updatePauseState = this.updatePauseState.bind(this);
  }

  checkForPlayer() {
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "ReAmbix",
        getOAuthToken: cb => {
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
        if (state) {
          const artists = state.track_window.current_track.artists.reduce((accum, artist) => {
            return accum ? `${accum} | ${artist.name}` : `${artist.name}`;
          }, '');
          this.setState({
            artists,
            trackTitle: state.track_window.current_track.name,
            artworkURL: state.track_window.current_track.album.images[0].url || './img/spotify-icon.png',
            albumTitle: state.track_window.current_track.album.name,
            playable: true,
            paused: state.paused,
            nextTracks: state.track_window.next_tracks.length ? true : false,
            previousTracks: state.track_window.previous_tracks.length ? true : false,
          })
        } else {
          this.setState({
            artworkURL: '',
            albumTitle: '',
            trackTitle: 'Select \'ReAmbix\' in Spotify',
            artists: '',
            playable: false,
            paused: true,
            nextTracks: false,
            previousTracks: false,
          })
        }
      });
      this.player.addListener('ready', ({ device_id }) => {
        console.log('Ready with Device ID', device_id);
      });
      this.player.addListener('not_ready', ({ device_id }) => {
        console.log('Device ID has gone offline', device_id);
      });

      this.player.connect();

      this.setState({ playerReady: true });
    }
  }

  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkForPlayer(), 1000);
  }

  updatePauseState(newState) {
    this.setState({ pasused: newState });
  }

  render() {
    return (<>
      { this.state.playerReady ?
        <SpotifyPlayer
          albumTitle={this.state.albumTitle}
          artists={this.state.artists}
          trackTitle={this.state.trackTitle}
          artworkURL={this.state.artworkURL}
          player={this.player}
          playable={this.state.playable}
          paused={this.state.paused}
          nextTracks={this.state.nextTracks}
          previousTracks={this.state.previousTracks}
          updatePauseState={this.updatePauseState}
        />
        : false
      }
    </>)
  }
}

export default withCookies(Spotify);
