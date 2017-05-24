import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * Base component of a bookline
 * 
 * @class LineBase
 * @extends {Component}
 */
class LineBase extends Component {
  render() {
    return (
      <div className="BookLineContent">
        {this.createLine(this.props.points, this.props.current)}
      </div>
    );
  }


  /**
   * Creates a line
   * Should be overridden for all subclasses
   * 
   * @param {number[]} points Array of points to show 
   * @param {number} current Current index
   * @returns {React.Component} SVG (hopefully) of a line to display
   * 
   * @memberof LineBase
   */
  createLine(points, current) {
    return (
      <p>
        Component does not override LineBase's createLine(points) function
      </p>
    );
  }
}

LineBase.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired,
  current: PropTypes.number.isRequired
};

export default LineBase;
