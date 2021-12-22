/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './PageComponent.css'


const PageComponent = (props) => {
  return (
    <>
      <div className="page-banner" style={{backgroundImage: `url(${props.banner})`}}/>
      <div className={classNames('page-body', {'page-unpadded': props.unpadded })}>
        {props.children}
      </div>
    </>
  );
};

PageComponent.propTypes = {
  banner: PropTypes.string,
  unpadded: PropTypes.bool
};
export default PageComponent;
