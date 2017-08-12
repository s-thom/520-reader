import React, { Component } from 'react';
import PropTypes from 'prop-types';

import './index.css';

/**
 * Component to display a list of Characters
 * 
 * @class EventList
 * @extends {Component}
 */
class EventList extends Component {
  render() {
    // Create items for each event
    let list = this.props.events.map((event) => {
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
  progress: 0
};

EventList.propTypes = {
  progress: PropTypes.number.isRequired,
  current: PropTypes.number,
  events: PropTypes.arrayOf(PropTypes.any).isRequired,
};

export default EventList;
