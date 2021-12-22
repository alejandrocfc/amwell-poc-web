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

const BoldingLabelComponent = (props) => {
  const boldClass = props.isBold ? ' bold' : '';
  return (<span className={`boldingLabel ${boldClass}`}>{props.displayText}</span>);
};

BoldingLabelComponent.propTypes = {
  displayText: PropTypes.string.isRequired,
  isBold: PropTypes.bool.isRequired,
};
BoldingLabelComponent.defaultProps = {};
export default BoldingLabelComponent;
