import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';


import Main from './components/main.js';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {playlists: [], token: null}; 
    this.access_token = null;
  }

  render() {
    return (
      <Main>        
      </Main>
      
    );
  }
}


export default App;
