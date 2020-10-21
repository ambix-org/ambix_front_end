import React, { Component } from 'react';

import './SpotifyPlayer.scss';

class SpotifyPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 40,
    }

    this.nextTrack = this.nextTrack.bind(this);
    this.previousTrack = this.previousTrack.bind(this);
    this.rangeHandler = this.rangeHandler.bind(this);
    this.togglePlayback = this.togglePlayback.bind(this);
    this.volumeButtonHandler = this. volumeButtonHandler.bind(this);
    this.volumeChange = this.volumeChange.bind(this);
  }

  togglePlayback() {
    if (this.props.paused) {
      this.props.player.resume()
    } else {
      this.props.player.pause()
    }
    this.props.updatePauseState(!this.props.paused);
  }

  volumeButtonHandler(increment) {
    let newLevel = this.state.volume + increment;
    newLevel = newLevel >= 0 ? newLevel : 0;
    newLevel = newLevel <= 100 ? newLevel : 100;
    const playerLevel = newLevel / 100;
    this.volumeChange(playerLevel);
    this.setState({ volume: newLevel }); 
  }

  rangeHandler(event) {
    const newLevel = parseInt(event.target.value);
    const playerLevel = newLevel / 100;
    this.volumeChange(playerLevel);
    this.setState({ volume: newLevel });
  }

  volumeChange(playerLevel) {
    this.props.player.setVolume(playerLevel)
      .then(state => {
        console.log(state);
        console.log(playerLevel);
      })
  }

  nextTrack() {
    this.props.player.nextTrack();
    this.props.updatePauseState(false);
  }

  previousTrack() {
    this.props.player.previousTrack();
    this.props.updatePauseState(false);
  }

  render() {
    return (
      <section className="spotify-player media-module">
        <div id="spotify-track-info">
          <div id="artwork-box">
            { this.props.artworkURL ?
              <img
                id="artwork"
                src={this.props.artworkURL}
                alt={this.props.albumTitle}
              />
              : false
            }
          </div>
          <p id="track-title">{this.props.trackTitle}</p>
          <p id="artists">{this.props.artists}</p>
        </div>
        <div id="spotify-playback-controls">
          <i className="fas fa-backward" id="spotify-previous" onClick={this.previousTrack}></i>
          <i className={ this.props.paused ? "fas fa-play" : "fas fa-pause"}
            onClick={this.togglePlayback}
          ></i>

          <i className="fas fa-forward" id="spotify-next" onClick={this.nextTrack}></i>
        </div>
        <div id="spotify-volume-controls">
          <i className="fas fa-volume-down" id="spotify-volume-down" onClick={ () => this.volumeButtonHandler(-1) }></i>
          <input type="range" min="0" max="80" value={ this.state.volume } id="spotify-volume-range" onChange={ this.rangeHandler }/>
          <i className="fas fa-volume-up" id="spotify-volume-up" onClick={ () => this.volumeButtonHandler(1) }></i>
        </div>
      </section>
    )
  }
}

export default SpotifyPlayer;