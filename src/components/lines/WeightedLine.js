import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './WeightedLine.css';

/**
 * A simple line
 * 
 * @class WeightedLine
 * @extends {Component}
 */
class WeightedLine extends LineBase {
  /**
   * @param {number[]} points 
   * @param {number} current 
   * @returns {React.ReactElement}
   * 
   * @memberof WeightedLine
   */
  createLine(points, current) {
    let chunkWidth = 2;
    let newPoints = points
      .map((item, index) => {
        if (!this.props.showAll) {
          if (index > current) {
            return 0;
          }
        }

        let start = Math.max(index - chunkWidth, 0);
        let end = Math.min(index + chunkWidth + 1, points.length);

        let items = points.slice(start, end);

        let t = 0;
        let c = 0;
        items.forEach((item, index) => {
          let weight =  (chunkWidth + 1) - (Math.abs(chunkWidth - index));
          t += weight;
          c += item * weight;
        });

        return c / t;
      });

    let max = newPoints.reduce((c, m) => {
      return c > m ? c : m;
    }, 0);

    let width = newPoints.length;
    let height = 20;
    let xStep = Math.floor(width / newPoints.length);
    let yStep = Math.floor(height / max);

    let instructions = newPoints.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });

    return (
      <div className="WeightedLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path" d={`M0,${height} ${instructions.join(' ')}`} />
        </svg>
      </div>
    );
  }
}

WeightedLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default WeightedLine;
