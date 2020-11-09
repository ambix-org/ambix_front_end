import React, { Component } from 'react';

import MusicSource from './components/MusicSource/MusicSource';
import YouTube from './components/YouTube/Youtube';

import './App.scss';


class App extends Component {

  render() {
    return (<>
      <main className="App">
        <h1>Ambix</h1>
        <div className="media-modules">
          <MusicSource />
          <YouTube name="1" />
        </div>
      </main>
    </>);
  }
}

export default App;
