import React, { Component } from 'react';

import './YouTube.scss';


class YouTube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      playing: false,
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
    this.checkForYouTubeIframeAPI = this.checkForYouTubeIframeAPI.bind(this);
    this.onPlayerReady = this.onPlayerReady.bind(this);
    this.onPlayerStateChange = this.onPlayerStateChange.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.stopVideo = this.stopVideo.bind(this);
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

  // YouTube Player Methods:
  //   - player.playVideo()
  //   - player.stopVideo()
  //   - player.setVolume(newlevel)
  //   - player.getVolume()
  //   - player.loadVideoById(videoId)

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
    // Grab volume from the player
    // Set that value to the volume input range
  }

  onPlayerStateChange(event) {
    console.log('STATE CHANGED:\n', event.data)
  }

  render() {
    return (
    <section className="youtube-player media-module">
      <h2>Ambience Mixer</h2> 
      <div id='player'></div>
      <div className="ambience-tracks">
        {/* Loop over sourcecs to create track buttons in the  */}
      </div>
      <div className="player-controls">
        <i className="fas fa-play" onClick={this.playVideo}></i>
        <i className="fas fa-stop" onClick={this.stopVideo}></i>
      </div>
      <div className="volume-controls">              
        <i className="fas fa-volume-down"></i>
        <input type="range" min="0" max="80" value={this.state.volume} />
        <i className="fas fa-volume-up"></i>
      </div>
    </section>);
  }
}

export default YouTube;
