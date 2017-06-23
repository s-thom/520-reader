import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import Page from './Page';
import PageSplitter from './PageSplitter';
import BookLine from './BookLine';
import CharacterList from './CharacterList';
import Character from '../Character';
import {dimensions} from '../util';
import './Reader.css';
import leftArrow from '../res/ic_keyboard_arrow_left_black_24px.svg';
import rightArrow from '../res/ic_keyboard_arrow_right_black_24px.svg';

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
      remainingText: this.props.text,
      character: null
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
    let stillSplit = this.state.splitting;
    let rest = this.state.remainingText.slice(result.length);
    let nextPage = this.state.page + 1;

    if (result === '' || rest === '') {
      stillSplit = false;
      nextPage = 0;

      // eslint-disable-next-line no-console
      console.log(`splitting complete, with ${this.state.page + 1} pages`);
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
      maxPage: 0,
      remainingText: rest
    });
  }

  onCharacterSelected(character) {
    if (character === this.state.character) {
      this.setState({
        ...this.state,
        character: null
      });
      return;
    }

    this.setState({
      ...this.state,
      character: character
    });
  }

  onKey({key}) {
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        this.prevPage();
        break;
      case 'd':
      case 'ArrowRight':
        this.nextPage();
        break;
    }
  }

  render() {
    let page = this.state.splitting ? (
      <PageSplitter
        text={this.state.remainingText}
        identifier={this.state.page} 
        onfinish={(t)=>this.onSplitterFinish(t)}
        />
    ) : (
      this.pages[this.state.page]
    );
    let bookline = ((!this.state.splitting) && this.state.character) ? (
      <BookLine 
        key="bookline"
        pages={this.pages}
        character={this.state.character}
        current={this.state.page}
        progress={this.state.maxPage}
        />
    ) : null;
    let booklineClass = `bookline-container${this.state.character?' bookline-show':''}`;

    let charList = (!this.state.splitting) ? (
      <div className="reader-characters">
        <CharacterList 
          key="characterlist"
          pages={this.pages}
          characters={this.props.characters}
          current={this.state.page}
          progress={this.state.maxPage}
          selected={this.state.character}
          onselected={(c)=>this.onCharacterSelected(c)}
          vertical
          />
      </div>
    ) : null;

    let navClass = `navigation${this.state.splitting?' hidden':''}`;
    let charName = this.state.character ? this.state.character.name : 'UNKNOWN';

    return (
      <div 
        tabIndex={0}
        className="Reader"
        onKeyDown={(e)=>this.onKey(e)}>
        <div 
          className="page-container"
          ref={(c) => this.pageContainer = c}
          onTouchStart={(e) => this.mouseDown(e)}
          onTouchEnd={(e) => this.mouseUp(e)}
          onTouchMove={(e) => this.mouseMove(e)}
          >
          {page}
        </div>
        {charList}
        <div className={booklineClass}>
          <h2>{`Bookline for ${charName}`}</h2>
          {bookline}
        </div>
        <div className={navClass}>
          <button 
            className="navigation-button" 
            onClick={() => this.prevPage()}>
            <ReactSVG
              path={leftArrow} />
          </button>
          <button 
            className="navigation-button" 
            onClick={() => this.nextPage()}>
            <ReactSVG
              path={rightArrow} />
          </button>
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
    if (this.state.splitting) {
      return;
    }

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

      // Check page turning
      if (xDiff > requiredDiff) {
        this.nextPage();
      } else if (xDiff < (requiredDiff * -1)) {
        this.prevPage();
      } else 
      // Check bookline condition
      if (!this.reachedThreshold) {
        // Show/hide bookline
        this.setState({
          ...this.state,
          character: null
        });
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
  text: PropTypes.string.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired
};

export default Reader;
