import React, { Component } from 'react';
import PropTypes from 'prop-types';

import PageSplitter from '../PageSplitter';
import { event } from '../../track';

/**
 * Component for the "eBook" reader
 * Handles page display and turning
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
   * Called when the PageSplitter determines the text to be displayed
   * 
   * @param {string} result 
   * 
   * @memberof Splitter
   */
  onSplitterFinish(result) {
    let rest = this.state.remainingText.slice(result.length);
    let nextPage = this.state.page + 1;

    if (result === '' || rest === '') {
      nextPage = 0;

      // eslint-disable-next-line no-console
      console.log(`splitting complete, with ${this.state.page + 1} pages`);

      event('pages-split-finish', { num: this.state.page + 1 });

      this.props.onfinish(this.pages);
      return;
    } else {
      this.pages.push(result);
    }

    this.setState({
      ...this.state,
      page: nextPage,
      maxPage: 0,
      remainingText: rest
    });
  }

  render() {
    // Create the PageSplitter for the current page
    let page = (
      <PageSplitter
        text={this.state.remainingText}
        identifier={this.state.page}
        onfinish={(t) => this.onSplitterFinish(t)}
      />
    );

    return (page);
  }
}

Splitter.propTypes = {
  text: PropTypes.string.isRequired,
  onfinish: PropTypes.func.isRequired,
};

export default Splitter;
