import React, { Component } from 'react';
import Paragraph from './Paragraph';
import './Page.css';

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
      }
        
      );

    return (
      <div className="Page">
        <div className="paragraph-container">
          {paragraphs}
        </div>
      </div>
    );
  }
}

export default Page;
