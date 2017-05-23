import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Base component of a bookline
 * 
 * @class LineBase
 * @extends {Component}
 */
class LineBase extends Component {
  render() {
    return (
      <p className="LineBase">
        Component does not override LineBase's render() function
      </p>
    );
  }
}

LineBase.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default LineBase;
