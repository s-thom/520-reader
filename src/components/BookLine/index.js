import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../../Character';
import PageInfo from '../../PageInfo';
import './index.css';


function Line({
  points,
  progress,
  height,
  xStep,
  yStep,
  color
}) {
  let progressX = (progress + 1) * xStep;

  // Map points to SVG path instructions
  let seenPages = points.slice(0, progress + 1);
  let instructions = seenPages.map((point, index) => {
    return `L${(index + 1) * xStep},${height - (point * yStep)}`;
  });
  let seenInstructions = `M0,${height} ${instructions.join(' ')} L${progressX},${height}`;

  let styles = {
    fill: color || '#4CB3F7',
  };

  return  <path className="svg-path" d={seenInstructions} style={styles} />;
}

Line.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number),
  progress: PropTypes.number,
  height: PropTypes.number,
  xStep: PropTypes.number,
  yStep: PropTypes.number,
  color: PropTypes.string,
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
    this.line = null;

    this.oc = this.onClick.bind(this);
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

  onClick(event) {
    if (!this.line) {
      console.log('line in bad state for nav');
      return;
    }

    let position = event.nativeEvent.offsetX;
    let page = Math.floor(this.props.pages.length * (position / this.line.clientWidth));

    this.props.onPageSelect(page);
  }

  render() {
    let {
      characters,
      current,
      progress,
      pages,
    } = this.props;
    let content;
    if (this.container && characters.filter(a => a).length > 0) {
      let max = this.findMaximum(
        progress,
        // Only find maximum of viewed pages
        characters
          .filter(c => c)
          .map(c => Array.from(this.occurences.get(c)))
          .map(a => a.slice(0, (progress + 1)))
      );

      // Set dimensions for the line
      let width = this.container.clientWidth;
      let height = this.container.clientHeight;
      let xStep = width / pages.length;
      let yStep = height / max;

      let currentX = (current + 1) * xStep;
      let progressX = (progress + 1) * xStep;

      let lineCommonProps = {
        progress,
        height,
        xStep,
        yStep,
      };

      let lines = characters
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
              <Line points={this.occurences.get(char)} color={char.color} {...lineCommonProps} />
            </g>
          );
        });

      content = (
        <svg
          ref={e => this.line = e}
          className="svg-line"
          viewBox={`0 0 ${width} ${height}`}
          height={height}
          onClick={this.oc}
        >
          {lines}
          <path className="svg-path-fade" d={`M${progressX},${height} L${width},${height}`} />
          <rect className="svg-here-line" x={currentX} y={0} width="1" height={height} />
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
      .map(({text}) => {
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
        .map((p,i) => (i <= progress ? p : 0)) // Ignore pages that haven't been read
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
  pages: PropTypes.arrayOf(PropTypes.instanceOf(PageInfo)).isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  onPageSelect: PropTypes.func.isRequired,
};

export default BookLine;
