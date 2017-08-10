import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character  from '../../Character';
import Paragraph from '../Paragraph';
import './index.css';

/**
 * Component that displays a page of a book
 * 
 * @class Page
 * @extends {Component}
 */
class Page extends Component {
  render() {
    let paragraphs = this.props.text
      .split(/\r?\n\r?\n/)
      .filter(t => !!t)
      .map((para, i) => {
        let id = `${this.props.identifier}-${i}`;

        return <Paragraph 
          text={para} 
          identifier={id}
          characters={this.props.characters}
          selected={this.props.selected}
          oncharclick={this.props.oncharclick}
          key={id} 
          />;
      });

    return (
      <div className="Page">
        <div className="paragraph-container">
          {paragraphs}
        </div>
      </div>
    );
  }
}

Page.propTypes = {
  text: PropTypes.string.isRequired,
  identifier: PropTypes.any.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  oncharclick: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default Page;
