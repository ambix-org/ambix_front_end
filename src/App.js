import React, { Component } from 'react';
import { 
  CookiesProvider,
  withCookies, 
} from 'react-cookie';
import { 
  BrowserRouter as Router, 
} from 'react-router-dom';
import superagent from 'superagent';

class App extends Component {
  constructor(props) {
    super(props);

    const accessToken = this.props.cookies.get('accessToken');
    console.log('cookies in constructor?', accessToken)
    this.state = {
      access: '',
      refresh: '',
      redirect: false,
      redirectURL: '',
    }
    this.authorize = this.authorize.bind(this);
    this.redirect = this.redirect.bind(this);
  }

  authorize() {
    superagent.get('http://localhost:4242/authorize')
      .then(response => {
        this.setState({
          redirect: true,
          redirectURL: response.body.redirectURL
        }) 
      })
  }

  redirect() {
    console.log(`Redirecting to ${this.state.redirectURL}`)
    window.location = this.state.redirectURL;
  }

  componentDidMount() {
    const accessToken = this.props.cookies.get('accessToken');
    this.setState({
      accessToken: accessToken,
    })
  }


  render() {
    return (
      <CookiesProvider>
        <Router>
          <div className="App">
            { this.state.redirect ? this.redirect() : false}
            <h1>Ambix</h1>
            <h2>An ambient mixer for Spotify</h2>
            <button onClick={this.authorize}>Sign-In</button>
            { this.state.accessToken ? <p>Got Token</p> : false}
          </div>
        </Router>
      </CookiesProvider>
    );
  }
}

  export default withCookies(App);
