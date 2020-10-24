import React, { Component } from 'react';

import './Volume.scss';


class Volume extends Component {
  constructor(props) {
    super(props);
    this.getInputRangeStatus = this.getInputRangeStatus.bind(this);
    this.getVolumeStatus = this.getVolumeStatus.bind(this);
    this.rangeHandler = this.rangeHandler.bind(this);
    this.volumeButtonHandler = this.volumeButtonHandler.bind(this);
  }
  
  volumeButtonHandler(increment) {
    if (this.props.playable) {
      let newLevel = this.props.volume + increment;
      if (newLevel < 0 || newLevel > 100) {
        newLevel = newLevel > 100 ? 100 : 0;
      }
      this.props.changeVolume(newLevel);
    }
  }

  rangeHandler(event) {
    if (this.props.playable){
      let newLevel = parseInt(event.target.value);
      this.props.changeVolume(newLevel);
    }
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
      <div className="volume-controls">
        <i className={this.getVolumeStatus('fas fa-volume-down')} 
          onClick={ () => this.volumeButtonHandler(-1) }></i>
        <input type="range" min="0" max="80" 
          className={this.getInputRangeStatus()} 
          value={ this.props.volume } onChange={ this.rangeHandler }/>
        <i className={this.getVolumeStatus('fas fa-volume-up')} 
          onClick={ () => this.volumeButtonHandler(1) }></i>
      </div>  
    );
  }
}

export default Volume;
