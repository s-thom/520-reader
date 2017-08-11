import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import Page from '../Page';
import PageSplitter from '../PageSplitter';
import BookLine from '../BookLine';
import CharacterList from '../CharacterList';
import Character from '../../Character';
import {dimensions} from '../../util';
import {event} from '../../track';
import './index.css';
import leftArrow from '../../res/ic_keyboard_arrow_left_black_24px.svg';
import rightArrow from '../../res/ic_keyboard_arrow_right_black_24px.svg';

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

      event('pages-split-finish', { num: this.state.page + 1});
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

  onTextCharacterSelected(character, shift) {
    this.onCharacterSelected(character, shift);
  }

  /**
   * Called when a character is selected
   * 
   * @param {Character} character Selected character
   * @param {boolean} shift Whether the "shift" key was pressed
   * @memberof Reader
   */
  onCharacterSelected(character, shift) {
    let charArray;
    let isNowSelected;

    // Set the character array to the new value
    // @ts-ignore
    if (this.state.characters.includes(character)) {
      // Make the selected charater index null
      // By not modifying other character's indicies, their colours won't change
      charArray = this.state.characters.map(c => (c === character ? null : c));
      isNowSelected = false;
    } else {
      // Make copy of array, so it is not mutated
      charArray = this.state.characters.slice();
      // Find first empty spot in array, or end of array
      let i;
      for (i = 0; i < charArray.length; i++) {
        if (!charArray[i]) {
          break;
        }
      }
      charArray[i] = character;
      isNowSelected = true;
    }

    if (isNowSelected) {
      event('character-select', {
        character: character.name,
        fullList: charArray.map(c => c ? c.name : '')
      });
    } else {
      event('character-deselect', {
        character: character.name,
        fullList: charArray.map(c => c ? c.name : '')
      });
    }

    let showLine = false;
    if (shift) {
      showLine = this.state.showBookline;
    } else {
      showLine = charArray.filter(a => a).length > 0;
    }

    this.setState({
      ...this.state,
      characters: charArray,
      showBookline: showLine,
    });
  }

  /**
   * Called when a key is pressed
   * 
   * @param {KeyboardEvent} {key} Event
   * @memberof Reader
   */
  onKey({key}) {
    // Keyboard navigation
    switch (key) {
      case 'a':
      case 'ArrowLeft':
        this.prevPage();
        break;
      case 'd':
      case 'ArrowRight':
        this.nextPage();
        break;
      case 'w':
      case 'ArrowUp':
        this.setState({
          ...this.state,
          showBookline: true,
        });
        break;
      case 's':
      case 'ArrowDown':
        this.setState({
          ...this.state,
          showBookline: false,
        });
        break;
      case 'Home':
        this.setPage(0);
        break;
      default:
        break;
    }
  }

  render() {
    // If splitting, make a PageSplitter, otherwise display the page
    let page = this.state.splitting ? (
      <PageSplitter
        text={this.state.remainingText}
        identifier={this.state.page} 
        onfinish={(t)=>this.onSplitterFinish(t)}
        startId={0}
        />
    ) : (
      <Page 
        text={this.pages[this.state.page]} 
        identifier={this.state.page} 
        characters={this.props.characters}
        oncharclick={(c,s)=>this.onTextCharacterSelected(c,s)}
        key={this.state.page}
        selected={this.state.characters}
        startId={0}
      />
    );

    // Create the bookline
    let shouldMakeLine = !this.state.splitting;
    let bookline = shouldMakeLine ? (
      <BookLine 
        pages={this.pages}
        characters={this.state.characters}
        current={this.state.page}
        progress={this.state.maxPage}
        />
    ) : null;

    // Create the character list
    let charList = (!this.state.splitting) ? (
      <div className="reader-characters">
        <CharacterList 
          pages={this.pages}
          characters={this.props.characters}
          current={this.state.page}
          progress={this.state.maxPage}
          selected={this.state.characters}
          onselected={(c,s)=>this.onCharacterSelected(c,s)}
          vertical
          />
      </div>
    ) : null;

    let navClass = `navigation${this.state.splitting?' hidden':''}`;
    let charName = this.state.characters
      .filter(c=>c)
      .map(c=>c.name)
      .join(', ');

    let readerClass = `Reader${this.state.showBookline?' bookline-show':''}`;

    return (
      <div 
        tabIndex={0}
        className={readerClass}
        onKeyDown={(e)=>this.onKey(e)}
        ref={el => el && el.focus()}>

        {/* Page content */}
        <div 
          className="page-container"
          ref={(c) => this.pageContainer = c}
          onTouchStart={(e) => this.mouseDown(e)}
          onTouchEnd={(e) => this.mouseUp(e)}
          onTouchMove={(e) => this.mouseMove(e)}
          >
          {page}
        </div>

        {/* List and line */}
        {charList}
        <div className="bookline-container">
          <h2>{`Bookline for ${charName}`}</h2>
          <div className="bookline-wrapper">
            {bookline}
          </div>
        </div>

        {/* Navigation */}
        <div className={navClass}>
          <button 
            className="navigation-button" 
            onClick={() => this.prevPage()}>
            <ReactSVG
              path={leftArrow} />
          </button>
          <span>{this.state.page + 1} / {this.pages.length}</span>
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
    this.setPage(Math.min(this.state.page + 1, this.pages.length - 1));
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

    event('new-page', {page});

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

      // Reset variables
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

  /**
   * Sets the position of the page (for turning 'animation')
   * 
   * @param {number} diff Positioning
   * @memberof Reader
   */
  updateTurning(diff) {
    this.pageContainer.style.left = `${diff}px`;
  }
}

Reader.propTypes = {
  text: PropTypes.string.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired
};

export default Reader;
