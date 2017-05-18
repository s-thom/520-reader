import React, { Component } from 'react';
import Page from './Page';

const baseSplitRegex = /(?:([\w\W]{1,1000})(?:[ \n]|$))/g;

class Paginator extends Component {
  render() {
    let fullText = this.props.text;

    let pages = fullText
      .match(baseSplitRegex)
      .map((t, i) => <Page text={t} identifier={i} key={i} />);

    return (
      <div className="Paginator">
        {pages}
      </div>
    );
  }
}

export default Paginator;
