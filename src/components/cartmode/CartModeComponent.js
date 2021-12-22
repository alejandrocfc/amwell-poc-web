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
import { Route } from 'react-router-dom';

import CartModeLogo from './images/cartmode-logo.png';
import CartModeTopicsComponent from './CartModeTopicsComponent';
import CartModePatientComponent from './CartModePatientComponent';

import './CartModeComponent.css';


const CartModeComponent = props => (
  <div className="cartModeComponent">
    <div className="cartModeHeader">
      <img src={CartModeLogo} alt={props.messages.cart_mode_cart_mode}/>
    </div>

    <Route path={`${props.match.url}/patient`} render={() => (
      <CartModePatientComponent
        consumerOverrideDetails={props.consumerOverrideDetails}
        nextClickHandler={props.setConsumerOverrideDetails}
        countries={props.countries}
        practice={props.practice}
        provider={props.provider}
        {...props}/>
    )}/>

    <Route path={`${props.match.url}/topics`} render={() => (
      <CartModeTopicsComponent
        topicText={props.topicText}
        setTopicText={props.setTopicText}
        nextClickHandler={props.startCartModeVisit}
        messages={props.messages}
        history={props.history}
        practice={props.practice}
        provider={props.provider}/>
    )}/>

  </div>
);

CartModeComponent.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  setConsumerOverrideDetails: PropTypes.func.isRequired,
  setTopicText: PropTypes.func.isRequired,
  startCartModeVisit: PropTypes.func.isRequired,
  topicText: PropTypes.string,
  consumerOverrideDetails: PropTypes.object,
};
export default CartModeComponent;
