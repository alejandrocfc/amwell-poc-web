/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2018 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './TabComponent.css';

const TabComponent = (props) => {
  const isSelected = `${props.match.url}/${props.matchPath}` === props.location.pathname;

  const notSelected = (
    <div className="notSelected">
      <Link to={{ pathname: `${props.match.url}/${props.matchPath}`, state: props.stateToPassAlong }}>{props.title}</Link>
    </div>
  );

  const selected = (
    <div className="selected">
      <span>{props.title}</span>
    </div>
  );

  return (
    <div className="tab">
      {isSelected ? selected : notSelected}
    </div>
  );
};

TabComponent.propTypes = {
  location: PropTypes.any.isRequired,
  title: PropTypes.any.isRequired,
  matchPath: PropTypes.string.isRequired,
  stateToPassAlong: PropTypes.object,
};

export default TabComponent;
