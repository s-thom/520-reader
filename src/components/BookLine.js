import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import {WeightedLine} from './lines';
import './BookLine.css';

import {dimensions} from '../util';

/**
 * Component to display the occurence of a name throughout the text
 * 
 * @class BookLine
 * @extends {Component}
 */
class BookLine extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showAll: false
    };
  }

  render() {
    let lines = this.props.characters
      .map((char, index) => {
        // Don't add lines for placeholder indicies
        if (!char) {
          return null;
        }

        let props = {
          key: `line-${index}`,
          pages: this.props.pages,
          character: char,
          current: this.props.current,
          progress: this.props.progress,
          showAll: this.state.showAll
        };

        // line-item-${index} determines the colour of the line
        let containerClass = [
          'line-item',
          `line-item-${index}`
        ].join(' ');

        return (
          <div
            className={containerClass}>
            <WeightedLine {...props} />
          </div>
        );
      });

    return (
      <div className="BookLine">
        {lines}
      </div>
    );
  }

  findOccurences(pages, character) {
    return pages
      .map(p => p.props.text)
      .map((text) => {
        return character.numberOfOccurrences(text);
      });
  }


  createLine(points, current, progress) {
    let chunkWidth = Math.max(Math.floor(points.length / 100), 1);

    // Create array of smoothed points
    let newPoints = points
      .map((item, index) => {
        // Set unseen pages to 0
        if (!this.state.showAll) {
          if (index > progress) {
            return 0;
          }
        }

        // Set bounds of smoothing for this 
        let start = Math.max(index - chunkWidth, 0);
        let end = Math.min(index + chunkWidth + 1, points.length);

        let items = points.slice(start, end);

        let t = 0;
        let c = 0;
        items.forEach((item, index) => {
          // Gives a higher weight to closer pages
          // e.g. for chunkWidth = 2:
          //     1, 2, 3, 2, 1
          // and for chunkWidth = 3:
          //     1, 2, 3, 4, 3, 2, 1
          let weight =  (chunkWidth + 1) - (Math.abs(chunkWidth - index));
          t += weight;
          c += item * weight;
        });

        return c / t;
      });

    // Find maximum value
    let max = newPoints.reduce((c, m) => {
      return c > m ? c : m;
    }, 0);

    // Set dimensions for the line
    let width = dimensions.x;
    let height = dimensions.y / 10;
    let xStep = width / newPoints.length;
    let yStep = height / max;

    let currentX = current * xStep;
    let progressX = progress * xStep;

    // Map points to SVG path instructions
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

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  progress: PropTypes.number.isRequired,
  current: PropTypes.number
};

export default BookLine;
