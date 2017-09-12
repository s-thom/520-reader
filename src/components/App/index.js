import React, { Component } from 'react';
import fscreen from 'fscreen';

import Reader from '../Reader';
import Character from '../../Character';
import {request} from '../../util';
import {event, setUser, getStartupUser} from '../../track';
import './index.css';

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
      requireButton: fscreen.fullscreenEnabled,
      userId: getStartupUser(),
      text: undefined,
      characters: undefined,
      events: undefined,
      idTyping: '',
    };

    // Request needed files
    Promise.all([
      request('/looking-glass.txt'),
      request('/looking-glass.json')
        .then(JSON.parse)
        .then(({characters: cs}) => {
          let characters = cs.map(c => new Character(c['display-name'], c.names, c.image));

          return {
            characters,
          };
        })
    ])
      .then(([text, {characters}]) => {
        event('http-load');
        this.setState({
          ...this.state,
          text,
          characters
        });
      });
    
    this.userInput = null;

    this.su = this.setUser.bind(this);
    this.ot = this.onType.bind(this);
    this.ok = this.onKey.bind(this);
    this.cr = this.continueReading.bind(this);
  }

  /**
   * Sets the user for event tracking
   * 
   * @returns 
   * @memberof App
   */
  setUser() {
    let user = parseInt(this.userInput.value, 10);

    if (!user) {
      return;
    }

    setUser(user);

    this.getStarted(user);
  }

  continueReading() {
    this.getStarted(this.state.userId);
  }

  /**
   * Requests fullscreen and changes state
   * 
   * @param {any} user 
   * @returns 
   * @memberof App
   */
  getStarted(user) {
    const changeMode = () => {
      this.setState({
        ...this.state,
        userId: user,
        requireButton: false,
      });
    };

    if (!fscreen.fullscreenEnabled) {
      console.log('no fs');
      // Fullscreen not allowed, just continue
      changeMode();
      return;
    }
    

    fscreen.onfullscreenchange = () => {
      console.log('fullscreen');
      
      fscreen.onfullscreenchange = null;
      changeMode();
    };
    fscreen.onfullscreenerror = () => {
      console.log('fullscreen error');
      
      fscreen.onfullscreenerror = null;
      changeMode();
    };

    fscreen.requestFullscreen(this.root);
  }

  /**
   * Stores the current value of the ID input in the state
   * 
   * @param {any} event 
   * @memberof App
   */
  onType(event) {
    this.setState({
      ...this.state,
      idTyping: event.target.value,
    });
  }

  onKey({key}) {
    switch (key) {
      case 'Enter':
        this.su();
        break;
    
      default:
        break;
    }
  }

  render() {
    let el;
    let isUserSet = this.state.userId !== -1;
    let buttonAttr = {
      disabled: !parseInt(this.state.idTyping, 10),
    };
    let appClass = 'App';

    if (!isUserSet) {
      let setUser = (
        <div className="App-ready-box">
          <p>Thank you for participating in this study. Please enter your participant ID. You'll only have to do this once.</p>
          <p>
            <input
              tabIndex={1}
              className="App-ready-pid"
              type="text"
              placeholder="Participant ID"
              onKeyPress={this.ok}
              onChange={this.ot}
              value={this.state.idTyping}
              ref={e => this.userInput = e}
            />
          </p>
          <button className="App-ready-button" onClick={this.su} {...buttonAttr}>Get Started</button>
        </div>
      );

      el = (
        <div className="App-ready-modal">
          {setUser}
          <h1>Through the Looking Glass</h1>
          <h2>and What Alice Found There</h2>
          <h3>Lewis Carroll</h3>
          <p>Text from <a href="http://www.gutenberg.org/1/12/">Project Gutenberg</a></p>
        </div>
      );
    } else if (this.state.requireButton) {
      el = (
        <div className="App-ready-modal">
          <div className="App-ready-box">
            <p>Welcome back, Participant {this.state.userId}. Thank you for participating in this study.</p>
            <button className="App-ready-button" onClick={this.cr}>Continue Reading</button>
          </div>
          <h1>Through the Looking Glass</h1>
          <h2>and What Alice Found There</h2>
          <h3>Lewis Carroll</h3>
          <p>Text from <a href="http://www.gutenberg.org/1/12/">Project Gutenberg</a></p>
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
      appClass += ' reader-active';
      el = <div className="App-reader-container"><Reader {...this.state} /></div>;
    }

    return (
      <div className={appClass} ref={e => this.root = e}>
        {el}
      </div>
    );
  }
}

export default App;
