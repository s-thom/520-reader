import React, { Component } from 'react';
import Page from './Page';

import {paginate} from '../util';

const baseSplitRegex = /(?:([\w\W]{1,1000})(?:[ \n]|$))/g;

class Reader extends Component {
  render() {
    let pages = paginate(this.props.text)
      .map((t, i) => <Page text={t} identifier={i} key={i} />);

    return (
      <div className="Reader">
        {pages}
      </div>
    );
  }
}

export default Reader;
