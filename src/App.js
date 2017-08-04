import React, { Component } from 'react';

import {Reader, Loading} from './components';
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
      let userClass = isUserSet ? 'App-ready-success' : 'App-ready-fail';

      let setUser = (
        <div className={userClass}>
          <input type="text" placeholder="Participant ID" ref={e => this.userInput = e}/>
          <button onClick={this.su}>Set Participant ID</button>
        </div>
      );

      el = (
        <div className="App-ready-modal">
          {setUser}
        </div>
      );
    } else if (!(this.state.text && this.state.characters)) {
      el = <Loading />;
    } else {
      el = <Reader {...this.state} />;
    }

    return (
      <div className="App" ref={e => this.root = e}>
        {el}
      </div>
    );
  }
}

export default App;
