import React, { Component } from 'react';
import './Paragraph.css';

class Paragraph extends Component {
  render() {
    // TODO: Do name substitution?
    return (
      <p className="Paragraph">
        {this.props.text}
      </p>
    );
  }
}

export default Paragraph;
