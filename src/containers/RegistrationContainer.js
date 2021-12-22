/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';

import Registration from '../components/registration/RegistrationComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { isValidEmail, isValidPhoneNumber, isValidDate, areEqualStrings, isUnsetOrEmptyString } from '../components/Util';
import InformationModal from '../components/popups/info/InformationModal';

class RegistrationContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.props.logger.debug('RegistrationContainer: props', props);
    this.consumerMiddleNameHandling = this.props.sdk.getSystemConfiguration().consumerMiddleNameHandling;
    this.consumerAddressRequired = this.props.sdk.getSystemConfiguration().consumerAddressRequired;
    this.state = {
      disclaimer: {},
      countries: [],
      errors: [],
      modified: [],
      firstName: '',
      middleNameOrInitial: '',
      lastName: '',
      phone: '',
      email: '',
      confirmEmail: '',
      password: '',
      legalResidence: {
        countryCode: '',
        stateCode: '',
      },
      addressCountryCode: '',
      addressStateCode: '',
      address1: '',
      address2: '',
      city: '',
      zipCode: '',
      dob: {
        year: '',
        month: '',
        day: '',
      },
      gender: '',
      genderIdentity: '',
      sendWelcomeEmail: false,
      hasAcceptedDisclaimer: false,
      showOptionalPasswordModal: false,
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
    if (!areEqualStrings(this.state.email, this.state.confirmEmail)) {
      errors.confirmEmail = this.props.messages.validation_confirm_email_no_match;
    }
    if (this.props.sdk.getSystemConfiguration().genderSupportEnabled && isUnsetOrEmptyString(this.state.genderIdentity)) {
      errors.genderIdentity = this.props.messages.validation_gender_required;
    }
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }
    this.props.enableSpinner();
    const consumerRegistrationForm = this.props.sdk.consumerService.newConsumerRegistration();
    consumerRegistrationForm.firstName = this.state.firstName;

    const middleNameOrInitial = this.state.middleNameOrInitial ? this.state.middleNameOrInitial : '';
    if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
      consumerRegistrationForm.middleName = middleNameOrInitial;
    } else if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
      consumerRegistrationForm.middleInitial = middleNameOrInitial;
    }

    consumerRegistrationForm.lastName = this.state.lastName;
    consumerRegistrationForm.gender = this.state.gender;
    if (this.props.sdk.getSystemConfiguration().genderSupportEnabled) {
      consumerRegistrationForm.genderIdentityKey = this.state.genderIdentity;
    }
    if (this.state.dob.year !== '' && this.state.dob.month !== '' && this.state.dob.day !== '') {
      consumerRegistrationForm.dob = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
    }
    consumerRegistrationForm.email = this.state.email;
    consumerRegistrationForm.password = this.state.password;
    consumerRegistrationForm.phone = this.state.phone;
    if (this.state.legalResidence.countryCode !== '') {
      consumerRegistrationForm.legalResidenceCountryCode = this.state.legalResidence.countryCode;
    }
    consumerRegistrationForm.legalResidence = this.state.legalResidence.stateCode;
    consumerRegistrationForm.sendWelcomeEmail = this.state.sendWelcomeEmail;
    consumerRegistrationForm.hasAcceptedDisclaimer = this.state.hasAcceptedDisclaimer;
    if (this.consumerAddressRequired) {
      consumerRegistrationForm.address1 = this.state.address1;
      consumerRegistrationForm.address2 = this.state.address2;
      consumerRegistrationForm.city = this.state.city;
      consumerRegistrationForm.stateCode = this.state.addressStateCode;
      consumerRegistrationForm.zipCode = this.state.zipCode;
      if (this.props.sdk.getSystemConfiguration().isMultiCountry) {
        consumerRegistrationForm.countryCode = this.state.addressCountryCode;
      } else {
        consumerRegistrationForm.countryCode = this.state.countries[0].code;
      }
    }

    this.props.sdk.consumerService.register(consumerRegistrationForm)
      .then(() => {
        // we have a password - login automatically
        if (this.state.password) {
          let auth;
          this.props.sdk.authenticationService.authenticate(this.state.email, this.state.password)
            .then((authenticateResponse) => {
              if (authenticateResponse.twoFactorInfo.requiredAction !== awsdk.AWSDKTwoFactorRequiredAction.NONE) {
                this.props.partiallyAuthenticatedCallback(authenticateResponse);
                this.props.history.push('/login');
                return;
              }
              auth = authenticateResponse;
              return this.props.sdk.consumerService.getConsumer(authenticateResponse);
            })
            .then((consumer) => {
              this.props.consumerAuthenticationCallback(consumer, auth);
              this.props.history.push('/');
            });
        } else {
          // no password show them modal + redirect to login page
          this.setState({ showOptionalPasswordModal: true });
        }
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
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
            if (fieldError.fieldName === 'firstName' && fieldError.reason === 'field required') {
              errors.firstName = this.props.messages.validation_first_name_required;
            } else if (fieldError.fieldName === 'lastName' && fieldError.reason === 'field required') {
              errors.lastName = this.props.messages.validation_last_name_required;
            } else if (fieldError.fieldName === 'gender' && fieldError.reason === 'field required') {
              errors.gender = this.props.genderSupportEnabled ? this.props.messages.validation_biologicalSex_required : this.props.messages.validation_gender_required;
            } else if (fieldError.fieldName === 'dob' && fieldError.reason === 'field required') {
              errors.dob = this.props.messages.validation_dob_required;
            } else if (fieldError.fieldName === 'email' && fieldError.reason === 'field required') {
              errors.email = this.props.messages.validation_email_required;
            } else if (fieldError.fieldName === 'email' && fieldError.reason === 'invalid format') {
              errors.email = this.props.messages.validation_email_invalid;
            } else if (fieldError.fieldName === 'password' && fieldError.reason === 'field required') {
              errors.password = this.props.messages.validation_password_required;
            } else if (fieldError.fieldName === 'address1' && fieldError.reason === 'field required') {
              errors.address1 = this.props.messages.validation_primary_address_address1_required;
            } else if (fieldError.fieldName === 'city' && fieldError.reason === 'field required') {
              errors.city = this.props.messages.validation_primary_address_city_required;
            } else if (fieldError.fieldName === 'zipCode' && fieldError.reason === 'field required') {
              errors.zipCode = this.props.messages.validation_primary_address_zip_code_required;
            } else if (fieldError.fieldName === 'addressStateCode' && fieldError.reason === 'field required') {
              errors.addressStateCode = this.props.messages.validation_primary_address_state_required;
            } else if (fieldError.fieldName === 'addressCountryCode' && fieldError.reason === 'field required') {
              errors.addressCountryCode = this.props.messages.validation_primary_address_country_required;
            } else if (fieldError.fieldName === 'firstName' && fieldError.reason === 'invalid format') {
              errors.firstName = this.props.messages.validation_first_name_invalid;
            } else if (fieldError.fieldName === 'lastName' && fieldError.reason === 'invalid format') {
              errors.lastName = this.props.messages.validation_last_name_invalid;
            } else if (fieldError.fieldName === 'middleName' && fieldError.reason === 'invalid format') {
              errors.middleNameOrInitial = this.props.messages.validation_middle_name_invalid;
            } else if (fieldError.fieldName === 'middleInitial' && fieldError.reason === 'invalid format') {
              errors.middleNameOrInitial = this.props.messages.validation_middle_initial_invalid;
            } else if (fieldError.fieldName === 'phone') {
              errors.phone = this.props.messages.validation_phone_number_invalid;
            } else if (fieldError.fieldName === 'hasAcceptedDisclaimer') {
              errors.hasAcceptedDisclaimer = this.props.messages.validation_has_accepted_disclaimer_required;
            } else if (fieldError.fieldName === 'legalResidenceCountryCode') {
              errors.legalResidence = this.props.messages.validation_legal_residence_country_required;
            } else if (fieldError.fieldName === 'legalResidenceStateCode') {
              errors.legalResidence = this.props.messages.validation_legal_residence_state_required;
            } else if (fieldError.fieldName === 'address1' && fieldError.reason === 'invalid format') {
              errors.address1 = this.props.messages.validation_primary_address_address1_invalid;
            } else if (fieldError.fieldName === 'address2' && fieldError.reason === 'invalid format') {
              errors.address2 = this.props.messages.validation_primary_address_address2_invalid;
            } else if (fieldError.fieldName === 'city' && fieldError.reason === 'invalid format') {
              errors.city = this.props.messages.validation_primary_address_city_invalid;
            } else if (fieldError.fieldName === 'zipCode' && fieldError.reason === 'invalid format') {
              errors.zipCode = this.props.messages.validation_primary_address_zip_code_invalid;
            } else if (fieldError.fieldName === 'addressStateCode' && fieldError.reason === 'invalid format') {
              errors.addressStateCode = this.props.messages.validation_primary_address_state_invalid;
            } else if (fieldError.fieldName === 'addressCountryCode' && fieldError.reason === 'invalid format') {
              errors.addressCountryCode = this.props.messages.validation_primary_address_country_invalid;
            }
          }
        });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationConsumerUnderage) {
        errors.dob = this.props.messages.validation_dob_too_young;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationEmailInUse) {
        errors.email = this.props.messages.validation_email_inuse;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidPassword) {
        errors.password = this.props.messages.validation_password_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidParameter) {
        this.props.showErrorModal(this.props.messages.registration_error);
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  render() {
    this.props.logger.debug('render ', this.state, this.context);
    const isMultiCountry = this.props.sdk.getSystemConfiguration().isMultiCountry;
    const consumerRegistrationLinks = this.linkAll();

    consumerRegistrationLinks.firstName.check(x => !this.state.modified.firstName || x, this.props.messages.validation_first_name_required);
    consumerRegistrationLinks.lastName.check(x => !this.state.modified.lastName || x, this.props.messages.validation_last_name_required);
    consumerRegistrationLinks.gender.check(x => !this.state.modified.gender || x, this.props.messages.validation_gender_required);
    consumerRegistrationLinks.dob.check(x => !this.state.modified.dob || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    consumerRegistrationLinks.email.check(x => !this.state.modified.email || x, this.props.messages.validation_email_required);
    consumerRegistrationLinks.confirmEmail.check(x => !this.state.modified.confirmEmail || areEqualStrings(this.state.email, x), this.props.messages.validation_confirm_email_no_match);
    consumerRegistrationLinks.phone.check(x => !this.state.modified.phone || isValidPhoneNumber(x), this.props.messages.validation_phone_number_invalid);
    consumerRegistrationLinks.legalResidence.check(x => !isMultiCountry || !this.state.modified.legalResindence || x.countryCode, this.props.messages.validation_legal_resindence_country_required);
    consumerRegistrationLinks.legalResidence.check(x => !this.state.modified.legalResindence || x.stateCode, this.props.messages.validation_legal_resindence_state_required);
    consumerRegistrationLinks.hasAcceptedDisclaimer.check(x => !this.state.modified.hasAcceptedDisclaimer || x, this.props.messages.validation_has_accepted_disclaimer_required);
    consumerRegistrationLinks.address1.check(x => !this.consumerAddressRequired || !this.state.modified.address1 || x, this.props.messages.validation_primary_address_address1_required);
    consumerRegistrationLinks.city.check(x => !this.consumerAddressRequired || !this.state.modified.city || x, this.props.messages.validation_primary_address_city_required);
    consumerRegistrationLinks.addressStateCode.check(x => !this.consumerAddressRequired || !this.state.modified.addressStateCode || x, this.props.messages.validation_primary_address_state_required);
    consumerRegistrationLinks.zipCode.check(x => !this.consumerAddressRequired || !this.state.modified.zipCode || x, this.props.messages.validation_primary_address_zip_code_required);
    consumerRegistrationLinks.addressCountryCode.check(x => !this.consumerAddressRequired || !isMultiCountry || !this.state.modified.addressCountryCode || x, this.props.messages.validation_primary_address_country_required);
    const properties = {
      disclaimer: this.state.disclaimer,
      countries: this.state.countries,
      consumerMiddleNameHandling: this.consumerMiddleNameHandling,
      isMultiCountry,
      consumerAddressRequired: this.consumerAddressRequired,
    };

    return (
      <div>
        <InformationModal
          messages={this.props.messages}
          isOpen={this.state.showOptionalPasswordModal}
          header={this.props.messages.registration_password_optional_modal_header}
          message={this.props.messages.registration_password_optional_modal_message}
          toggle={() => this.props.history.push('/')}
          clickHandler={() => this.props.history.push('/')}/>
        <Registration submitRegistration={this.submitRegistration.bind(this)} valueLinks={consumerRegistrationLinks} {...this.props} {...properties} />
      </div>);
  }
}

RegistrationContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
RegistrationContainer.defaultProps = {};
export default RegistrationContainer;
