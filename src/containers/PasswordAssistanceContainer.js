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
import queryString from 'query-string';
import awsdk from 'awsdk';
import ValueLinkedContainer from './ValueLinkedContainer';
import AccountLookupComponent from '../components/login/AccountLookupComponent';
import NewPasswordComponent from '../components/login/NewPasswordComponent';
import { isValidDate, isValidEmail } from '../components/Util';

class PasswordAssistanceContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.logger = props.logger;
    this.messages = props.messages;
    this.enableSpinner = props.enableSpinner;
    this.disableSpinner = props.disableSpinner;
    this.state = {
      hasSubmitted: false,
      accountIdParam: queryString.parse(props.location.search).accountId,
      tokenParam: queryString.parse(props.location.search).token,
      newPassword: '',
      confirmNewPassword: '',
      errors: [],
      modified: [],
      dob: {
        year: '',
        month: '',
        day: '',
      },
      lastName: '',
      email: '',
    };
  }

  submitPasswordResetRequest() {
    const shouldSubmit = this.state.email && this.state.lastName && this.state.dob.year && this.state.dob.month && this.state.dob.day;
    if (shouldSubmit) {
      this.enableSpinner();
      const dobAsDate = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
      this.sdk.authenticationService.requestPasswordReset(this.state.email, this.state.lastName, dobAsDate).then(() => {
        this.logger.info('Request to recover email was made');
        this.setState({ hasSubmitted: true });
      }).catch((error) => {
        this.logger.error(error);
        this.props.showErrorModal();
      }).finally(() => {
        this.disableSpinner();
      });
    }
  }

  submitUpdatePasswordRequest() {
    const shouldSubmit = this.state.confirmNewPassword && this.state.newPassword === this.state.confirmNewPassword;
    if (shouldSubmit) {
      this.enableSpinner();
      this.sdk.authenticationService.updatePassword(this.state.accountIdParam, this.state.tokenParam, this.state.newPassword).then(() => {
        // success, show success
        sessionStorage.setItem('resetComplete', true);
        this.props.history.replace('/passwordAssistance/complete');
      }).catch((error) => {
        this.logger.error(error);
        if (error.errorCode === awsdk.AWSDKErrorCode.invalidPassword) {
          // try again with a better password pls
          const { errors } = this.state.errors;
          errors.confirmNewPassword = this.props.messages.validation_password_invalid;
          this.setState({ errors });
        } else {
          // cant recover
          sessionStorage.setItem('resetComplete', false);
          this.props.history.replace('/passwordAssistance/fail');
        }
      }).finally(() => {
        this.disableSpinner();
      });
    }
  }

  render() {
    const canSubmit = this.state.email && this.state.lastName && this.state.dob.year && this.state.dob.month && this.state.dob.day;
    const canSubmitPassword = this.state.confirmNewPassword && this.state.newPassword && this.state.confirmNewPassword === this.state.newPassword;
    const links = this.linkAll(['dob', 'lastName', 'email', 'newPassword', 'confirmNewPassword']);
    links.confirmNewPassword.check(x => (!this.state.modified.confirmNewPassword || x.length === 0) || x === this.state.newPassword, this.props.messages.validation_confirm_password_no_match);
    links.email.check(x => !this.state.modified.email || x, this.props.messages.validation_email_required)
      .check(x => !this.state.modified.email || isValidEmail(x), this.props.messages.validation_email_invalid);
    links.lastName.check(x => !this.state.modified.lastName || x, this.props.messages.validation_last_name_required);
    links.dob.check(x => !this.state.modified.dob || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    return (
      <div>
        <div id="login" className="loginAssistanceContainer">
          <div className='loginAssistanceForm'>
            <div className='blueFormHeader'>{this.props.messages.login_assistance_help}</div>
            {(this.state.accountIdParam && this.state.tokenParam) ? (
              // we've arrived from an email link
              <NewPasswordComponent canSubmitPassword={ canSubmitPassword } key='newPasswordComponent' submitUpdatePassword={this.submitUpdatePasswordRequest.bind(this)} valueLinks={links} {...this.props} />
            ) : (
              // we need to generate a password reset request
              <AccountLookupComponent canSubmit={ canSubmit } hasSubmitted={this.state.hasSubmitted} key='accountLookupComponent' submitLookup={this.submitPasswordResetRequest.bind(this)} valueLinks={links} isPassword={true} {...this.props} />
            )
            }
          </div>
        </div>
      </div>
    );
  }
}

PasswordAssistanceContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  sdk: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};

export default PasswordAssistanceContainer;
