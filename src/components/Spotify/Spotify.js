import React, { Component } from 'react';
import { withCookies } from 'react-cookie';

class Spotify extends Component {
  constructor(props) {
    super(props);
    this.state = {
      artworkURL: '',
      trackTitle: '',
      albumTitle: '',
      artists: '',
    }
  }

  componentDidMount() {
    const scriptSources = [
      'https://sdk.scdn.co/spotify-player.js',
      'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
      './spotifyPlayer.js',
    ]

    scriptSources.forEach(source => {
      const script = document.createElement('script');
      script.async = true;
      script.src = source;
      document.body.appendChild(script);
    })
  }

  render() {
    return (<>
      <p>This will be a Spotify Web Player!!</p>
    </>)
  }
}

export default withCookies(Spotify);