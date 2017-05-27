import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './BasicLine.css';

/**
 * A simple line
 * 
 * @class BasicLine
 * @extends {Component}
 */
class BasicLine extends LineBase {
  /**
   * @param {number[]} points 
   * @param {number} current 
   * @param {number} progress 
   * @returns {React.ReactElement}
   * 
   * @memberof BasicLine
   */
  createLine(points, current, progress) {
    let max = points.reduce((c, m) => {
      return c > m ? c : m;
    });

    let width = points.length;
    let height = 20;
    let xStep = Math.floor(width / points.length);
    let yStep = Math.floor(height / max);

    let instructions = points.map((point, index) => {
      if (!this.props.showAll) {
        if (index > progress) {
          point = 0;
        }
      }

      return `L${index * xStep},${height - (point * yStep)}`;
    }, 0);


    let cx = current * xStep;
    let cy = height - (points[current] * yStep);

    return (
      <div className="BasicLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path" d={`M0,${height} ${instructions.join(' ')}`} />
          <circle className="svg-path" cx={cx} cy={cy} r="2" />
        </svg>
      </div>
    );
  }
}

BasicLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default BasicLine;
