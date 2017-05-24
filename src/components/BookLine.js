import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {paginate} from '../util';
import {NumberLine} from './lines';
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
      occurences: this.findOccurences(props.text, props.character)
    };
  } 

  render() {
    let occ = this.state.occurences;
    let curr = this.props.current;

    return (
      <div className="BookLine">
        <NumberLine points={occ} current={curr} />
      </div>
    );
  }

  findOccurences(text, character) {
    return paginate(this.props.text)
      .map(t => t.match(new RegExp(character, 'ig')))
      .map((match) => {
        if (match) {
          return match.length;
        } else {
          return 0;
        }
      });
  }
}

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  text: PropTypes.string.isRequired,
  character: PropTypes.string.isRequired,
  progress: PropTypes.number,
  current: PropTypes.number
};

export default BookLine;
