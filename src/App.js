import React, { Component } from 'react';
import { HashRouter } from 'react-router-dom';
import Layouts from './layouts'
import './App.css';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Layouts />
      </HashRouter>
    );
  }
}

export default App;
