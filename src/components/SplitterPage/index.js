import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paragraph from '../Paragraph';
import '../Page/index.css';
import './index.css';
import {punctuationSplit} from '../../util';

const MAX_LENGTH = 5000;

/**
 * Component that determines how much text can be displayed on a page
 * Calls the onfinish callback property with the final text
 * 
 * @class PageSplitter
 * @extends {Component}
 */
class PageSplitter extends Component {
  constructor(props) {
    super(props);

    this.state = PageSplitter.createNewState(this.props.text);

    this.page = null;
  }

  /**
   * Creates a blank state to start working from
   * 
   * @static
   * @param {string} text 
   * @returns 
   * @memberof PageSplitter
   */
  static createNewState(text) {
    let items = punctuationSplit(text.substring(0, MAX_LENGTH));

    return {
      items,
      count: 0,
      prevItems: [],
      currentItems: [],
    };
  }
  
  /**
   * Run when the component initially mounts.
   * Component now has a reference to its container, so can check sizes
   * 
   * @memberof PageSplitter
   */
  componentDidMount() {
    // Limit to 200 characters. May have to increase for larget tablets
    // This just reduces the load on the component
    this.setState({
      ...this.state,
      count: 0,
      currentItems: [this.state.items[0]]
    });
  }

  componentWillReceiveProps(newProps) {
    // Empty text means empty page. No need to waste time rendering it
    if (newProps.text === '') {
      this.doFinish('', 0);
      return;
    }

    // Going to render new page, set initial state
    // Limit to MAX_LENGTH characters. This just reduces the load on the component
    this.setState(PageSplitter.createNewState(newProps.text));
  }

  componentDidUpdate() {
    // State updated, add another sentence fragment, or finish

    // Finish this split if:
    //   The page has all items, or
    //   the page has rendered larger than the container (i.e. there's a scrollbar)
    if (this.state.count === this.state.items.length) {
      this.doFinish(this.state.prevItems.join(''), this.state.count);
      return;
    }
    if (this.page.scrollHeight > this.page.clientHeight) {
      this.doFinish(this.state.prevItems.join(''), this.state.count);
      return;
    }

    // Add another fragment in
    let newCount = this.state.count + 1;

    this.setState({
      ...this.state,
      count: newCount,
      prevItems: this.state.currentItems,
      currentItems: this.state.items.slice(0, newCount),
    });
  }

  /**
   * Calls the callback on the next tick, which reduces call stack overflows
   * 
   * @param {string} text Text that fits on the page
   * 
   * @memberof PageSplitter
   */
  doFinish(text, count) {
    setImmediate(() => {
      this.props.onfinish(text, count);
    });
  }

  render() {
    let paragraphs = this.state.currentItems
      .join('') // Need a string
      .split(/\r?\n\r?\n/) // Split into paragraphs
      .filter(t => !!t) // Remove empty paragraphs
      .map((para, i) => {
        let id = i;

        return <Paragraph 
          fragments={[para]} 
          identifier={id}
          characters={[]}
          selected={[]}
          key={id} 
          oncharclick={() => undefined}
          />;
      });

    return (
      <div className="Page PageSplitter" ref={(c)=>{this.page = c;}}>
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
