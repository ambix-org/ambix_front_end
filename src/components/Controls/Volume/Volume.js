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
      console.log(`**BUTTON: Current Range Value - ${this.props.rangeValue}`)
      console.log(`**BUTTON: Increment - ${increment} - Type ${typeof increment}`)
      let newRangeValue = this.props.rangeValue + increment;

      if (newRangeValue < 0 || newRangeValue > 100) {
        newRangeValue = newRangeValue > 100 ? 100 : 0;
      }
      console.log(`**BUTTON: New Range Value - ${newRangeValue}`)
      const volumeLevel = this.adjustForHumans(newRangeValue);
      console.log(`**BUTTON: New Volume Level - ${volumeLevel}`)
      this.props.changeVolume(volumeLevel, newRangeValue);
    }
  }

  adjustForHumans(rangeValue) {
    // Curve Function: x^2
    // x: A value from the input range from 0.00 to 1.00
    return parseInt((Math.pow(rangeValue, 2) * 100).toFixed(0))
  }

  rangeHandler(event) {
    if (this.props.playable){
      // 0.00 -> 1.00
      console.log(`**RANGE: Current Range Value - ${this.props.rangeValue}`)
      const rangeValue = parseFloat(event.target.value);
      // console.log(`**RANGE: Actual Range Value`)
      console.log(`**RANGE: New Range Value - ${rangeValue}`)

      // 0 -> 100, curved for human hearing
      const volumeLevel = this.adjustForHumans(rangeValue);
      console.log(`**RANGE: New Volume Level - ${volumeLevel}`)

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
