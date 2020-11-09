import React, { Component } from 'react';
import Volume from '../../../Utilities/Volume/Volume';


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
      ambienceSources: [],
      videoId: '',
      volumeLevel: 50,
      rangeValue: 0.71,
      newTrackName: '',
      newTrackLocation: '',
      modalVisible: false,
    }
    this.revealModal = this.revealModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getModalClass = this.getModalClass.bind(this);
    this.addTrack = this.addTrack.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.changeTrack = this.changeTrack.bind(this);
    this.changeVolume = this.changeVolume.bind(this);
    this.checkForYouTubeIframeAPI = this.checkForYouTubeIframeAPI.bind(this);
    this.deleteTrack = this.deleteTrack.bind(this);
    this.getDeleteClass = this.getDeleteClass.bind(this);
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
      this.player = new window.YT.Player('youtube-playlist', {
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
    this.player.setLoop(true);
    this.setState({videoId: videoId});
  }

  playVideo() {
    this.player.playVideo();
  }
  
  stopVideo() {
    this.player.stopVideo();
  }
  
  componentDidMount() {
    if (!this.state.ambienceSources.length){
      let storedSources = localStorage.getItem('ambienceSources');
      if (storedSources) {
        storedSources = JSON.parse(storedSources);
        this.setState({
          ambienceSources: storedSources,
        });
      } else {
        const defaultSources = [
          {name: 'Cafe', videoId: 'gaGrHUekGrc', selected: false},
          {name: 'Campfire', videoId: 'QMJYlmX1sNU', selected: false},
          {name: 'Fireplace', videoId: 'K0pJRo0XU8s', selected: false},
          {name: 'Lab', videoId: 'eGeJF85SOdQ', selected: false},
          {name: 'Rain', videoId: 'LlKyGAGHc4c', selected: false},
          {name: 'Storm', videoId: 'EbMZh-nQFsU', selected: false},
          {name: 'Waves', videoId: 'ibZUd-6pDeY', selected: false},
        ];
        this.setState({ ambienceSources: defaultSources });
        localStorage.setItem('ambienceSources', JSON.stringify(defaultSources));
      }
    }
    this.playerCheckInterval = setInterval(() => this.checkForYouTubeIframeAPI(), 1000);
  }
  
  onPlayerReady() {
    this.changeVolume(50, 0.5);
  }
  
  onPlayerStateChange(event) {
    // console.log(event)
    // If a videoID is invalid, the .getVideoData() method will return a title and author of ''.
    // Could potentially be used to detect bac ambient tracks that were added.
    // Would need a way to notify or automatically delete the button.
    // console.log(event.target.getVideoData())
    if (event.data === 1) {
      this.setState({ paused: false });
    } else if (event.data === 5){
      this.setState({ paused: true });
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
  
  changeVolume(volumeLevel, rangeValue) {
    this.player.setVolume(volumeLevel);
    this.setState({ 
      volumeLevel: volumeLevel,
      rangeValue: rangeValue,
    });
  }

  changeHandler(event) {
    this.setState({
      [event.target.name]: event.target.value,
    })
  }

  addTrack(){
    const extractIdExp = /[a-zA-Z0-9-_]{11}/;
    const videoId = this.state.newTrackLocation.match(extractIdExp)[0];
    const newSourceSet = [
      ...this.state.ambienceSources,
      {
        name: this.state.newTrackName,
        videoId: videoId,
        selected: false,
      }
    ];
    this.setState({
      modalVisible: false,
      newTrackLocation: '',
      newTrackName: '',
      ambienceSources: [...newSourceSet],
    });
    localStorage.setItem('ambienceSources', JSON.stringify(newSourceSet));
  }

  getModalClass() {
    const baseClass = 'add-track';
    const visibility = this.state.modalVisible ? '' : ' hidden'
    return baseClass + visibility;
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  revealModal() {
    this.setState({ modalVisible: true });
  }

  getDeleteClass() {
    const baseClass = 'fa fa-trash-o track-buttons';
    const visibility = this.state.videoId ? '': ' no-display';
    return baseClass + visibility;
  }

  deleteTrack() {
    const newSourceSet = this.state.ambienceSources.reduce( (acc, source) => {
      if (source.videoId !== this.state.videoId) {
        acc.push(source);
      }
      return acc;
    }, []);
    this.togglePlayback();
    this.setState({ 
      ambienceSources: newSourceSet,
      videoId: '',
      newTrackName: '',
      newTrackLocation: '',
    });
    localStorage.setItem('ambienceSources', JSON.stringify(newSourceSet));
  }

  render() {
    return (
    <section className="youtube-player media-module">
      <h2>youtube playlist</h2> 
      <div id="youtube-playlist"></div>
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
        <i className="fas fa-plus track-buttons" onClick={this.revealModal}></i>
        <i className={this.getDeleteClass()} onClick={this.deleteTrack}></i>
        <div className={this.getModalClass()}>
          <div className="new-track-info">
            <input 
              type="text" 
              name="newTrackName" 
              placeholder="Track Name"
              value={this.state.newTrackName} 
              onChange={this.changeHandler}
            />
            <input 
              type="text" 
              name="newTrackLocation" 
              placeholder="YouTube Video Link or ID"
              value={this.state.newTrackLocation}
              onChange={this.changeHandler} 
            />
          </div>
          <button onClick={this.addTrack}>Add Track</button>
          <button onClick={this.closeModal}>Cancel</button>
        </div>
      </div>
      <div className="player-controls">
        <i className={this.getPlaybackStatus()} onClick={this.togglePlayback}></i>
        <Volume
          playable={this.state.videoId}
          volumeLevel={this.state.volumeLevel}
          rangeValue={this.state.rangeValue}
          changeVolume={this.changeVolume}
        />
      </div>
    </section>);
  }
}

export default YouTube;
