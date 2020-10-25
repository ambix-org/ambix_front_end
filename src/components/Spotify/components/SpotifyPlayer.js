import React, { Component } from 'react';
import Volume from '../../Controls/Volume/Volume';

import './SpotifyPlayer.scss';

class AlbumArtwork extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageOneActive: true,
      imageOneSource: 'https://www.techspot.com/images2/downloads/topdownload/2016/12/spotify-icon-18.png',
      imageOneClass: 'active',
      imageOneAltText: 'Spotify logo',
      imageTwoActive: false,
      imageTwoSource: '',
      imageTwoClass: 'inactive',
      imageTwoAltText: 'blank',
    }

    this.getImageInfo = this.getImageInfo.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (this.props.artworkURL !== prevProps.artworkURL){
      const imageOneInfo = this.getImageInfo('imageOne');
      const imageTwoInfo = this.getImageInfo('imageTwo');

      this.setState({
        imageOneActive: !this.state.imageOneActive,
        imageOneSource: imageOneInfo.source,
        imageOneClass: imageOneInfo.class,
        imageOneAltText: imageOneInfo.altText,
        imageTwoActive: !this.state.imageTwoActive,
        imageTwoSource: imageTwoInfo.source,
        imageTwoClass: imageTwoInfo.class,
        imageTwoAltText: imageTwoInfo.altText,
      });
    }
  }

  getImageInfo(element) {
    const newActiveStatus = !this.state[`${element}Active`];
    const source = newActiveStatus ? this.props.artworkURL : this.state[`${element}Source`];
    let newClass = (source === 'https://www.techspot.com/images2/downloads/topdownload/2016/12/spotify-icon-18.png') ? '' : 'artwork';
    newClass += newActiveStatus ? ' active' : ' inactive';
    const altText = newActiveStatus ? this.props.altText : this.state[`${element}AltText`];
    return {class: newClass, altText: altText, source: source}
  }

  render() {
    return (
      <div className="album-artwork-container">
        <img 
          className={this.state.imageOneClass} 
          src={this.state.imageOneSource}
          alt={this.state.imageOneAltText}
        />
        <img 
          className={this.state.imageTwoClass} 
          src={this.state.imageTwoSource}
          alt={this.state.imageTwoAltText}
        />
      </div>
    )
  }
}

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
      <>
        <div id="spotify-track-info">
          <AlbumArtwork
            artworkURL={this.props.artworkURL}
            alt={this.props.albumTitle}
          />
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
      </>
    )
  }
}

export default SpotifyPlayer;
