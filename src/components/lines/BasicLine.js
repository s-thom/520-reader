import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';

/**
 * A simple line
 * 
 * @class BasicLine
 * @extends {Component}
 */
class BasicLine extends LineBase {
  createLine(points) {
    // TODO: Give a line
  }
}

BasicLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default BasicLine;
