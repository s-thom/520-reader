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
   * @returns {React.ReactElement}
   * 
   * @memberof ChunkedLine
   */
  createLine(points, current) {
    // Get averages for each section
    let chunkSize = this.props.chunk;

    let chunks = [];
    for (let i = 0; i < points.length; i += chunkSize) {
      chunks.push(points.slice(i, i + chunkSize));
    }

    let newPoints = chunks
      .map(c => Math.floor(average(c)));

    let max = newPoints.reduce((c, m) => {
      return c > m ? c : m;
    }, 0);

    let width = newPoints.length;
    let height = 20 * (newPoints.length / points.length);
    let xStep = Math.floor(width / newPoints.length);
    let yStep = Math.floor(height / max);

    let svgParts = newPoints.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });

    let path = `M0,${height} ${svgParts.join(' ')}`;

    return (
      <div className="ChunkedLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path" d={path} />
        </svg>
      </div>
    );
  }
}

ChunkedLine.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired,
  chunk: PropTypes.number.isRequired
};

export default ChunkedLine;
