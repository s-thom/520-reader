import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Page from './Page';
import {paginate} from '../util';

class Reader extends Component {
  constructor(props) {
    super(props);

    this.state = {
      page: 0
    };

    this.pages = paginate(this.props.text)
      .map((t, i) => <Page text={t} identifier={i} key={i} />);
  }

  render() {
    return (
      <div className="Reader">
        <div className="page-container">
          {this.pages[this.state.page]}
        </div>
        <div className="temp-nav">
          <button onClick={()=> this.prevPage()}>Prev</button>
          <button onClick={()=> this.nextPage()}>Next</button>
        </div>
      </div>
    );
  }

  nextPage() {
    this.setPage(this.state.page + 1);
  }

  prevPage() {
    this.setPage(this.state.page - 1);
  }

  setPage(page) {
    this.setState({
      page
    });
  }
}

Reader.propTypes = {
  text: PropTypes.string.isRequired
};

export default Reader;
