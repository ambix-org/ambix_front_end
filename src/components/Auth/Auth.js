import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

class Authenticate extends Component {

  componentDidMount() {
    if (!this.props.refreshToken) {
      const urlParams = new URLSearchParams(window.location.search);
      const refreshToken = urlParams.get('refresh');
      if (refreshToken !== null) {
        localStorage.setItem('refresh', refreshToken);
        this.props.isAuthorized(refreshToken);
      }
    }
  }

  render() {
    return (<>
    { this.props.refreshToken ? 
        <Redirect to='/' />
      :
        <button onClick={this.authorize}>Sign-In</button>
    }
    </>);
  }
}

export default Authenticate;
