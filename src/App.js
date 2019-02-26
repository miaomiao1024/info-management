import React, { Component } from 'react';
import Layouts from './layouts'
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <Layouts />
        </header>
      </div>
    );
  }
}

export default App;
