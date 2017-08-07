import React, { Component } from 'react';

import {Reader} from './components';
import Character from './Character';
import {request} from './util';
import {event, setUser} from './track';
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
      userId: -1,
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
    
    this.userInput = null;

    this.su = this.setUser.bind(this);
  }

  setUser() {
    let user = parseInt(this.userInput.value);

    if (!user) {
      return;
    }

    setUser(user);

    this.setState({
      ...this.state,
      userId: user
    });
  }

  render() {
    let el;
    let isUserSet = this.state.userId !== -1;

    if (!isUserSet) {
      let setUser = (
        <div className="App-ready-box">
          <p>Thank you for participating in this study. You will have received an anonymous participant ID from the study supervisor. Please enter it in the box below.</p>
          <p>
            <input
              className="App-ready-pid"
              type="text"
              placeholder="Participant ID"
              ref={e => this.userInput = e}
            />
          </p>
          <p>When you're ready to start reading, click the button below.There will be a short delay as the eBook reader starts up. Read at your own pace. </p>
          <button className="App-ready-button" onClick={this.su}>Get Started</button>
        </div>
      );

      el = (
        <div className="App-ready-modal">
          <h1>Through the Looking Glass</h1>
          <h2>and What Alice Found There</h2>
          <h3>Lewis Carroll</h3>
          {setUser}
          <p>Text from <a href="http://www.gutenberg.org/1/12/">Project Guttenberg</a></p>
        </div>
      );
    } else if (!(this.state.text && this.state.characters)) {
      el = (
        <div>
          <h2>Downloading the book</h2>
          <p>This won't take long</p>
        </div>
      );
    } else {
      el = <div className="App-reader-container"><Reader {...this.state} /></div>;
    }

    return (
      <div className="App" ref={e => this.root = e}>
        {el}
      </div>
    );
  }
}

export default App;
