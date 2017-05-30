import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import {average} from '../../util';
import './ChunkedLine.css';

/**
 * A simple line
 * 
 * @class ChunkedLine
 * @extends {Component}
 */
class ChunkedLine extends LineBase {
  /**
   * @param {number[]} points 
   * @param {number} current 
   * @param {number} progress 
   * @returns {React.ReactElement}
   * 
   * @memberof ChunkedLine
   */
  createLine(points, current, progress) {
    // Get averages for each section
    let chunkSize = this.props.chunk;

    let chunks = [];
    for (let i = 0; i < points.length; i += chunkSize) {
      if (!this.props.showAll) {
        if (i > progress) {
          chunks.push([0]);
          continue;
        }
      }

      chunks.push(points.slice(i, i + chunkSize));
    }

    let newPoints = chunks
      .map(c => Math.floor(average(c)));

    let max = newPoints.reduce((c, m) => {
      return c > m ? c : m;
    }, 0);

    let width = points.length;
    let height = 20;
    let xStep = Math.floor((width / points.length) * chunkSize);
    let yStep = Math.floor(height / max);

    let svgParts = newPoints.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });

    let path = `M0,${height} ${svgParts.join(' ')}`;

    let cx = Math.floor(current * (newPoints.length / points.length)) * xStep;
    let cy = height - (newPoints[Math.floor(current * (newPoints.length / points.length))] * yStep);

    return (
      <div className="ChunkedLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path" d={path} />
          <circle className="svg-here" cx={cx} cy={cy} r="2" />
        </svg>
      </div>
    );
  }
}

ChunkedLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  chunk: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default ChunkedLine;
