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

import './CartModeButton.css';

const CartModeButton = props => (
  <button className='cartModeButton' onClick={props.clickHandler}/>
);

CartModeButton.propTypes = {
  clickHandler: PropTypes.func.isRequired,
};
export default CartModeButton;
