import React, { Component } from 'react';

import {request} from './util';

import {Page, Loading} from './components';

import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();

    this.state = {
      fullText: undefined
    };

    request('/looking-glass.txt')
      .then((body) => {
        this.setState({
          fullText: body
        });
      });
  }

  render() {
    return (
      <div className="App">
        {this.state.fullText ? <Page text={this.state.fullText} identifier={'temp'} /> : <Loading />}
      </div>
    );
  }
}

export default App;
