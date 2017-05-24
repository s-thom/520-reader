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
      <div className="LineBase">
        {this.createLine(this.props.points)}
      </div>
    );
  }


  /**
   * Creates a line
   * Should be overridden for all subclasses
   * 
   * @param {number[]} points 
   * @returns {React.Component} SVG (hopefully) of a line to display
   * 
   * @memberof LineBase
   */
  createLine(points) {
    return (
      <p>
        Component does not override LineBase's createLine(points) function
      </p>
    );
  }
}

LineBase.propTypes = {
  points: PropTypes.arrayOf(PropTypes.number).isRequired
};

export default LineBase;
