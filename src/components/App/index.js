import React, { Component } from 'react';

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
          let characters = cs.map(c => new Character(c['display-name'], c.names, c.image, c.color));

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

    this.setState({
      ...this.state,
      userId: user
    });
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

  render() {
    let el;
    let isUserSet = this.state.userId !== -1;
    let buttonAttr = {
      disabled: !this.state.idTyping,
    };
    let appClass = `App${isUserSet ? ' reader-active': ''}`;

    if (!isUserSet) {
      let setUser = (
        <div className="App-ready-box">
          <p>Thank you for participating in this study. You will have received an anonymous participant ID from the study supervisor. Please enter it in the box below.</p>
          <p>
            <input
              className="App-ready-pid"
              type="text"
              placeholder="Participant ID"
              onChange={this.ot}
              value={this.state.idTyping}
              ref={e => this.userInput = e}
            />
          </p>
          <p>When you're ready to start reading, click the button below. There will be a short delay as the eBook reader starts up. Read at your own pace. </p>
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
      <div className={appClass} ref={e => this.root = e}>
        {el}
      </div>
    );
  }
}

export default App;
