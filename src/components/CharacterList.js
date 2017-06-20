import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../Character';
import Page from './Page';
import './CharacterList.css';

/**
 * Component to display a list of Characters
 * 
 * @class CharacterList
 * @extends {Component}
 */
class CharacterList extends Component {
  constructor(props) {
    super(props);
  } 

  render() {
    let curr = this.props.current;

    let page = this.props.pages[curr];

    // Choose which type of line to use
    let list = this.findCharacters(page.props.text)
      .map(c => c.name)
      .join(', ');
    console.log(`${curr}: ${list}`);

    return (
      <div className="CharacterList">
        {list}
      </div>
    );
  }

  findCharacters(text) {
    return this.props.characters.filter((character) => {
      return character.numberOfOccurrences(text) > 0;
    });
  }
}

CharacterList.defaultProps = {
  progress: 0
};

CharacterList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(Page)),
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired
};

export default CharacterList;
