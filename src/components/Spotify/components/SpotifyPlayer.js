import React, { Component } from 'react';

import './SpotifyPlayer.scss';

class SpotifyPlayer extends Component {
  render() {
    return (
      <section className="spotify-player media-module">
        <div id="spotify-track-info">
          <div id="artwork-box">
            <img
              id="artwork"
              src={this.props.artworkURL ? this.props.artworkURL : './img/spotify-icon.png'}
              alt={this.props.albumTitle ?
                `"${this.props.albumTitle}" album artwork`
                : 'Spotify Logo'}
            />
          </div>
          <p id="track-title">{this.props.trackTitle}</p>
          <p id="artists">{this.props.artists}</p>
        </div>
        <div id="spotify-playback-controls">
          <i class="fas fa-backward" id="spotify-previous"></i>
          <i class="fas fa-play" id="spotify-play"></i>
          <i class="fas fa-pause" id="spotify-pause"></i>
          <i class="fas fa-forward" id="spotify-next"></i>
        </div>
        <div id="spotify-volume-controls">
          <i class="fas fa-volume-down" id="spotify-volume-down"></i>
          <input type="range" min="0" max="80" value="50" id="spotify-volume-range"/>
          <i class="fas fa-volume-up" id="spotify-volume-up"></i>
        </div>
      </section>
    )
  }
}

export default SpotifyPlayer;