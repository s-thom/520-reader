import React, { Component } from 'react';

import {Reader, Loading} from './components';
import Character from './Character';
import {request} from './util';
import {event} from './track';
import './App.css';

/**
 * Root component
 * Contains the entire application
 * 
 * @class App
 * @extends {Component}
 */
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: undefined,
      characters: undefined,
    };

    Promise.all([
      request('/looking-glass.txt'),
      request('/characters.json')
        .then(JSON.parse)
        .then((cs) => {
          return cs.map(c => new Character(c['display-name'], c.names, c.image));
        })
    ])
      .then(([text, characters]) => {
        event('http-load');
        this.setState({
          ...this.state,
          text,
          characters
        });
      });
  }

  render() {
    return (
      <div className="App">
        {/* Show a loading component until the text has loaded */}
        {this.state.text ? <Reader {...this.state} /> : <Loading />}
      </div>
    );
  }
}

export default App;
