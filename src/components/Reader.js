import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from './Page';
import PageSplitter from './PageSplitter';
import BookLine from './BookLine';
import {paginate, dimensions} from '../util';
import './Reader.css';

/**
 * Component for the "eBook" reader
 * Handles page display and turning
 * 
 * @class Reader
 * @extends {Component}
 */
class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0,
      maxPage: 0,
      splitting: true,
      remainingText: this.props.text
    };

    this.pages = [];

    this.startPosition = null;
    this.currPosition = null;
    this.reachedThreshold = false;
    
    this.pageContainer = null;
  }

  /**
   * Called when the PageSplitter determines the text to be displayed
   * 
   * @param {string} result 
   * 
   * @memberof Reader
   */
  onSplitterFinish(result) {
    let maxPage = this.state.maxPage;
    let stillSplit = this.state.splitting;
    let rest = this.state.remainingText.slice(result.length);
    let nextPage = this.state.page + 1;

    if (result === '' || rest === '') {
      maxPage = this.state.page;
      stillSplit = false;
      nextPage = 0;

      console.log(`splitting complete, with ${maxPage + 1} pages`);
    }

    this.pages.push(
      <Page 
        text={result} 
        identifier={this.state.page} 
        key={this.state.page} />
    );

    this.setState({
      ...this.state,
      page: nextPage,
      splitting: stillSplit,
      maxPage: maxPage,
      remainingText: rest
    });
  }

  render() {
    let character = 'Alice';


    let page = this.state.splitting ? (
      <PageSplitter
        text={this.state.remainingText}
        identifier={this.state.page} 
        onfinish={(t)=>this.onSplitterFinish(t)}
        />
    ) : (
      this.pages[this.state.page]
    );

    return (
      <div className="Reader">
        <div 
          className="page-container"
          ref={(c) => this.pageContainer = c}
          onTouchStart={(e) => this.mouseDown(e)}
          onTouchEnd={(e) => this.mouseUp(e)}
          onTouchMove={(e) => this.mouseMove(e)}
          >
          {page}
        </div>
        {/*<div className="bookline-container">
          <BookLine 
            pages={this.pages}
            character={character}
            current={this.state.page}
            progress={this.state.maxPage}
            />
        </div>*/}
        <div className="temp-nav">
          <button onClick={() => this.prevPage()}>Prev</button>
          <button onClick={() => this.nextPage()}>Next</button>
        </div>
      </div>
    );
  }

  /**
   * Turns to the next page
   * 
   * @memberof Reader
   */
  nextPage() {
    this.setPage(Math.min(this.state.page + 1, this.pages.length));
  }

  /**
   * Turns to the previous page
   * 
   * @memberof Reader
   */
  prevPage() {
    this.setPage(Math.max(this.state.page - 1, 0));
  }

  /**
   * Goes to a specific page in the book
   * 
   * @param {number} page Page to turn to
   * 
   * @memberof Reader
   */
  setPage(page) {
    this.setState({
      ...this.state,
      page: page,
      maxPage: Math.max(page, this.state.maxPage)
    });
  }

  /**
   * Handles the start of a page turning
   * 
   * @param {React.TouchEvent} event 
   * 
   * @memberof Reader
   */
  mouseDown(event) {
    if (!this.currPosition) {
      this.startPosition = event.touches[0];
      this.currPosition = this.startPosition;
    }
  }

  /**
   * Handles the end of a page turning
   * 
   * @param {React.TouchEvent} event 
   * 
   * @memberof Reader
   */
  mouseUp(event) {
    if (event.touches.length === 0) {
      let requiredDiff = dimensions.x / 5;
      let xDiff = this.startPosition.clientX - this.currPosition.clientX;

      if (xDiff > requiredDiff) {
        this.nextPage();
      } else if (xDiff < (requiredDiff * -1)) {
        this.prevPage();
      }

      this.updateTurning(0);

      this.currPosition = null;
      this.startPosition = null;
      this.reachedThreshold = false;
    }
  }

  /**
   * Handles movement while the page is being turned
   * 
   * @param {React.TouchEvent} event 
   * 
   * @memberof Reader
   */
  mouseMove(event) {
    let minDiff = dimensions.x / 8;
    this.currPosition = event.touches[0];

    let xDiff = this.currPosition.clientX - this.startPosition.clientX;

    if (Math.abs(xDiff) > minDiff) {
      if (!this.reachedThreshold) {
        this.reachedThreshold = true;
      }
    }

    if (this.reachedThreshold) {
      this.updateTurning(xDiff);
    }
  }

  updateTurning(diff) {
    this.pageContainer.style.left = `${diff}px`;
  }
}

Reader.propTypes = {
  text: PropTypes.string.isRequired
};

export default Reader;
