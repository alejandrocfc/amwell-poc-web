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

import './PaymentAddOrChangeComponent.css';

const PaymentAddComponent = (props) => { // eslint-disable-line arrow-body-style
  return (
    <div className="paymentAddOrChangeComponent">
      <div>
        <span>{props.messages.visit_no_credit_card_on_file}</span>
        <span className="separator">|</span>
        <button className="link-like" onClick={props.handleChangeCreditCardClicked}>{props.messages.visit_add_credit_card}</button>
      </div>
    </div>
  );
};

PaymentAddComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  handleChangeCreditCardClicked: PropTypes.func.isRequired,
};
PaymentAddComponent.defaultProps = {};
export default PaymentAddComponent;
