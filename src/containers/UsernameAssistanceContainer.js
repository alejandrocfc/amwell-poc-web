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
import ValueLinkedContainer from './ValueLinkedContainer';
import AccountLookupComponent from '../components/login/AccountLookupComponent';
import { isValidDate } from '../components/Util';

class UsernameAssistanceContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.logger = props.logger;
    this.messages = props.messages;
    this.enableSpinner = props.enableSpinner;
    this.disableSpinner = props.disableSpinner;
    this.state = {
      hasSubmitted: false,
      errors: [],
      modified: [],
      dob: {
        year: '',
        month: '',
        day: '',
      },
      lastName: '',
      redactedEmail: '',
    };
  }

  submitLookup() {
    const shouldSubmit = this.state.lastName && this.state.dob.year && this.state.dob.month && this.state.dob.day;
    if (shouldSubmit) {
      this.enableSpinner();
      const dobAsDate = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
      this.sdk.authenticationService.recoverEmail(this.state.lastName, dobAsDate).then((response) => {
        this.logger.info('Request to recover email was made', response);
        const state = { hasSubmitted: true };
        if (response.email) {
          state.redactedEmail = response.email;
        }
        this.setState(state);
      }).catch((error) => {
        this.logger.error(error);
        this.props.showErrorModal();
      }).finally(() => {
        this.disableSpinner();
      });
    }
  }

  render() {
    const canSubmit = this.state.lastName && this.state.dob.year && this.state.dob.month && this.state.dob.day;
    const links = this.linkAll(['dob', 'lastName']);
    links.lastName.check(x => !this.state.modified.lastName || x, this.props.messages.validation_last_name_required);
    links.dob.check(x => !this.state.modified.dob || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    const properties = {
      redactedEmail: this.state.redactedEmail,
    };
    return (
      <div>
        <div id="login" className="loginAssistanceContainer">
          <div className='loginAssistanceForm'>
            <div className='blueFormHeader'>{this.props.messages.login_assistance_help}</div>
            <AccountLookupComponent canSubmit={ canSubmit } hasSubmitted={this.state.hasSubmitted} key='accountLookupComponent' submitLookup={this.submitLookup.bind(this)} valueLinks={links} isPassword={false} {...properties} {...this.props} />
          </div>
        </div>
      </div>
    );
  }
}

UsernameAssistanceContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  sdk: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};

export default UsernameAssistanceContainer;
