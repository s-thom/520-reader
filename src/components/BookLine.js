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

    this.container = null;
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
    let content;
    if (this.container && this.props.characters.filter(a => a).length > 0) {
      let max = this.findMaximum(
        this.props.progress,
        // Only find maximum of viewed pages
        Array.from(this.occurences.values()).slice(0, this.props.progress)
      );

      // Set dimensions for the line
      let width = this.container.clientWidth;
      let height = this.container.clientHeight;
      let xStep = width / this.props.pages.length;
      let yStep = height / max;

      let currentX = this.props.current * xStep;
      let progressX = this.props.progress * xStep;

      let lineCommonProps = {
        progress: this.props.progress,
        height,
        xStep,
        yStep,
      };

      let lines = this.props.characters
        .map((char, index) => {
          // Don't add lines for placeholder indicies
          if (!char) {
            return null;
          }

          // line-item-${index} determines the colour of the line
          let containerClass = [
            'line-item',
            `line-item-${index}`
          ].join(' ');

          return (
            <g
              className={containerClass}
              key={`line-${char.name}`}>
              {/* Create the book line for this character */}
              <Line points={this.occurences.get(char)} {...lineCommonProps} />
            </g>
          );
        });

      content = (
        <svg className="svg-line" viewBox={`0 0 ${width} ${height}`}>
          <path className="svg-path-fade" d={`M${progressX},${height} L${width},${height}`} />
          <rect className="svg-here-line" x={currentX} y={0} width="1" height={height} />
          {lines}
        </svg>
      );
    } else {
      content = (
        <p>To view the bookline for a character, select their name in the text or in the list on the right-hand side of the page.</p>
      );
    }

    return (
      <div className="BookLine" ref={e => this.container = e}>
        {content}
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
