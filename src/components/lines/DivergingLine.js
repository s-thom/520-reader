import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './DivergingLine.css';

/**
 * A simple line
 * 
 * @class DivergingLine
 * @extends {Component}
 */
class DivergingLine extends LineBase {
  /**
   * @param {number[]} points 
   * @param {number} current 
   * @param {number} progress 
   * @returns {React.ReactElement}
   * 
   * @memberof DivergingLine
   */
  createLine(points, current, progress) {
    let chunkWidth = Math.floor(points.length / 100);
    let newPoints = points
      .map((item, index) => {
        if (!this.props.showAll) {
          if (index > progress) {
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
    let height = 10;
    let xStep = Math.floor(width / newPoints.length);
    let yStep = Math.floor(height / max);

    let instructions = newPoints.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });

    let reverseInstructions = newPoints.map((point, index) => {
      return `L${index * xStep},${height + (point * yStep)}`;
    })
      .reverse();

    let rx = current * xStep;
    let ry = 0;

    let data = `M0,${height} ${instructions.join(' ')} ${reverseInstructions.join(' ')} L0,${height}`;

    return (
      <div className="DivergingLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height * 2}`}>
          <path className="svg-path" d={data} />
          <rect className="svg-here-line" x={rx} y={ry} width="1" height={height * 2} />
        </svg>
      </div>
    );
  }
}

DivergingLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default DivergingLine;
