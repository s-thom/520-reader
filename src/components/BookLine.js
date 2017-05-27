import React, { Component } from 'react';
import PropTypes from 'prop-types';

import {paginate} from '../util';
import {WeightedLine, BasicLine, NumberLine, ChunkedLine} from './lines';
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
      occurences: this.findOccurences(props.text, props.character),
      type: 'number'
    };
  } 

  render() {
    let occ = this.state.occurences;
    let curr = this.props.current;

    let line;
    switch (this.state.type) {
      case 'basic':
        line = <BasicLine points={occ} current={curr} />;
        break;
      case 'weighted':
        line = <WeightedLine points={occ} current={curr} />;
        break;
      case 'number':
        line = <NumberLine points={occ} current={curr} />;
        break;
      case 'chunked':
        line = <ChunkedLine points={occ} current={curr} chunk={3} />;
        break;
      default:
        throw 'invalid line type';
    }

    return (
      <div className="BookLine">
        <div>
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
        </div>
        {line}
      </div>
    );
  }

  findOccurences(text, character) {
    return paginate(this.props.text)
      .map(t => t.match(new RegExp(character, 'ig')))
      .map((match) => {
        if (match) {
          return match.length;
        } else {
          return 0;
        }
      });
  }

  
}

BookLine.defaultProps = {
  progress: 0
};

BookLine.propTypes = {
  text: PropTypes.string.isRequired,
  character: PropTypes.string.isRequired,
  progress: PropTypes.number,
  current: PropTypes.number
};

export default BookLine;
