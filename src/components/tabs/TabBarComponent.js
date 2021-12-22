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
import './TabBarComponent.css';

const TabBarComponent = (props) => { // eslint-disable-line
  return (
    <div className="tabBar">
      {props.children}
    </div>
  );
};

TabBarComponent.propTypes = {
  children: PropTypes.any.isRequired,
};

export default TabBarComponent;
