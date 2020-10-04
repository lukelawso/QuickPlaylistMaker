import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Route, Link } from "react-router-dom";

import Entry from './components/entry.js';
import Main from './components/main.js';



class App extends Component {
  constructor(props) {
    super(props);
    this.state = {playlists: [], token: null}; 
    this.access_token = null;
  }

  render() {
    return (
      <Router>
        <Route path="/" exact component={Entry}/>  
        <Route path="/main" exact component={Main} />  
      </Router>
      
    );
  }
}


export default App;
