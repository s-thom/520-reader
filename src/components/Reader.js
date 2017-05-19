import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from './Page';
import {paginate, dimensions} from '../util';
import './Reader.css';

class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };

    this.pages = paginate(this.props.text)
      .map((t, i) => <Page text={t} identifier={i} key={i} />);

    this.startPosition = null;
    this.currPosition = null;
    this.pageContainer = null;
  }

  render() {
    return (
      <div className="Reader">
        <div 
          className="page-container"
          ref={(c) => this.pageContainer = c}
          onTouchStart={(e) => this.mouseDown(e)}
          onTouchEnd={(e) => this.mouseUp(e)}
          onTouchMove={(e) => this.mouseMove(e)}
          >
          {this.pages[this.state.page]}
        </div>
        <div className="temp-nav">
          <button onClick={() => this.prevPage()}>Prev</button>
          <button onClick={() => this.nextPage()}>Next</button>
        </div>
      </div>
    );
  }

  nextPage() {
    this.setPage(Math.min(this.state.page + 1, this.pages.length));
  }

  prevPage() {
    this.setPage(Math.max(this.state.page - 1, 0));
  }

  setPage(page) {
    this.setState({
      page
    });
  }

  mouseDown(event) {
    if (!this.currPosition) {
      this.startPosition = event.touches[0];
      this.currPosition = this.startPosition;
    }
  }

  mouseUp(event) {
    if (event.touches.length === 0) {
      let xDiff = this.startPosition.clientX - this.currPosition.clientX;
      if (xDiff > 100) {
        this.nextPage();
      } else if (xDiff < -100) {
        this.prevPage();
      }

      this.updateTurning(0);

      this.currPosition = null;
      this.startPosition = null;
    }
  }

  mouseMove(event) {
    this.currPosition = event.touches[0];


    let xDiff = this.currPosition.clientX - this.startPosition.clientX;
    this.updateTurning(xDiff);
  }

  updateTurning(diff) {
    this.pageContainer.style.left = `${diff}px`;
  }
}

Reader.propTypes = {
  text: PropTypes.string.isRequired
};

export default Reader;
