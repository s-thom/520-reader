import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

import Character from '../../Character';
import PageInfo from '../../PageInfo';
import CharacterList from '../CharacterList';
import EventList from '../EventList';
import './index.css';
import upArrow from '../../res/ic_keyboard_arrow_up_black_24px.svg';

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
        <EventList
          current={this.props.current}
          progress={this.props.progress}
          events={this.props.events}
        />
        <div className="Sidebar-toggle">
          <div className="Sidebar-toggle-bg" onClick={this.props.onToggle}>
            <ReactSVG path={upArrow} />
          </div>
        </div>
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
  onToggle: PropTypes.func.isRequired,
  events: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default Sidebar;
