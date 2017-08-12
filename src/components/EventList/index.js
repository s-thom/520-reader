import React, { Component } from 'react';
import PropTypes from 'prop-types';

import BookEvent from '../../BookEvent';
import Character from '../../Character';
import './index.css';

/**
 * Component to display a list of Characters
 * 
 * @class EventList
 * @extends {Component}
 */
class EventList extends Component {
  render() {
    let characters = this.props.selected
      .filter(c => c);

    // Create items for each event
    let list = this.props.events
      .filter((event) => {
        if (event.fragment <= this.props.maxFragment) {
          return false;
        }

        return event.matchesCharacters(characters);
      })
      .map((event) => {
        return (
          <div>
            <p>{event.text}</p>
          </div>
        );
      });

    return (
      <div className="EventList">
        {list}
      </div>
    );
  }
}

EventList.defaultProps = {
  progress: 0,
  maxFragment: -1,
};

EventList.propTypes = {
  maxFragment: PropTypes.number.isRequired,
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.instanceOf(BookEvent)).isRequired,
  selected: PropTypes.arrayOf(PropTypes.instanceOf(Character)).isRequired,
};

export default EventList;
