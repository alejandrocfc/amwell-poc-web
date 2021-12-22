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
import React, { Component } from 'react';
import { Form, FormGroup, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import './Login.css';
import './TwoFactor.css';

class TwoFactorLoginComponent extends Component {

  render() {
    return (
      <div id="login" className="twoFactor">
        <div className='loginForm'>
          <div className="headerBar"/>
          <Form className="formGroupContent" onSubmit={this.props.sendTwoFactorAuthCode}>
            <FormGroup>
              <h1>{this.props.messages.two_factor_login_header}</h1>
              <div className="twoFactorMessage">
                <FormattedMessage
                  id="twoFactorMessage"
                  defaultMessage={this.props.messages.two_factor_login_message}
                  values={{
                    lastFour: this.props.authentication.twoFactorInfo.phoneNumberLastFourDigits,
                    formattedCustomerSupportPhone: this.props.sdk.getSystemConfiguration().formattedCustomerSupportPhone
                  }}
                />
              </div>
              <div className="formSpacing">
                <Button color="success" id="submit">{ this.props.messages.two_factor_submit }</Button>
              </div>
              <div className="twoFactorDetails compact">
                <FormattedMessage id="twoFactorDetails" values={this.props.messages.two_factor_login_details} />
              </div>
              <div className="formSpacing twoFactorFooter">
                <Button type="button" className="twoFactorFooterButton" onClick={this.props.toggleDisclaimerModal}>{this.props.messages.two_factor_terms_of_use}</Button>
                <span className="footerSeparator"/>
                <Button type="button" className="twoFactorFooterButton" onClick={this.props.toggleDisclaimerModal}>{this.props.messages.two_factor_privacy_policy}</Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

TwoFactorLoginComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  sendTwoFactorAuthCode: PropTypes.func.isRequired,
  toggleDisclaimerModal: PropTypes.func.isRequired,
};

export default TwoFactorLoginComponent;
