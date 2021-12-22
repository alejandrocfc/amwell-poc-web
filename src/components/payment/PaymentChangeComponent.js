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
import { FormattedMessage } from 'react-intl';

import './PaymentAddOrChangeComponent.css';

const PaymentChangeComponent = (props) => { // eslint-disable-line arrow-body-style
  return (
    <div className="paymentAddOrChangeComponent">
      <div>
        <span className="cardIcon"/>
        <FormattedMessage id="changeCard" defaultMessage={props.messages.visit_credit_card_on_file} values={{ lastfour: <b>{props.paymentMethod.lastDigits}</b> }}/>
        <span className="separator">|</span>
        <button className="link-like" onClick={props.handleChangeCreditCardClicked}>{props.messages.visit_change_credit_card}</button>
      </div>
    </div>
  );
};

PaymentChangeComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  handleChangeCreditCardClicked: PropTypes.func.isRequired,
  paymentMethod: PropTypes.object.isRequired,
};
PaymentChangeComponent.defaultProps = {};
export default PaymentChangeComponent;
