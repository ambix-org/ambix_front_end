import React, { Component } from 'react';

import './SpotifyPlayer.scss';

class SpotifyPlayer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      volume: 40,
    }

    this.changeVolume = this.changeVolume.bind(this);
    this.getInputRangeStatus = this.getInputRangeStatus.bind(this);
    this.getNextTrack = this.getNextTrack.bind(this);
    this.getPlaybackStatus = this.getPlaybackStatus.bind(this);
    this.getPreviousTrack = this.getPreviousTrack.bind(this);
    this.getTrackStatus = this.getTrackStatus.bind(this);
    this.getVolumeStatus = this.getVolumeStatus.bind(this);
    this.rangeHandler = this.rangeHandler.bind(this);
    this.togglePlayback = this.togglePlayback.bind(this);
    this.volumeButtonHandler = this. volumeButtonHandler.bind(this);
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
    this.changeVolume(playerLevel);
    this.setState({ volume: newLevel }); 
  }

  rangeHandler(event) {
    const newLevel = parseInt(event.target.value);
    const playerLevel = newLevel / 100;
    this.changeVolume(playerLevel);
    this.setState({ volume: newLevel });
  }

  changeVolume(playerLevel) {
    this.props.player.setVolume(playerLevel);
  }

  getNextTrack() {
    this.props.player.nextTrack();
    this.props.updatePauseState(false);
  }

  getPreviousTrack() {
    this.props.player.previousTrack();
    this.props.updatePauseState(false);
  }

  getPlaybackStatus() {
    const baseClass = `fas`;
    const playbackState  = this.props.paused ? ' fa-play' : ' fa-pause';
    const playable = this.props.playable ? '' : ' dim';
    return baseClass + playbackState + playable;
  }

  getTrackStatus(baseClass, trackStatus) {
    const playable = this.props.playable && trackStatus ? '' : ' dim';
    return baseClass + playable;
  }

  getVolumeStatus(baseClass) {
    const playable = this.props.playable ? '' : ' dim';
    return baseClass + playable;
  }

  getInputRangeStatus() {
    return this.props.playable? '' : 'dim-range';
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
          <i className={this.getTrackStatus('fas fa-backward', this.props.previousTracks)} 
            onClick={this.getPreviousTrack}></i>
          <i className={this.getPlaybackStatus()} onClick={this.togglePlayback}></i>
          <i className={this.getTrackStatus('fas fa-forward', this.props.nextTracks)} 
            onClick={this.getNextTrack}></i>
        </div>
        <div id="spotify-volume-controls">
          <i className={this.getVolumeStatus('fas fa-volume-down')} 
            onClick={ () => this.volumeButtonHandler(-1) }></i>
          <input type="range" min="0" max="80" 
            className={this.getInputRangeStatus()} 
            value={ this.state.volume } onChange={ this.rangeHandler }/>
          <i className={this.getVolumeStatus('fas fa-volume-up')} 
            onClick={ () => this.volumeButtonHandler(1) }></i>
        </div>
      </section>
    )
  }
}

export default SpotifyPlayer;