/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';

import './VisitComponents.css';

class VisitHeaderComponent extends React.Component {
  render() {
    const iconClassName = `visitHeaderIcon ${this.props.icon}`;
    return (
      <div className="visit" id={this.props.id}>
        <div className="visitHeader">
          <div className={iconClassName}/>
          <div id="visitHeaderTitle" className="visitHeaderTitle">{this.props.title}</div>
        </div>
        <div className="visitBody">
          {this.props.children}
        </div>
      </div>
    );
  }
}

VisitHeaderComponent.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
};
VisitHeaderComponent.defaultProps = {};
export default VisitHeaderComponent;
