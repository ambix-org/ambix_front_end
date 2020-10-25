import React, { Component } from 'react';
import Volume from '../Controls/Volume/Volume';

import './YouTube.scss';


class YouTube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      ambienceSources: [
        ['Cafe', 'gaGrHUekGrc'],
        ['Campfire', 'QMJYlmX1sNU'],
        ['Fireplace', 'K0pJRo0XU8s'],
        ['Lab', 'eGeJF85SOdQ'],
        ['Rain', 'LlKyGAGHc4c'],
        ['Storm', 'EbMZh-nQFsU'],
        ['Waves', 'ibZUd-6pDeY'],
      ],
      volume: 0,
    }
    this.changeVolume = this.changeVolume.bind(this);
    this.checkForYouTubeIframeAPI = this.checkForYouTubeIframeAPI.bind(this);
    this.getPlaybackStatus = this.getPlaybackStatus.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
    this.togglePlayback = this.togglePlayback.bind(this);
  }

  checkForYouTubeIframeAPI() {
    if (window.YT !== null) {
      clearInterval(this.playerCheckInterval);
      this.player = new window.YT.Player('player', {
        height: '0',
        widht: '0',
        videoId: 'LlKyGAGHc4c',
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
        }
      });
    }
  }

  
  playVideo() {
    this.player.playVideo();
  }
  
  stopVideo() {
    this.player.stopVideo();
  }
  
  componentDidMount() {
    this.playerCheckInterval = setInterval(() => this.checkForYouTubeIframeAPI(), 1000);
  }
  
  onPlayerReady() {
    this.setState({volume: this.player.getVolume()})
  }
  
  onPlayerStateChange(event) {
    console.log('STATE CHANGED:\n', event.data)
  }
  
  getPlaybackStatus() {
    const baseClass = `fas`;
    const playbackState  = this.state.paused ? ' fa-play' : ' fa-pause';
    return baseClass + playbackState;
  }
  
  togglePlayback() {
    if (this.state.paused) {
      this.player.playVideo()
    } else {
      this.player.stopVideo()
    }
    this.setState({ paused: !this.state.paused });
  }
  
  changeVolume(playerLevel) {
    this.player.setVolume(playerLevel);
    this.setState({ volume: playerLevel });
  }
  
  // YouTube Player Methods:
  //   - player.loadVideoById(videoId)
  render() {
    return (
    <section className="youtube-player media-module">
      <h2>Ambience Mixer</h2> 
      <div id='player'></div>
      <div className="ambience-tracks">
        {/* Loop over sources to create track buttons */}
      </div>
      <div className="player-controls">
      <i className={this.getPlaybackStatus()} onClick={this.togglePlayback}></i>
      </div>
      <Volume
        playable={true}
        volume={this.state.volume}
        changeVolume={this.changeVolume}
      />
    </section>);
  }
}

export default YouTube;
