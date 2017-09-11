import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../../Character';
import PageInfo from '../../PageInfo';
import './index.css';

import {primitiveComparator} from '../../util';

/**
 * Component to display a list of Characters
 * 
 * @class CharacterList
 * @extends {Component}
 */
class CharacterList extends Component {
  constructor(props, context) {
    super(props, context);

    this.os = this.onSelect.bind(this);
  }

  render() {
    let curr = this.props.current;
    let page = this.props.pages[curr];

    let characters = this.findCharacters(page.text);
    // Add selected, but not present, characters
    if (this.props.selected.length) {
      this.props.selected.forEach((char) => {
        // Make sure to not add the filler spots in the selected array
        if (!char) {
          return;
        }

        // Don't add duplicate characters
        if (!characters.includes(char)) {
          characters.unshift(char);
        }
      });
    }

    // Sort list by name alphabetically
    // It makes more snese than the order in the JSON
    characters.sort((a, b) => primitiveComparator(a.name, b.name));

    // Create items for each character
    let list = characters.map((char) => {
      let charClasses = [
        'char'
      ];
      // Sets opacity and colour
      if (this.props.selected.includes(char)) {
        charClasses.push('char-selected');
        charClasses.push(`selected-${this.props.selected.indexOf(char)}`);
      }

      // Add image, or initial if there's no image, for character
      let charIcon = char.imageUrl ? (
        <img 
          className="char-icon char-img" 
          src={char.imageUrl}
          alt={char.name} />
      ) : (
        <span className="char-icon char-initial">
          <span className="char-initial-content">{char.name[0].toUpperCase()}</span>
        </span>
      );

      let showLabel = this.props.selected.includes(char);

      return (
        <div 
          key={`char-${char.name}`}
          className={charClasses.join(' ')}
          onClick={() => this.os(char)}>
          {charIcon}
          {showLabel && <span className="char-name"><span className="char-label">{char.name}</span></span>}
        </div>
      );
    });

    // Add classes to container
    let classes = [
      'CharacterList',
      'vertical'
    ];

    return (
      <div className={classes.join(' ')}>
        {list}
      </div>
    );
  }

  /**
   * Finds which characters occur in the text
   * 
   * @param {string} text Text to search
   * @returns {Character[]} Characters that are in the text
   * @memberof CharacterList
   */
  findCharacters(text) {
    return this.props.characters.filter((character) => {
      return character.numberOfOccurrences(text) > 0;
    });
  }

  /**
   * Called when a character is selected
   * 
   * @param {Character} char Selected character
   * @memberof CharacterList
   */
  onSelect(char, shift) {
    setImmediate(() => {
      if (this.props.onselected) {
        this.props.onselected(char, shift);
      }
    });
  }
}

CharacterList.defaultProps = {
  progress: 0
};

CharacterList.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(PageInfo)),
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  onselected: PropTypes.func,
  wrap: PropTypes.bool,
  vertical: PropTypes.bool
};

export default CharacterList;
