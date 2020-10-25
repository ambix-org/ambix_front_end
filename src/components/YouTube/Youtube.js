import React, { Component } from 'react';
import Volume from '../Controls/Volume/Volume';

import './YouTube.scss';


class AmbientTrack extends Component {
  render() {
    return (
      <button 
      className={'track' + (this.props.selected ? ' selected' : '')}
      onClick={() => {
        if (this.props.selected){
          this.props.changeTrack('');
        } else {
          this.props.changeTrack(this.props.videoId)
        }
      }}
      >
        {this.props.name}
      </button>
    )
  }
}

class YouTube extends Component {
  constructor(props) {
    super(props);
    this.state = {
      paused: true,
      ambienceSources: [
        {name: 'Cafe', videoId: 'gaGrHUekGrc', selected: false},
        {name: 'Campfire', videoId: 'QMJYlmX1sNU', selected: false},
        {name: 'Fireplace', videoId: 'K0pJRo0XU8s', selected: false},
        {name: 'Lab', videoId: 'eGeJF85SOdQ', selected: false},
        {name: 'Rain', videoId: 'LlKyGAGHc4c', selected: false},
        {name: 'Storm', videoId: 'EbMZh-nQFsU', selected: false},
        {name: 'Waves', videoId: 'ibZUd-6pDeY', selected: false},
      ],
      videoId: '',
      volume: 0,
    }
    this.changeTrack = this.changeTrack.bind(this);
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
        videoId: this.state.videoId,
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange': this.onPlayerStateChange,
        }
      });
    }
  }

  changeTrack(videoId) {
    this.player.loadVideoById(videoId);
    this.setState({videoId: videoId});
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
    if (event.data === 1) {
      this.setState({paused: false});
    } else if (event.data === 5){
      this.setState({paused: true});
    }
  }
  
  getPlaybackStatus() {
    const baseClass = `fas`;
    let playbackState;
    if (this.state.videoId){
      playbackState  = this.state.paused ? ' fa-play' : ' fa-pause';
    } else {
      playbackState = ' fa-play dim';
    }
    return baseClass + playbackState;
  }
  
  togglePlayback() {
    if (this.state.videoId){
      if (this.state.paused) {
        this.player.playVideo()
      } else {
        this.player.stopVideo()
      }
      this.setState({ paused: !this.state.paused });
    }
  }
  
  changeVolume(playerLevel) {
    this.player.setVolume(playerLevel);
    this.setState({ volume: playerLevel });
  }

  render() {
    return (
    <section className="youtube-player media-module">
      <h2>Ambience Mixer</h2> 
      <div id='player'></div>
      <div className="ambience-tracks">
        { this.state.ambienceSources.map(source => {
          return (<AmbientTrack 
            name={source.name} 
            videoId={source.videoId} 
            selected={source.videoId === this.state.videoId}
            key={source.videoId}
            changeTrack={this.changeTrack}
          />)
        })}
      </div>
      <div className="player-controls">
      <i className={this.getPlaybackStatus()} onClick={this.togglePlayback}></i>
      </div>
      <Volume
        playable={this.state.videoId}
        volume={this.state.volume}
        changeVolume={this.changeVolume}
      />
    </section>);
  }
}

export default YouTube;
