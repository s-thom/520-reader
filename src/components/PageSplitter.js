import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paragraph from './Paragraph';
import './Page.css';
import {punctuationSplit} from '../util';

const maxLength = 5000;

/**
 * Component that displays a page of a book
 * 
 * @class PageSplitter
 * @extends {Component}
 */
class PageSplitter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      items: punctuationSplit(this.props.text.substring(0, 2000)),
      count: 0,
      prevString: '',
      currentString: '',
      fullString: this.props.text
    };

    this.page = null;
  }
  
  componentDidMount() {
    // Limit to 200 characters. May have to increase for larget tablets
    // This just reduces the load on the component
    this.items = punctuationSplit(this.props.text.substring(0, 2000));

    this.setState({
      ...this.state,
      currentString: this.items[0]
    });
  }

  componentWillReceiveProps(newProps) {
    // Limit to 200 characters. May have to increase for larget tablets
    // This just reduces the load on the component
    this.setState({
      items: punctuationSplit(newProps.text.substring(0, 2000)),
      count: 0,
      prevString: '',
      currentString: '',
      fullString: newProps.text
    });
  }

  componentDidUpdate() {
    // Finish this split if:
    //   The page has all items, or
    //   the page has rendered larger than the container (i.e. there's a scrollbar)
    if (this.state.count === this.items.length) {
      this.doFinish(this.state.prevString);
      return;
    }
    if (this.page.scrollHeight > this.page.clientHeight) {
      this.doFinish(this.state.prevString);
      return;
    }

    let newCount = this.state.count + 1;
    // console.log(`nc: ${newCount} -- ${this.items.slice(0, newCount).join('')}`);

    this.setState({
      count: newCount,
      prevString: this.state.currentString,
      currentString: this.state.items.slice(0, newCount).join('')
    });
  }

  doFinish(text) {
    setImmediate(() => {
      this.props.onfinish(text);
    });
  }

  render() {
    let paragraphs = this.state.currentString
      .split(/\r?\n\r?\n/)
      .map((para, i) => {
        let id = `${this.props.identifier}-${i}`;

        return <Paragraph 
          text={para} 
          identifier={id}
          key={id} 
          />;
      });

    return (
      <div className="Page" ref={(c)=>{this.page = c;}}>
        <div className="paragraph-container">
          {paragraphs}
        </div>
      </div>
    );
  }
}

PageSplitter.propTypes = {
  text: PropTypes.string.isRequired,
  identifier: PropTypes.number.isRequired,
  onfinish: PropTypes.func.isRequired
};

export default PageSplitter;
