import React, { Component } from 'react';

class SpotifyPlayer extends Component {
  render() {
    return (
      <div>
        <img
          src={this.props.artworkURL}
          alt={`Album artwork for ${this.props.albumTitle} by ${this.props.artists}`}
        />
        <p>{this.props.trackTitle}</p>
        <p>{this.props.albumTitle}</p>
        <p>{this.props.artists}</p>
      </div>
    )
  }
}

export default SpotifyPlayer;