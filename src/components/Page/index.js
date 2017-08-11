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
    let {
      info,
      characters,
      selected,
      oncharclick
    } = this.props;
    let {text, id: startId} = info;
    let fragmentCount = 0;

    let paragraphs = text
      .split(/\r?\n\r?\n/) // Split into paragraphs
      .filter(t => !!t) // Remove empty paragraphs
      .map((para, i) => {
        let id = startId + fragmentCount;
        let fragments = punctuationSplit(para);
        fragmentCount += fragments.length;

        return <Paragraph 
          fragments={fragments} 
          identifier={id}
          characters={characters}
          selected={selected}
          oncharclick={oncharclick}
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
  info: PropTypes.instanceOf(PageInfo).isRequired,
  identifier: PropTypes.any.isRequired,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  oncharclick: PropTypes.func.isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default Page;
