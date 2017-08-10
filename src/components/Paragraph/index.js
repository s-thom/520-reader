import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import {createExpression, characterFromName} from '../util';
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
        let items = this.characterSplit(line, i);
        elements = [...elements, ...items];
      } else {
        elements.push(line);
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

  /**
   * 
   * 
   * @param {string} text 
   * @param {number} index
   * @returns {React.Element[]}
   * @memberof Paragraph
   */
  characterSplit(text, index) {
    let exp = createExpression(this.props.characters);

    let match;
    let prevLast = 0;
    let items = [];

    let nameMatcher = c => c && c.isCalled(match[0]);
    
    // eslint-disable-next-line no-cond-assign
    while ((match = exp.exec(text)) !== null) {
      // Add string section
      let prev = text.slice(prevLast, match.index);
      items.push(<span key={`${index}-text-${items.length}`}>{prev}</span>);

      // Add character
      let char = characterFromName(match[0], this.props.characters);
      let selectedIndex = this.props.selected.findIndex(nameMatcher);

      let paraClass = `para-char${selectedIndex > -1 ? ` selected selected-${selectedIndex}` : ''}`;

      items.push(
        <span 
          key={`${index}-${items.length}`}
          className={paraClass} 
          onClick={(e)=>this.props.oncharclick(char, e.shiftKey)}>
          {match[0]}
        </span>
      );

      prevLast = exp.lastIndex;
    }

    // Add string section
    let prev = text.slice(prevLast);
    items.push(<span key={`${index}-final-${items.length}`}>{prev}</span>);

    return items;
  }
}

Paragraph.propTypes = {
  text: PropTypes.string.isRequired,
  identifier: PropTypes.any.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  oncharclick: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default Paragraph;
