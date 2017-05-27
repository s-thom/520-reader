import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './NumberLine.css';

/**
 * A simple line
 * 
 * @class NumberLine
 * @extends {LineBase}
 */
class NumberLine extends LineBase {
  /**
   * @param {number[]} points 
   * @param {number} current 
   * @returns {React.ReactElement}
   * 
   * @memberof NumberLine
   */
  createLine(points, current) {
    let left = points
      .slice(0, current)
      .map((n, i) => <span key={i}>{n} </span>);
    let curr = points[current];
    let right = points
      .slice(current + 1);

    if (!this.props.showAll) {
      // @ts-ignore
      right = right.map(n => '?');
    }
    
    // @ts-ignore
    right = right.map((n, i, a) => <span key={points.length - (a.length - i)}> {n}</span>);
    
    return (
      <p className="NumberLine">
        <span className="left">{left}</span>
        <span className="middle">{curr}</span>
        <span className="right">{right}</span>
      </p>
    );
  }
}

NumberLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default NumberLine;
