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
      let newRangeValue = this.props.rangeValue + increment;

      if (newRangeValue < 0 || newRangeValue > 100) {
        newRangeValue = newRangeValue > 100 ? 100 : 0;
      }
      const volumeLevel = this.adjustForHumans(newRangeValue);
      this.props.changeVolume(volumeLevel, newRangeValue);
    }
  }

  adjustForHumans(rangeValue) {
    return parseInt((Math.pow(rangeValue, 2) * 100).toFixed(0))
  }

  rangeHandler(event) {
    if (this.props.playable){
      const rangeValue = parseFloat(event.target.value);
      const volumeLevel = this.adjustForHumans(rangeValue);

      this.props.changeVolume(volumeLevel, rangeValue);
    }
  }

  getVolumeStatus(baseClass) {
    const playable = this.props.playable ? '' : ' dim';
    return baseClass + playable;
  }

  getInputRangeStatus() {
    return this.props.playable? 'range' : 'range dim-range';
  }

  render() {
    return (
      <div className="volume-controls">
        <i className={this.getVolumeStatus('fas fa-volume-down')} 
          onClick={ () => this.volumeButtonHandler(-0.01) }></i>
        <input type="range" min="0" max="1" step="0.01" 
          className={this.getInputRangeStatus()} 
          value={ this.props.rangeValue } onChange={ this.rangeHandler }/>
        <i className={this.getVolumeStatus('fas fa-volume-up')} 
          onClick={ () => this.volumeButtonHandler(0.01) }></i>
      </div>  
    );
  }
}

export default Volume;
