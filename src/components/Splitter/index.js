import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import Page from '../Page';
import PageSplitter from '../PageSplitter';
import BookLine from '../BookLine';
import CharacterList from '../CharacterList';
import Character from '../../Character';
import { dimensions } from '../../util';
import { event } from '../../track';
import './index.css';
import leftArrow from '../../res/ic_keyboard_arrow_left_black_24px.svg';
import rightArrow from '../../res/ic_keyboard_arrow_right_black_24px.svg';

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
      maxPage: 0,
      splitting: true,
      remainingText: this.props.text,
      remainingIndex: 0,
      characters: [],
      showBookline: false,
    };

    this.pages = [];

    this.startPosition = null;
    this.currPosition = null;
    this.reachedThreshold = false;

    this.pageContainer = null;

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
    let stillSplit = this.state.splitting;
    let rest = this.state.remainingText.slice(result.length);
    let nextPage = this.state.page + 1;

    if (result === '' || rest === '') {
      stillSplit = false;
      nextPage = 0;

      // eslint-disable-next-line no-console
      console.log(`splitting complete, with ${this.state.page + 1} pages`);

      event('pages-split-finish', { num: this.state.page + 1 });
    } else {
      this.pages.push(result);
    }

    this.setState({
      ...this.state,
      page: nextPage,
      splitting: stillSplit,
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
  text: PropTypes.string.isRequired
};

export default Splitter;
