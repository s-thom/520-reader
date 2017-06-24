import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import {WeightedLine} from './lines';
import './BookLine.css';

/**
 * Component to display the occurence of a name throughout the text
 * 
 * @class BookLine
 * @extends {Component}
 */
class BookLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false
    };
  }

  render() {
    let lines = this.props.characters
      .map((char, index) => {
        // Don't add lines for placeholder indicies
        if (!char) {
          return null;
        }

        let props = {
          key: `line-${index}`,
          pages: this.props.pages,
          character: char,
          current: this.props.current,
          progress: this.props.progress,
          showAll: this.state.showAll
        };

        // line-item-${index} determines the colour of the line
        let containerClass = [
          'line-item',
          `line-item-${index}`
        ].join(' ');

        return (
          <div
            className={containerClass}>
            <WeightedLine {...props} />
          </div>
        );
      });

    return (
      <div className="BookLine">
        {lines}
      </div>
    );
  }

  
}

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  progress: PropTypes.number.isRequired,
  current: PropTypes.number
};

export default BookLine;
