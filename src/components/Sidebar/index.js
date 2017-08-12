import React, { Component } from 'react';
import PropTypes from 'prop-types';

import Character from '../../Character';
import PageInfo from '../../PageInfo';
import CharacterList from '../CharacterList';
import './index.css';

/**
 * Component to display a list of Characters
 * 
 * @class Sidebar
 * @extends {Component}
 */
class Sidebar extends Component {
  render() {
    return (
      <div className="Sidebar">
        <CharacterList
          pages={this.props.pages}
          characters={this.props.characters}
          current={this.props.current}
          progress={this.props.progress}
          selected={this.props.selected}
          onselected={this.props.onselected}
        />
      </div>
    );
  }
}

Sidebar.defaultProps = {
  progress: 0
};

Sidebar.propTypes = {
  pages: PropTypes.arrayOf(PropTypes.instanceOf(PageInfo)),
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  characters: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
  onselected: PropTypes.func,
  events: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Sidebar;
