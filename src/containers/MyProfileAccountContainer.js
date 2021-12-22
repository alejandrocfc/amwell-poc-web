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
import MyProfileAccountComponent from '../components/myprofile/account/MyProfileAccountComponent';
import { hasContextChanged, isValidDate, isValidEmail, isValidZipCode } from '../components/Util';

class MyProfileAccountContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.info('MyProfileAccountContainer: props', props);
    this.isMultiCountry = this.props.sdk.getSystemConfiguration().isMultiCountry;
    this.isFieldProtected = this.isFieldProtected.bind(this);
    this.consumerMiddleNameHandling = this.props.sdk.getSystemConfiguration().consumerMiddleNameHandling;
    this.state = {
      isEditIdentification: false,
      isEditPersonalInfo: false,
      isEditShippingAddress: false,
      isEditCredentials: false,
      isEditReminders: false,
      isEditResidence: false,
      isEditSystemPreferences: false,
      countries: [],
      errors: [],
      modified: [],
      existingShippingAddress: null,
    };
  }

  // Initializes the various user editable fields to their defaults based on consumer
  resetFormState() {
    const hasAddress = this.props.activeConsumer.address;
    const hasLegalResidence = this.props.activeConsumer.legalResidence;

    let middleNameOrInitial = '';
    if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
      middleNameOrInitial = this.props.activeConsumer.middleName;
    } else if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
      middleNameOrInitial = this.props.activeConsumer.middleInitial;
    }

    const newState = {
      firstName: this.props.activeConsumer.firstName,
      lastName: this.props.activeConsumer.lastName,
      middleNameOrInitial,
      email: this.props.activeConsumer.email,
      legalResidence: {
        countryCode: hasLegalResidence ? this.props.activeConsumer.legalResidence.countryCode : '',
        stateCode: hasLegalResidence ? this.props.activeConsumer.legalResidence.code : '',
      },
      dob: {
        year: this.props.activeConsumer.dob.getUTCFullYear(),
        month: this.props.activeConsumer.dob.getUTCMonth() + 1,
        day: this.props.activeConsumer.dob.getUTCDate(),
      },
      gender: this.props.activeConsumer.gender,
      genderIdentity: this.props.activeConsumer.genderIdentity ? this.props.activeConsumer.genderIdentity.key : '',
      phone: this.props.activeConsumer.phone,
      reminders: this.props.activeConsumer.appointmentReminderTextsEnabled,
      password: '',
      confirmPassword: '',
      homeCountryCode: this.props.activeConsumer.address ? this.props.activeConsumer.address.countryCode : '',
      homeStateCode: this.props.activeConsumer.address ? this.props.activeConsumer.address.stateCode : '',
      homeAddress1: hasAddress ? this.props.activeConsumer.address.address1 : '',
      homeAddress2: (hasAddress && this.props.activeConsumer.address.address2) ? this.props.activeConsumer.address.address2 : '',
      homeCity: hasAddress ? this.props.activeConsumer.address.city : '',
      homeZipCode: hasAddress ? this.props.activeConsumer.address.zipCode : '',
      shippingAddress1: '',
      shippingAddress2: '',
      shippingCity: '',
      shippingCountryCode: '',
      shippingStateCode: '',
      shippingZipCode: '',
      preferredLanguage: this.props.activeConsumer.preferredLocale || 'en_US',
    };

    if (this.state.existingShippingAddress) {
      this.mapShippingAddressInputs(newState, this.state.existingShippingAddress);
    }

    this.setState(newState);
  }

  UNSAFE_componentWillMount() {
    this.resetFormState();
  }

  componentDidMount() {
    this.setupContainer();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.props.sdk.consumerService.getUpdatedConsumer(this.props.activeConsumer)
        .then((consumer) => this.props.consumerUpdated(consumer))
        .then(() => this.setupContainer());
    }
  }

  setupContainer() {
    this.props.enableSpinner();

    const countriesPromise = this.props.sdk.getCountries();
    const shippingAddressPromise = this.props.sdk.consumerService.getShippingAddress(this.props.activeConsumer)
      .catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.noShippingAddressFound) {
          // do nothing
        }
      });

    Promise.all([countriesPromise, shippingAddressPromise])
      .then((values) => {
        const newState = {};
        newState.countries = values[0];
        const shippingAddress = values[1];
        if (shippingAddress) {
          newState.existingShippingAddress = shippingAddress;
          this.mapShippingAddressInputs(newState, shippingAddress);
        }
        this.setState(newState);
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  toggleSection(sectionName) {
    this.resetFormState();
    this.setState(prevState => ({
      [sectionName]: !prevState[sectionName],
    }));
  }

  toggleOffAllSections() {
    this.setState({
      isEditIdentification: false,
      isEditPersonalInfo: false,
      isEditShippingAddress: false,
      isEditCredentials: false,
      isEditReminders: false,
      isEditResidence: false,
      isEditSystemPreferences: false,
    });
  }

  setShippingAddressInputs() {
    if (this.state.existingShippingAddress) {
      const newState = {};
      this.mapShippingAddressInputs(newState, this.state.existingShippingAddress);
      this.setState(newState);
    }
  }

  mapShippingAddressInputs(newState, shippingAddress) {
    newState.shippingAddress1 = shippingAddress.address1;
    newState.shippingAddress2 = shippingAddress.address2;
    newState.shippingCity = shippingAddress.city;
    newState.shippingZipCode = shippingAddress.zipCode;
    newState.shippingStateCode = shippingAddress.stateCode;
    newState.shippingCountryCode = shippingAddress.countryCode;
  }

  updateMyProfileAccount(e, type) {
    if (e) e.preventDefault();
    if (type === 'identification') {
      this.updateIdentification();
    } else if (type === 'personal') {
      this.updatePersonalInfo();
    } else if (type === 'shipping') {
      this.updateShippingAddress();
    } else if (type === 'reminder') {
      this.updateReminders();
    } else if (type === 'credentials') {
      this.updateCredentials();
    } else if (type === 'residence') {
      this.updateLegalResidence();
    } else if (type === 'systempreferences') {
      this.updateSystemPreferences();
    }
  }

  containsRequiredFields(fields) {
    return fields.every(field => field && field !== '');
  }

  isFieldProtected(fieldName) {
    return this.props.sdk.consumerService.isFieldProtected(this.props.activeConsumer, fieldName);
  }

  submitConsumerUpdate(consumerUpdate) {
    this.props.logger.info('MyProfileAccountContainer: submitConsumerUpdate', consumerUpdate);
    consumerUpdate.isAppointmentReminderTextsEnabled = this.state.reminders; // unset boolean property could unintentionally set this to false
    const errors = this.props.sdk.consumerService.validateConsumerUpdate(consumerUpdate);
    if (errors && errors.length > 0) {
      this.props.logger.error('MyProfileAccountContainer: submitConsumerUpdate', errors);
      this.mapError(errors);
    } else {
      this.props.enableSpinner();
      this.props.sdk.consumerService.updateConsumer(this.props.activeConsumer, consumerUpdate)
        .then((updatedConsumer) => {
          this.props.consumerUpdated(updatedConsumer);
        })
        .then(() => this.props.sdk.consumerService.getDependents(this.props.consumer))
        .then((dependents) => {
          this.props.updateDependentsCallback(dependents);
          this.toggleOffAllSections();
        })
        .catch((error) => {
          this.props.logger.error('Something went wrong:', error);
          this.mapError(error);
        })
        .finally(() => {
          this.props.disableSpinner();
        });
    }
  }

  submitDependentUpdate(dependentUpdate) {
    this.props.logger.info('MyProfileAccountContainer: submitDependentUpdate', dependentUpdate);
    const errors = this.props.sdk.consumerService.validateDependentUpdate(dependentUpdate);
    if (errors && errors.length > 0) {
      this.props.logger.error('MyProfileAccountContainer: submitDependentUpdate', errors);
      this.mapError(errors);
    } else {
      this.props.enableSpinner();
      this.props.sdk.consumerService.updateDependent(this.props.activeConsumer, dependentUpdate)
        .then((updatedConsumer) => {
          this.props.consumerUpdated(updatedConsumer);
        })
        .then(() => this.props.sdk.consumerService.getDependents(this.props.consumer))
        .then((dependents) => {
          this.props.updateDependentsCallback(dependents);
          this.toggleOffAllSections();
        })
        .catch((error) => {
          this.props.logger.error('Something went wrong:', error);
          this.mapError(error);
        })
        .finally(() => this.props.disableSpinner());
    }
  }

  updateShippingAddress() {
    const countryCode = this.state.shippingCountryCode ? this.state.shippingCountryCode : this.state.countries[0].code;
    const state = this.state.countries.find(c => c.code === countryCode).states.find(s => s.code === this.state.shippingStateCode);
    const shippingUpdateForm = this.props.sdk.consumerService.newAddressUpdate(
      this.state.shippingAddress1,
      this.state.shippingAddress2,
      this.state.shippingCity,
      state,
      this.state.shippingZipCode);
    this.props.enableSpinner();
    this.props.sdk.consumerService.updateShippingAddress(this.props.activeConsumer, shippingUpdateForm)
      .then(shippingAddress => this.setState({ existingShippingAddress: shippingAddress, isEditShippingAddress: false }))
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  updateLegalResidence() {
    this.props.logger.info('MyProfileAccountContainer: updateLegalResidence', this.state.legalResidence);
    const consumerUpdateForm = this.props.sdk.consumerService.newConsumerUpdate();
    const shouldSubmit = this.containsRequiredFields([this.state.legalResidence.stateCode, this.state.legalResidence.countryCode]);
    if (shouldSubmit) {
      consumerUpdateForm.legalResidence = this.state.legalResidence.stateCode;
      consumerUpdateForm.legalResidenceCountryCode = this.state.legalResidence.countryCode;
      this.submitConsumerUpdate(consumerUpdateForm);
    }
  }

  updateCredentials() {
    const emailHasChanged = this.state.email !== this.props.activeConsumer.email;
    const shouldSubmit = emailHasChanged || this.state.password.length > 0 || this.state.confirmPassword.length > 0;
    if (shouldSubmit) {
      if (this.state.password !== this.state.confirmPassword) {
        const errors = { confirmPassword: this.props.messages.validation_confirm_password_no_match };
        this.setState({ errors });
      } else {
        const consumerUpdateForm = this.props.sdk.consumerService.newConsumerUpdate();
        consumerUpdateForm.password = this.state.password;
        consumerUpdateForm.email = this.state.email;
        this.submitConsumerUpdate(consumerUpdateForm);
      }
    }
  }

  updateReminders() {
    const consumerUpdateForm = this.props.sdk.consumerService.newConsumerUpdate();
    this.submitConsumerUpdate(consumerUpdateForm);
  }

  updatePersonalInfo() {
    if (this.canSubmitPersonalInfo()) {
      const consumerUpdateForm = this.props.isDependent ? this.props.sdk.consumerService.newDependentUpdate() : this.props.sdk.consumerService.newConsumerUpdate();
      if (this.state.dob.year !== '' && this.state.dob.month !== '' && this.state.dob.day !== '') {
        consumerUpdateForm.dob = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
      }
      consumerUpdateForm.gender = this.state.gender;
      if (this.props.genderSupportEnabled) {
        consumerUpdateForm.genderIdentityKey = this.state.genderIdentity;
      }
      consumerUpdateForm.phone = this.state.phone;
      consumerUpdateForm.address1 = this.state.homeAddress1;
      consumerUpdateForm.address2 = this.state.homeAddress2;
      consumerUpdateForm.city = this.state.homeCity;
      consumerUpdateForm.zipCode = this.state.homeZipCode;
      consumerUpdateForm.stateCode = this.state.homeStateCode;
      consumerUpdateForm.countryCode = this.state.homeCountryCode;

      if (this.props.isDependent) {
        this.submitDependentUpdate(consumerUpdateForm);
      } else {
        this.submitConsumerUpdate(consumerUpdateForm);
      }
    }
  }

  updateIdentification() {
    const consumerUpdateForm = this.props.isDependent ? this.props.sdk.consumerService.newDependentUpdate() : this.props.sdk.consumerService.newConsumerUpdate();
    const shouldSubmit = this.containsRequiredFields([this.state.firstName, this.state.lastName, this.state.email]);

    if (shouldSubmit) {
      consumerUpdateForm.firstName = this.state.firstName;
      consumerUpdateForm.lastName = this.state.lastName;
      if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
        consumerUpdateForm.middleName = this.state.middleNameOrInitial || '';
      } else if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
        consumerUpdateForm.middleInitial = this.state.middleNameOrInitial || '';
      }
      consumerUpdateForm.email = this.state.email;

      if (this.props.isDependent) {
        this.submitDependentUpdate(consumerUpdateForm);
      } else {
        this.submitConsumerUpdate(consumerUpdateForm);
      }
    }
  }

  updateSystemPreferences() {
    const consumerUpdateForm = this.props.sdk.consumerService.newConsumerUpdate();
    consumerUpdateForm.preferredLocale = this.state.preferredLanguage;
    this.submitConsumerUpdate(consumerUpdateForm);
  }

  canSubmitAddress(fields) {
    if (fields.some(field => field && field !== '')) {
      return this.containsRequiredFields(fields);
    }
    return true;
  }

  canSubmitHomeAddress() {
    return this.canSubmitAddress([this.state.homeCity, this.state.homeZipCode, this.state.homeAddress1, this.state.homeStateCode]);
  }

  canSubmitShippingAddress() {
    return this.containsRequiredFields([this.state.shippingCity, this.state.shippingZipCode, this.state.shippingAddress1, this.state.shippingStateCode]);
  }

  canSubmitPersonalInfo() {
    const requiredFields = [this.state.gender, this.state.dob.day, this.state.dob.year, this.state.dob.month];
    return this.containsRequiredFields(requiredFields) && this.canSubmitHomeAddress();
  }

  checkInvalidFields(fieldError, errors) {
    if (fieldError.reason === 'invalid format') {
      if (fieldError.fieldName === 'firstName') {
        errors.firstName = this.props.messages.validation_first_name_invalid;
      }
      if (fieldError.fieldName === 'middleInitial') {
        errors.middleNameOrInitial = this.props.messages.validation_middle_initial_invalid;
      }
      if (fieldError.fieldName === 'middleName') {
        errors.middleNameOrInitial = this.props.messages.validation_middle_name_invalid;
      }
      if (fieldError.fieldName === 'lastName') {
        errors.lastName = this.props.messages.validation_last_name_invalid;
      }
      if (fieldError.fieldName === 'email') {
        errors.email = this.props.messages.validation_email_invalid;
      }
      if (fieldError.fieldName === 'legalResidenceCountryCode') {
        errors.legalResidence = this.props.messages.validation_legal_residence_country_required;
      }
      if (fieldError.fieldName === 'legalResidenceStateCode') {
        errors.legalResidence = this.props.messages.validation_legal_residence_state_required;
      }
      if (fieldError.fieldName === 'shippingZipCode') {
        errors.shippingZipCode = this.props.messages.validation_primary_address_zip_code_invalid;
      }
      if (fieldError.fieldName === 'phone') {
        errors.phone = this.props.messages.validation_phone_number_invalid;
      }
    }
  }

  checkRequiredFields(fieldError, errors) {
    if (fieldError.reason === 'field required') {
      if (fieldError.fieldName === 'firstName') {
        errors.firstName = this.props.messages.validation_first_name_required;
      }
      if (fieldError.fieldName === 'lastName') {
        errors.lastName = this.props.messages.validation_last_name_required;
      }
      if (fieldError.fieldName === 'gender') {
        errors.gender = this.props.messages.validation_gender_required;
      }
      if (fieldError.fieldName === 'dob') {
        errors.dob = this.props.messages.validation_dob_required;
      }
      if (fieldError.fieldName === 'password') {
        errors.password = this.props.messages.validation_password_required;
      }
    }
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.validationErrors || Array.isArray(error)) {
        const fieldErrors = error.errors || error;
        this.props.logger.debug('map errors - validation errors', fieldErrors);
        fieldErrors.forEach((fieldError) => {
          if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
            this.checkRequiredFields(fieldError, errors);
            this.checkInvalidFields(fieldError, errors);
          }
        });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.validationEmailInUse) {
        errors.email = this.props.messages.validation_email_inuse;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidPassword) {
        errors.password = this.props.messages.validation_password_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidParameter) {
        this.props.showErrorModal(this.props.messages.my_profile_update_error);
      } else if (error.errorCode === awsdk.AWSDKErrorCode.dependentOverage) {
        errors.dob = this.context.intl.formatMessage({ id: 'validation_dob_overage' }, { age: this.props.sdk.getSystemConfiguration().loginAgeRestriction });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }
  render() {
    const properties = {
      countries: this.state.countries,
      isMultiCountry: this.isMultiCountry,
      currentConsumer: this.props.activeConsumer,
      dobForDisplay: this.props.activeConsumer.dob,
      isFieldProtected: this.isFieldProtected,
      consumerMiddleNameHandling: this.consumerMiddleNameHandling,
      existingShippingAddress: this.state.existingShippingAddress,
      canSubmitPersonalInfo: this.canSubmitPersonalInfo.bind(this),
      canSubmitShippingAddress: this.canSubmitShippingAddress.bind(this),
      setShippingAddressInputs: this.setShippingAddressInputs.bind(this),
      isEditIdentification: this.state.isEditIdentification,
      isEditPersonalInfo: this.state.isEditPersonalInfo,
      isEditShippingAddress: this.state.isEditShippingAddress,
      isEditCredentials: this.state.isEditCredentials,
      isEditReminders: this.state.isEditReminders,
      isEditResidence: this.state.isEditResidence,
      isEditSystemPreferences: this.state.isEditSystemPreferences,
      toggleSection: this.toggleSection.bind(this),
    };

    const myProfileAccountLinks = this.linkAll();
    myProfileAccountLinks.firstName.check(x => !this.state.modified.firstName || x, this.props.messages.validation_first_name_required);
    myProfileAccountLinks.lastName.check(x => !this.state.modified.lastName || x, this.props.messages.validation_last_name_required);
    myProfileAccountLinks.dob.check(x => !this.state.modified.dob || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    myProfileAccountLinks.confirmPassword.check(x => (!this.state.modified.confirmPassword || x.length === 0) || x === this.state.password, this.props.messages.validation_confirm_password_no_match);
    myProfileAccountLinks.legalResidence.check(x => !this.isMultiCountry || !this.state.modified.legalResidence || x.countryCode, this.props.messages.validation_legal_resindence_country_required);
    myProfileAccountLinks.phone.check(x => !this.state.modified.phone || x, this.props.messages.validation_phone_required);
    myProfileAccountLinks.legalResidence.check(x => !this.state.modified.legalResidence || x.stateCode, this.props.messages.validation_legal_resindence_state_required);
    myProfileAccountLinks.email.check(x => !this.state.modified.email || x, this.props.messages.validation_email_required)
      .check(x => !this.state.modified.email || isValidEmail(x), this.props.messages.validation_email_invalid);
    myProfileAccountLinks.homeZipCode.check(x => !this.state.homeZipCode || !this.state.modified.homeZipCode || isValidZipCode(x), this.props.messages.validation_primary_address_zip_code_invalid);

    return (
      <MyProfileAccountComponent key="myProfileAccountComponent" updateMyProfileAccount={this.updateMyProfileAccount.bind(this)} valueLinks={myProfileAccountLinks} {...this.props} {...properties} />
    );
  }
}
MyProfileAccountContainer.contextTypes = {
  intl: PropTypes.object,
};
MyProfileAccountContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileAccountContainer.defaultProps = {};
export default MyProfileAccountContainer;
