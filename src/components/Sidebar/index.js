import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactSVG from 'react-svg';

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
        {this.props.children}
        <div className="Sidebar-spacer" />
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
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]).isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default Sidebar;
