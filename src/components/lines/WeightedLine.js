import React from 'react';
import PropTypes from 'prop-types';

import LineBase from './LineBase';
import './WeightedLine.css';

import {dimensions} from '../../util';

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
   * @param {number} progress 
   * @returns {React.ReactElement}
   * 
   * @memberof WeightedLine
   */
  createLine(points, current, progress) {
    let chunkWidth = Math.max(Math.floor(points.length / 100), 1);
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

    let width = dimensions.x;
    let height = dimensions.y / 10;
    let xStep = width / newPoints.length;
    let yStep = height / max;

    let currentX = current * xStep;
    let progressX = progress * xStep;

    let seenPages = newPoints.slice(0, progress + 1);
    let instructions = seenPages.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });
    let seenInstructions = `M0,${height} ${instructions.join(' ')} L${progressX},${height}`;


    return (
      <div className="WeightedLine">
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path-fade" d={`M${progressX},${height} L${width},${height}`} />
          <path className="svg-path" d={seenInstructions} />
          <rect className="svg-here-line" x={currentX} y={0} width="1" height={height} />
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
