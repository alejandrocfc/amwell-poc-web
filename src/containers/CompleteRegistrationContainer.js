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
import awsdk from 'awsdk';

import ValueLinkedContainer from './ValueLinkedContainer';
import { isValidEmail } from '../components/Util';
import CompleteRegistration from '../components/registration/CompleteRegistrationComponent';

class CompleteRegistrationContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.props.logger.debug('CompleteRegistrationContainer: props', props);
    const legalResidence = this.props.authentication.consumer.legalResidence;
    const countryCode = (legalResidence && legalResidence.countryCode) || '';
    const stateCode = (legalResidence && legalResidence.code) || '';

    this.state = {
      disclaimer: {},
      countries: [],
      errors: {},
      modified: [],
      email: this.props.authentication.consumer.email,
      confirmEmail: '',
      password: '',
      legalResidence: {
        countryCode,
        stateCode,
      },
      hasAcceptedDisclaimer: false,
    };
  }
  componentDidMount() {
    this.props.enableSpinner();
    const promise1 = this.props.sdk.consumerService.getRegistrationDisclaimer()
      .then((disclaimer) => {
        this.props.logger.info('Disclaimer', disclaimer);
        this.setState({ disclaimer });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
    const promise2 = this.props.sdk.getCountries()
      .then((countries) => {
        this.props.logger.info('Countries', countries);
        this.setState({ countries });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
    Promise.all([promise1, promise2]).finally(() => this.props.disableSpinner());
  }

  submitRegistration(e) {
    if (e) e.preventDefault();
    const errors = {};
    if (!isValidEmail(this.state.email)) {
      errors.email = this.props.messages.validation_email_invalid;
    }
    // check email to confirmEmail
    if (this.state.email !== this.state.confirmEmail) {
      errors.confirmEmail = this.props.messages.validation_confirm_email_no_match;
    }
    if (!this.state.hasAcceptedDisclaimer) {
      errors.hasAcceptedDisclaimer = this.props.messages.validation_disclaimer_not_acknowledged;
    }
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    this.props.enableSpinner();
    this.props.sdk.consumerService.completeRegistration(this.props.authentication,
      {
        legalResidenceCountry: this.state.legalResidence.countryCode,
        legalResidenceState: this.state.legalResidence.stateCode,
        newUsername: this.state.email,
        newPassword: this.state.password,
        ...(!this.props.mutualAuthEnabled && { username: this.props.originalUsername }),
        ...(!this.props.mutualAuthEnabled && { password: this.props.originalPassword }),
        ...(this.props.mutualAuthEnabled && { consumerAuthKey: this.props.mutualAuthToken }),
      })
      .then((authentication) => {
        this.props.registrationCompletedCallback(authentication);
        // we can only get an updated consumer if there are no required steps for two-factor
        if (authentication.twoFactorInfo.requiredAction === awsdk.AWSDKTwoFactorRequiredAction.NONE) {
          return this.props.sdk.consumerService.acceptOutstandingDisclaimer(authentication.consumer)
            .then((consumer) => this.props.sdk.consumerService.getUpdatedConsumer(consumer))
            .then((consumer) => this.props.consumerAuthenticationCallback(consumer, authentication))
            .then(() => {
              this.props.history.push('/');
            });
        } else {
          this.props.history.push('/login');
        }
      })
      .catch((error) => {
        this.props.logger.error('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.validationErrors) {
        const fieldErrors = error.errors;
        this.props.logger.debug('map errors - validation errors', fieldErrors);
        fieldErrors.forEach((fieldError) => {
          if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
            if (fieldError.fieldName === 'legalResidenceCountryCode') {
              errors.legalResidence = this.props.messages.validation_legal_residence_country_required;
            } else if (fieldError.fieldName === 'legalResidenceStateCode') {
              errors.legalResidence = this.props.messages.validation_legal_residence_state_required;
            }
          }
        });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationRequiredParameterMissing && this.state.email === '') {
        errors.email = this.props.messages.validation_email_required;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationRequiredParameterMissing && this.state.password === '') {
        errors.password = this.props.messages.validation_password_required;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationEmailInUse) {
        errors.email = this.props.messages.validation_email_inuse;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidPassword) {
        errors.password = this.props.messages.validation_password_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else {
        this.props.logger.error('unhandled error', error.errorCode);
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }


  render() {
    this.props.logger.debug('render ', this.state, this.context);
    const isMultiCountry = this.props.sdk.getSystemConfiguration().isMultiCountry;
    const completeRegistrationLinks = this.linkAll();
    completeRegistrationLinks.email.check(x => !this.state.modified.email || x, this.props.messages.validation_email_required);
    completeRegistrationLinks.confirmEmail.check(x => !this.state.modified.confirmEmail || x === this.state.email, this.props.messages.validation_confirm_email_no_match);
    completeRegistrationLinks.password.check(x => !this.state.modified.password || x, this.props.messages.validation_password_required);
    completeRegistrationLinks.hasAcceptedDisclaimer.check(x => !this.state.modified.hasAcceptedDisclaimer || x, this.props.messages.validation_has_accepted_disclaimer_required);

    const properties = {
      disclaimer: this.state.disclaimer,
      countries: this.state.countries,
      isMultiCountry,
    };

    return (
      <CompleteRegistration submitRegistration={this.submitRegistration.bind(this)} valueLinks={completeRegistrationLinks} {...this.props} {...properties} />
    );
  }
}

CompleteRegistrationContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  registrationCompletedCallback: PropTypes.func.isRequired,
};
CompleteRegistrationContainer.defaultProps = {};
export default CompleteRegistrationContainer;
