import React, { Component } from 'react';
import './Paragraph.css';

class Paragraph extends Component {
  render() {
    // TODO: Do name substitution?
    let lines = this.props.text.split(/\r?\n/);
    let elements = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      elements.push(`${line} `);
      if (i < (lines.length - 1)) {
        elements.push(<br />);
      }
    }

    return (
      <p className="Paragraph">
        {elements}
      </p>
    );
  }
}

export default Paragraph;
