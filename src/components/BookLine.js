import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import './BookLine.css';

import {dimensions} from '../util';


function Line({
  points,
  progress,
  height,
  xStep,
  yStep
}) {
  let progressX = progress * xStep;

  // Map points to SVG path instructions
  let seenPages = points.slice(0, progress + 1);
  let instructions = seenPages.map((point, index) => {
    return `L${index * xStep},${height - (point * yStep)}`;
  });
  let seenInstructions = `M0,${height} ${instructions.join(' ')} L${progressX},${height}`;


  return  <path className="svg-path" d={seenInstructions} />;
}

Line.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number),
  progress: PropTypes.number,
  height: PropTypes.number,
  xStep: PropTypes.number,
  yStep: PropTypes.number,
};

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
      showAll: false,
      flip: false
    };

    // Holds the list of points used by a character
    this.occurences = new Map();
    this.componentWillReceiveProps(props);
  }

  componentWillReceiveProps(nextProps) {
    nextProps.characters.forEach((char) => {
      if (!char) {
        return;
      }

      if (!this.occurences.has(char)) {
        this.occurences.set(char, this.findOccurences(nextProps.pages, char));
      }
    });
  }

  render() {
    let max = this.findMaximum(
      this.props.progress, 
      // Only find maximum of viewed pages
      Array.from(this.occurences.values()).slice(0, this.props.progress)
    );

    let charCount = 0;
    let lines = this.props.characters
      .map((char, index) => {
        // Don't add lines for placeholder indicies
        if (!char) {
          return null;
        }

        charCount++;
        // If flipping second line, don't add more than two
        if (this.state.flip && charCount > 2) {
          return null;
        }

        // line-item-${index} determines the colour of the line
        let containerClasses = [
          'line-item',
          `line-item-${index}`
        ];
        if (this.state.flip) {
          containerClasses.push('flipped');
        }

        let containerClass = containerClasses.join(' ');

        return (
          <div
            className={containerClass}
            key={`line-${char.name}`}>
            {/* Create the book line for this character */}
            {this.createLine(this.occurences.get(char), this.props.current, this.props.progress, max)}
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
    let occurences = pages
      .map(p => p.props.text)
      .map((text) => {
        return character.numberOfOccurrences(text);
      });

    return this.smoothPoints(occurences);
  }

  /**
   * Finds the maximum ion a point array
   * 
   * @param {number} progress Highest page that has been read
   * @param {number[][]} pointses List of lisrs of points
   * @returns 
   * @memberof BookLine
   */
  findMaximum(progress, pointses) {
    // For each character
    return pointses.reduce((max, points) => {
      let curr = points
        .map((p,i) => (i < progress ? p : 0)) // Ignore pages that haven't been read
        .reduce((c, m) => {
          return Math.max(c, m);
        }, 0);

      return Math.max(curr, max);
    }, 0);
  }

  createLine(points, current, progress, max) {
    // Set dimensions for the line
    let width = dimensions.x;
    let height = dimensions.y / 10;
    let xStep = width / points.length;
    let yStep = height / max;

    let currentX = current * xStep;
    let progressX = progress * xStep;

    // Map points to SVG path instructions
    let seenPages = points.slice(0, progress + 1);
    let instructions = seenPages.map((point, index) => {
      return `L${index * xStep},${height - (point * yStep)}`;
    });
    let seenInstructions = `M0,${height} ${instructions.join(' ')} L${progressX},${height}`;

    return (
      <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
        <path className="svg-path-fade" d={`M${progressX},${height} L${width},${height}`} />
        <path className="svg-path" d={seenInstructions} />
        <rect className="svg-here-line" x={currentX} y={0} width="1" height={height} />
      </svg>
    );
  }

  /**
   * 
   * 
   * @param {number[]} points 
   * @param {number} progress 
   * @returns {number[]}
   * @memberof BookLine
   */
  smoothPoints(points) {
    let chunkWidth = Math.max(Math.floor(points.length / 100), 1);

    return points
      .map((item, index) => {
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
