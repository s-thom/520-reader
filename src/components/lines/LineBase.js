import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../../Character';
import './LineBase.css';

/**
 * Base component of a bookline
 * 
 * @class LineBase
 * @extends {Component}
 */
class LineBase extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      points: this.findOccurences(props.pages, props.character)
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.character === this.props.character) {
      return;
    }

    this.setState({
      ...this.state,
      points: this.findOccurences(nextProps.pages, nextProps.character)
    });
  }

  render() {
    return (
      <div className="BookLineContent">
        {this.createLine(this.state.points, this.props.current, this.props.progress)}
      </div>
    );
  }


  /**
   * Creates a line
   * Should be overridden for all subclasses
   * 
   * @param {number[]} points Array of points to show 
   * @param {number} current Current index
   * @param {number} progress Highest page the user has visited
   * @returns {React.ReactElement} SVG (hopefully) of a line to display
   *
   * @memberof LineBase
   */
  createLine(points, current, progress) {
    return (
      <p>
        Component does not override LineBase's createLine(points) function.
      </p>
    );
  }

  /**
   * Finds the number of times a characxter appears in each page
   * 
   * @param {Page[]} pages Pages to search through
   * @param {Character} character Character to find
   * @returns 
   * @memberof LineBase
   */
  findOccurences(pages, character) {
    return pages
      .map(p => p.props.text)
      .map((text) => {
        return character.numberOfOccurrences(text);
      });
  }
}

LineBase.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.element).isRequired,
  character: PropTypes.instanceOf(Character).isRequired,
  current: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  showAll: PropTypes.bool
};

export default LineBase;
