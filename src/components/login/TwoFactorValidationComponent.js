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
import { Form, FormGroup, Button, Label } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import {Checkbox, TextInput} from '../form/Inputs';

import './Login.css';
import './TwoFactor.css';

class TwoFactorValidationComponent extends Component {
  render() {
    return (
      <div id="login" className="twoFactor">
        <div className="loginForm">
          <div className="headerBar"/>
          <Form className="formGroupContent" onSubmit={this.props.submitTwoFactorValidation}>
            <FormGroup>
              <h1>{this.props.messages.two_factor_validation_header}</h1>
              <div className="twoFactorMessage">
                <FormattedMessage id='two_factor_validation_message' values={{lastFour: this.props.authentication.twoFactorInfo.phoneNumberLastFourDigits}} />
              </div>
              <div className="formSpacing">
                <Label for="verificationCode">{this.props.messages.two_factor_validation_label}</Label>
                <TextInput name="verificationCode" id="verificationCode"
                           placeholder={this.props.messages.two_factor_validation_prompt}
                           valueLink={this.props.valueLinks.verificationCode}
                />
              </div>
              <div className="formSpacing">
                <Button className="linkLike" type="button" onClick={this.props.sendTwoFactorAuthCode}>{this.props.messages.two_factor_validation_resend}</Button>
              </div>
              <div className="formSpacing">
                <Checkbox className="rememberDevice" id="rememberDevice" checkedLink={this.props.valueLinks.rememberDevice}>
                  {this.props.messages.two_factor_remember_this_device}
                </Checkbox>
                <div className="rememberDeviceDetails">
                  {this.props.messages.two_factor_remember_this_device_details}
                </div>
              </div>
              <div className="formSpacing verifyButtonContainer">
                <Button color="success" id="submit">{this.props.messages.two_factor_validation_submit}</Button>
              </div>
            </FormGroup>
          </Form>
        </div>
      </div>
    );
  }
}

TwoFactorValidationComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitTwoFactorValidation: PropTypes.func.isRequired,
  sendTwoFactorAuthCode: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
  authentication: PropTypes.object.isRequired,
};

export default TwoFactorValidationComponent;
