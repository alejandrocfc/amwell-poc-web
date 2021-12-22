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

import './CartModeTopicsComponent.css';

const CartModeTopicsComponent = props => (
  <div className="cartModeTopicsComponent">
    <div className="cartModeTopicsHeader">
      <span>{props.messages.visit_before_you_begin}</span>
      {props.messages.cart_mode_topics_discuss}
    </div>
    <div className="cartModeVisitTopicsInput">
      <span>{props.messages.visit_intake_topics}</span>
      <textarea value={props.topicText} onChange={e => props.setTopicText(e.target.value)}/>
    </div>
    <div className="cartModeVisitTopicsButtons">
      <button onClick={props.history.goBack}>{props.messages.back}</button>
      <button onClick={props.nextClickHandler}>{props.messages.next}</button>
    </div>
  </div>
);

CartModeTopicsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  nextClickHandler: PropTypes.func.isRequired,
  setTopicText: PropTypes.func.isRequired,
  topicText: PropTypes.string,
};
export default CartModeTopicsComponent;
