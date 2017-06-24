import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../Character';
import {WeightedLine} from './lines';
import Page from './Page';
import './BookLine.css';

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

  componentWillReceiveProps(nextProps) {
    if (nextProps.character === this.props.character) {
      return;
    }

    this.setState({
      ...this.state,
      occurences: this.findOccurences(nextProps.pages, nextProps.character)
    });
  }

  render() {
    let occ = this.state.occurences;
    let curr = this.props.current;

    let props = {
      points: occ,
      current: curr,
      progress: this.props.progress,
      showAll: this.state.showAll
    };

    // Choose which type of line to use
    let line = <WeightedLine {...props} />;
    // switch (this.state.type) {
    //   case 'basic':
    //     line = <BasicLine {...props} />;
    //     break;
    //   case 'weighted':
    //     line = <WeightedLine {...props} />;
    //     break;
    //   case 'number':
    //     line = <NumberLine {...props} />;
    //     break;
    //   case 'chunked':
    //     line = <ChunkedLine {...props} chunk={3} />;
    //     break;
    //   case 'diverging':
    //     line = <DivergingLine {...props} />;
    //     break;
    //   default:
    //     throw 'invalid line type';
    // }

    return (
      <div className="BookLine">
        {/* Line type selection */}
        {/*<div>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              type: 'weighted'
            })} >Weighted </button>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              type: 'basic'
            })} >Basic</button>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              type: 'number'
            })} >Number</button>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              type: 'chunked'
            })} >Chunked</button>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              type: 'diverging'
            })} >Diverging</button>
          <button 
            onClick={()=>this.setState({
              ...this.state,
              showAll: !this.state.showAll
            })} >Toggle Show All</button>
        </div>*/}
        {line}
      </div>
    );
  }

}

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(Page)).isRequired,
  character: PropTypes.instanceOf(Character).isRequired,
  progress: PropTypes.number.isRequired,
  current: PropTypes.number
};

export default BookLine;
