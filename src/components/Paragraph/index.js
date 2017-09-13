import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../../Character';
import {createExpression, characterFromName} from '../../util';
import './index.css';

/**
 * Component that displays a paragraph of text
 * 
 * @class Paragraph
 * @extends {Component}
 */
class Paragraph extends Component {
  render() {
    let elements = this.props.fragments
      .map((text, i) => {
        let items = [];
        if (this.props.characters.length) {
          // Create <span>s around character names
          items = this.characterSplit(text, this.props.identifier + i);
        } else {
          // Just put the text if there's no characters to highlight
          // Saves computation
          items.push(<span key={this.props.identifier + i}>{text}</span>);
        }

        if (text.match(/\n$/)) {
          items.push(<br key={`br-${i}`} />);
        }

        return <span key={this.props.identifier + i}>{items}</span>;
      });

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

      let styles = {
        background: 'transparent',
          backgroundColor: char.color || '#2b2b2b',

      };

      items.push(
        <span 
          key={`${index}-${items.length}`}
          className={paraClass} 
          onClick={(e)=>this.props.oncharclick(char, e.shiftKey)}
          style={styles}  
          data-bg={char.color || '#2b2b2b'}
        >
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
  fragments: PropTypes.arrayOf(PropTypes.string).isRequired,
  identifier: PropTypes.any.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  oncharclick: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default Paragraph;
