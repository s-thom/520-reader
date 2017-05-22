import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './BookLine.css';

/**
 * Component to display the occurence of a name throughout the text
 * 
 * @class BookLine
 * @extends {Component}
 */
class BookLine extends Component {
  render() {
    return (
      <div className="BookLine">
        {/* TODO: Render bookline */}
      </div>
    );
  }
}

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  text: PropTypes.string.isRequired,
  character: PropTypes.string.isRequired,
  progress: PropTypes.number
};

export default BookLine;
