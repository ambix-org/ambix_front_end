import React, { Component } from 'react';
import Volume from '../../Controls/Volume/Volume';

import './SpotifyPlayer.scss';

class SpotifyPlayer extends Component {
  constructor(props) {
    super(props);

    this.getNextTrack = this.getNextTrack.bind(this);
    this.getPlaybackStatus = this.getPlaybackStatus.bind(this);
    this.getPreviousTrack = this.getPreviousTrack.bind(this);
    this.getTrackStatus = this.getTrackStatus.bind(this);
    this.togglePlayback = this.togglePlayback.bind(this);
  }

  togglePlayback() {
    if (this.props.paused) {
      this.props.player.resume()
    } else {
      this.props.player.pause()
    }
    this.props.updatePauseState(!this.props.paused);
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
        <Volume
          playable={this.props.playable}
          player={this.player}
          volume={this.props.volume}
          volumeDivisor={100}
          changeVolume={this.props.changeVolume}
        />
      </section>
    )
  }
}

export default SpotifyPlayer;
