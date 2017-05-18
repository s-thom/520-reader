import React, { Component } from 'react';
import Paragraph from '../components/Paragraph';
import './Page.css';

class Page extends Component {
  render() {
    let paragraphs = this.props.text
      .split(/\r?\n\r?\n/)
      .map(para => <Paragraph text={para} />);

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
