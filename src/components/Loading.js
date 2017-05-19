import React, { Component } from 'react';
import './Loading.css';

/**
 * Component to display before the interface is interactable
 * 
 * @class Loading
 * @extends {Component}
 */
class Loading extends Component {
  render() {
    return (
      <p className="Loading">
        Loading
      </p>
    );
  }
}

export default Loading;
