import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SplitterPage from '../SplitterPage';
import PageInfo from '../../PageInfo';
import { event } from '../../track';

/**
 * Component to wrap the splitting process
 * 
 * @class Splitter
 * @extends {Component}
 */
class Splitter extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      remainingText: this.props.text,
      remainingIndex: 0,
    };

    this.pages = [];

    event('pages-split-start');
  }

  /**
   * Called when the SplitterPage determines the text to be displayed
   * 
   * @param {string} text 
   * 
   * @memberof Splitter
   */
  onSplitterFinish(text, count) {
    let rest = this.state.remainingText.slice(text.length);

    if (text === '' || rest === '') {

      // eslint-disable-next-line no-console
      console.log(`splitting complete, with ${this.state.page + 1} pages`);

      event('pages-split-finish', { num: this.state.page + 1 });

      this.props.onfinish(this.pages);
      return;
    } else {
      // Add this page's info
      let result = new PageInfo(text, this.state.remainingIndex, count);
      this.pages.push(result);

      // Set state for next page
      let nextPage = this.state.page + 1;
      let nextIndex = this.state.remainingIndex + count;

      this.setState({
        ...this.state,
        page: nextPage,
        remainingText: rest,
        remainingIndex: nextIndex,
      });
    }
  }

  render() {
    // Only displays the SplitterPage (no container)
    return (
      <SplitterPage
        text={this.state.remainingText}
        identifier={this.state.page}
        onfinish={(t, c) => this.onSplitterFinish(t, c)}
      />
    );
  }
}

Splitter.propTypes = {
  text: PropTypes.string.isRequired,
  onfinish: PropTypes.func.isRequired,
};

export default Splitter;
