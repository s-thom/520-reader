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

    let characters = this.findCharacters(page.props.text);

    let list = characters.map((char) => {
      return (
        <div 
          key={`char-${char.name}`}
          className="char">
          <span className="char-name">{char.name}</span>
        </div>
      );
    });

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
