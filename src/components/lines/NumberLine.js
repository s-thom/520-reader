import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './NumberLine.css';

/**
 * A simple line
 * 
 * @class NumberLine
 * @extends {Component}
 */
class NumberLine extends LineBase {
  createLine(points, current) {
    let left = points.slice(0, current);
    let curr = points[current];
    let right = points.slice(current + 1);

    return (
      <p className="NumberLine">
        <span className="left">{left.join(' ')}</span>
        <span className="middle">{curr}</span>
        <span className="right">{right.join(' ')}</span>
      </p>
    );
  }
}

NumberLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired
};

export default NumberLine;
