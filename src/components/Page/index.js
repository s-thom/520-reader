import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../../Character';
import PageInfo from '../../PageInfo';
import Paragraph from '../Paragraph';
import {punctuationSplit} from '../../util';
import './index.css';

/**
 * Component that displays a page of a book
 * 
 * @class Page
 * @extends {Component}
 */
class Page extends Component {
  render() {
    let fragmentCount = 0;

    let paragraphs = this.props.text
      .split(/\r?\n\r?\n/) // Split into paragraphs
      .filter(t => !!t) // Remove empty paragraphs
      .map((para, i) => {
        let id = this.props.startId + fragmentCount;
        let fragments = punctuationSplit(para);
        fragmentCount += fragments.length;

        return <Paragraph 
          fragments={fragments} 
          identifier={id}
          characters={this.props.characters}
          selected={this.props.selected}
          oncharclick={this.props.oncharclick}
          key={i} 
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
  startId: PropTypes.number.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  oncharclick: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default Page;
