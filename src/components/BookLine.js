import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
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
    let max = this.findMaximum(this.props.progress, Array.from(this.occurences.values()));
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
            className={containerClass}
            key={`line-${char.name}`}>
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
    return pages
      .map(p => p.props.text)
      .map((text) => {
        return character.numberOfOccurrences(text);
      });
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
    let r= pointses.reduce((max, points) => {
      let curr = points
        .map((p,i) => (i < progress ? p : 0))
        .reduce((c, m) => {
          return c > m ? c : m;
        }, 0);

      return curr > max ? curr : max;
    }, 0);

    return r;
  }

  createLine(points, current, progress, max) {
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
      console.log(point);
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
