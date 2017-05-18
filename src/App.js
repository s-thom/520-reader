import React, { Component } from 'react';

import {request} from './util';

import {Paginator, Loading} from './components';

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
        {this.state.fullText ? <Paginator text={this.state.fullText} /> : <Loading />}
      </div>
    );
  }
}

export default App;
