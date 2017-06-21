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
  render() {
    let curr = this.props.current;
    let page = this.props.pages[curr];

    let characters = this.findCharacters(page.props.text);
    if (this.props.selected) {
      if (!characters.includes(this.props.selected)) {
        characters.unshift(this.props.selected);
      }
    }

    let list = characters.map((char) => {
      let charClass = `char${char === this.props.selected ? ' char-selected' : ''}`;

      return (
        <div 
          key={`char-${char.name}`}
          className={charClass}>
          {char.imageUrl && <img 
            className="char-img" 
            src={char.imageUrl}
            alt={char.name} />}
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
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  selected: PropTypes.instanceOf(Character)
};

export default CharacterList;
