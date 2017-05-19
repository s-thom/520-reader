import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Paragraph from './Paragraph';
import './Page.css';

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
      .map((para, i) => {
        let id = `${this.props.identifier}-${i}`;

        return <Paragraph 
          text={para} 
          identifier={id}
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
  identifier: PropTypes.any.isRequired
};

export default Page;
