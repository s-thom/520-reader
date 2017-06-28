import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import './Paragraph.css';

/**
 * Component that displays a paragraph of text
 * 
 * @class Paragraph
 * @extends {Component}
 */
class Paragraph extends Component {
  render() {
    // TODO: Do name substitution?
    let lines = this.props.text.split(/\r?\n/);
    let elements = [];

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      if (this.props.characters.length) {
      } else {
      }

      if (i < (lines.length - 1)) {
        elements.push(<br key={`br-${i}`} />);
      }
    }

    return (
      <p className="Paragraph">
        {elements}
      </p>
    );
  }
}

Paragraph.propTypes = {
  text: PropTypes.string.isRequired,
  identifier: PropTypes.any.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired
};

export default Paragraph;
