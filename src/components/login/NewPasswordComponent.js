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

import React, { Component } from 'react';
import { Form, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import Password from '../form/PasswordComponent';
import './Login.css';

class NewPasswordComponent extends Component {
  render() {
    const newPasswordLink = this.props.valueLinks.newPassword;
    const confirmNewPasswordLink = this.props.valueLinks.confirmNewPassword;
    return (
      <Form className='formGroupContent'>
        <div className="loginAssistanceText">{this.props.messages.login_assistance_password_new_instruction}</div>
        <Password id="newPassword" name="password" passwordLink={newPasswordLink} placeholder={this.props.messages.registration_password} {...this.props} />
        <Password id="confirmNewPassword" name="confirmPassword" passwordLink={confirmNewPasswordLink} placeholder={this.props.messages.registration_confirm_password} {...this.props} />
        <div className='continueButton'>
          <Button disabled={!this.props.canSubmitPassword} color="success" id="continue" onClick={this.props.submitUpdatePassword}>
            {this.props.messages.submit}
          </Button>
        </div>
      </Form>
    );
  }
}

NewPasswordComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitUpdatePassword: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
};

export default NewPasswordComponent;
