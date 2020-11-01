import React, { Component } from 'react';
import superagent from 'superagent';
import SpotifyPlayer from './components/SpotifyPlayer';


// const REFRESH_URI = 'http://localhost:4242/refresh';
const REFRESH_URI = 'https://ambix-dev-server.herokuapp.com/refresh';
// const REFRESH_URI = 'https://ambix-server.herokuapp.com/refresh';

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playerReady: false,
      artworkURL: '',
      albumTitle: '',
      trackTitle: 'Select \'Ambix\' in Spotify',
      artists: '',
      playable: false,
      paused: true,
      nextTracks: false,
      previousTracks: false,
      volumeLevel: 50,
      rangeValue: .71,
    }
    this.checkForPlayer = this.checkForPlayer.bind(this);
    this.updatePauseState = this.updatePauseState.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.getPlayerClass = this.getPlayerClass.bind(this);
  }

  checkForPlayer() {
    if (window.Spotify !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.Spotify.Player({
        name: "Ambix",
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
            artworkURL: 'https://www.techspot.com/images2/downloads/topdownload/2016/12/spotify-icon-18.png',
            albumTitle: 'Spotify logo',
            trackTitle: 'Select \'Ambix\' in Spotify',
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

  changeVolume(volumeLevel, rangeValue) {
    console.log(volumeLevel);
    const newLevel = parseFloat((volumeLevel / 100).toFixed(2));
    rangeValue = parseFloat(rangeValue.toFixed(2));
    console.log(rangeValue);
    console.log(newLevel)
    this.player.setVolume(newLevel);
    this.setState({ 
      volumeLevel: volumeLevel,
      rangeValue: rangeValue,
     });
  }

  getPlayerClass() {
    let newClass = 'player-contents';
    newClass += this.state.playerReady ? '' : ' transparent';
    return newClass;
  }

  render() {
    return (
    <section className="spotify-player media-module">
      <div className={this.getPlayerClass()}>
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
            volumeLevel={this.state.volumeLevel}
            rangeValue={this.state.rangeValue}
            changeVolume={this.changeVolume}
          />
          : false
        }
      </div>
    </section>)
  }
}

export default Spotify;
