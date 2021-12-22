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

import MyProfileDependentsComponent from '../components/myprofile/MyProfileDependentsComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { isValidDate, isValidEmail } from '../components/Util';

class MyProfileDependentsContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfileDependentsContainer: props', props);
    this.enableEditing = this.enableEditing.bind(this);
    this.enableAdding = this.enableAdding.bind(this);
    this.disableEditmode = this.disableEditmode.bind(this);
    this.submitDependent = this.submitDependent.bind(this);
    this.toggleAddOrLinkDependentModal = this.toggleAddOrLinkDependentModal.bind(this);
    this.toggleModalThenTakeAction = this.toggleModalThenTakeAction.bind(this);
    this.toggleLinkDependentModal = this.toggleLinkDependentModal.bind(this);
    this.disableRequestConfirmation = this.disableRequestConfirmation.bind(this);
    this.toggleAddChildModal = this.toggleAddChildModal.bind(this);
    this.sendLinkDependentRequest = this.sendLinkDependentRequest.bind(this);
    this.chooseCreateDependent = this.chooseCreateDependent.bind(this);
    this.chooseLinkDependent = this.chooseLinkDependent.bind(this);
    this.enableChoiceModal = this.enableChoiceModal.bind(this);
    this.hideShowAccessRequest = this.hideShowAccessRequest.bind(this);
    this.enableShowAccessRequest = this.enableShowAccessRequest.bind(this);
    this.acceptAccessRequest = this.acceptAccessRequest.bind(this);
    this.declineAccessRequest = this.declineAccessRequest.bind(this);
    this.addDependentWithoutCheck = this.addDependentWithoutCheck.bind(this);
    this.consumerMiddleNameHandling = this.props.sdk.getSystemConfiguration().consumerMiddleNameHandling;
    this.formError = false;
    this.state = {
      selectedDependent: null,
      editMode: null,
      errors: [],
      modified: [],
      firstName: '',
      middleNameOrInitial: '',
      lastName: '',
      gender: '',
      genderIdentity: '',
      dob: {
        year: '',
        month: '',
        day: '',
      },
      addOrLinkDependentModalEnabled: false,
      selectedCreateDependent: false,
      selectedLinkDependent: false,
      linkedParentEmail: '',
      linkDependentModalEnabled: false,
      popUpMode: null,
      linkRequestSentModalEnabled: false,
      addChildModalEnabled: false,
      performDependentCheck: true,
      accessRequest: null,
      showAccessRequest: false,
    };
  }

  componentDidMount() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.getDependentAccessRequest(this.props.activeConsumer)
      .then((accessRequest) => {
        const state = {};
        const requestedDependents = (accessRequest && accessRequest.dependents) || [];
        requestedDependents.forEach((deps) => {
          state[deps.id.persistentId] = '';
        });
        state.accessRequest = accessRequest;
        this.setState(state);
      })
      .catch((error) => {
        this.props.logger.error('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  enableEditing(selectedDependent) {
    let middleNameOrInitial = '';
    if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
      middleNameOrInitial = selectedDependent.middleName;
    }
    if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
      middleNameOrInitial = selectedDependent.middleInitial;
    }

    this.setFormFields(selectedDependent.firstName,
      middleNameOrInitial,
      selectedDependent.lastName,
      selectedDependent.genderIdentity ? selectedDependent.genderIdentity.key : '',
      selectedDependent.gender,
      selectedDependent.dob.getUTCFullYear(),
      selectedDependent.dob.getUTCMonth() + 1,
      selectedDependent.dob.getUTCDate());
    this.setState({ editMode: 'edit', selectedDependent, modified: [], errors: [] });
  }

  enableAdding() {
    this.setFormFields('', '', '', '', '', '', '', '');
    this.setState({ editMode: 'add', popUpMode: null, selectedDependent: null, modified: [], errors: [] });
  }

  enableLinkModal() {
    this.setState({ popUpMode: 'link', linkDependentModalEnabled: true, linkedParentEmail: '', modified: [], errors: [] });
  }

  enableChoiceModal() {
    this.setState({ popUpMode: 'choose', addOrLinkDependentModalEnabled: true, selectedCreateDependent: false, selectedLinkDependent: false });
  }

  hideShowAccessRequest() {
    this.setState({ showAccessRequest: false });
    this.props.hideAccessRequestOnBell();
  }
  enableShowAccessRequest() {
    this.setState({ showAccessRequest: true });
  }
  sendLinkDependentRequest() {
    if (this.state.popUpMode === 'link') {
      this.toggleLinkDependentModal();
    } else {
      this.toggleAddChildModal();
    }
    this.props.enableSpinner();
    this.props.sdk.consumerService.requestDependentAccess(this.props.activeConsumer, this.state.linkedParentEmail)
      .then(() => {
        this.setState({ popUpMode: 'requestConfirmation', linkRequestSentModalEnabled: true, editMode: null });
      })
      .catch((error) => {
        this.props.logger.error('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  toggleModalThenTakeAction() {
    this.toggleAddOrLinkDependentModal();
    if (this.state.selectedCreateDependent) {
      this.enableAdding();
    } else {
      this.enableLinkModal();
    }
  }

  toggleLinkDependentModal() {
    this.setState(prevState => ({
      linkDependentModalEnabled: !prevState.linkDependentModalEnabled,
    }));
  }

  toggleLinkRequestSentModal() {
    this.setState(prevState => ({
      linkRequestSentModalEnabled: !prevState.linkRequestSentModalEnabled,
    }));
  }

  toggleAddOrLinkDependentModal() {
    this.setState(prevState => ({
      addOrLinkDependentModalEnabled: !prevState.addOrLinkDependentModalEnabled,
    }));
  }

  toggleAddChildModal() {
    this.setState(prevState => ({
      addChildModalEnabled: !prevState.addChildModalEnabled,
      performDependentCheck: true,
    }));
  }

  resetAccessRequest() {
    this.hideShowAccessRequest();
    this.setState({ accessRequest: null });
  }

  disableEditmode() {
    this.setState({ editMode: null, selectedDependent: null });
  }

  disableRequestConfirmation() {
    this.toggleLinkRequestSentModal();
    this.setState({ popUpMode: null });
  }

  chooseCreateDependent() {
    this.setState({ selectedCreateDependent: true, selectedLinkDependent: false });
  }

  chooseLinkDependent() {
    this.setState({ selectedCreateDependent: false, selectedLinkDependent: true });
  }

  setFormFields(firstName, middleNameOrInitial, lastName, genderIdentity, gender, year, month, day) {
    this.setState({
      firstName,
      middleNameOrInitial,
      lastName,
      genderIdentity,
      gender,
      dob: {
        year,
        month,
        day,
      },
    });
  }

  declineAccessRequest() {
    this.hideShowAccessRequest();
    this.props.enableSpinner();
    this.props.sdk.consumerService.declineDependentAccessRequest(this.props.activeConsumer, this.state.accessRequest)
      .then(() => this.resetAccessRequest())
      .catch((error) => {
        this.props.logger.error('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  enableAddModal() {
    this.setState({ popUpMode: 'add', addChildModalEnabled: true, performDependentCheck: false });
  }

  acceptAccessRequest() {
    this.hideShowAccessRequest();
    this.props.enableSpinner();
    const requestedDependents = this.state.accessRequest.dependents;
    const selectedDependents = requestedDependents.filter(dep => this.state[dep.id.persistentId]);
    this.props.sdk.consumerService.acceptDependentAccessRequest(this.props.activeConsumer, this.state.accessRequest, selectedDependents)
      .then(() => {
        this.resetAccessRequest();
        return this.props.sdk.consumerService.getDependents(this.props.activeConsumer);
      })
      .then((dependents) => {
        this.props.updateDependentsCallback(dependents);
      })
      .catch((error) => {
        this.props.logger.error('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  submitDependent() {
    // WS-3050
    // Gender Identity is a required field, but the backend api does not require it for backward compatibility reasons,
    // so we need to validate the entire form before we submit.
    if (this.props.genderSupportEnabled) {
      const valueLinks = this.linkAll();
      const genderErrorMsg = this.props.genderSupportEnabled ? this.props.messages.validation_biologicalSex_required : this.props.messages.validation_gender_required;
      valueLinks.firstName.check(x => x, this.props.messages.validation_first_name_required);
      valueLinks.lastName.check(x => x, this.props.messages.validation_last_name_required);
      valueLinks.gender.check(x => x, genderErrorMsg);
      valueLinks.genderIdentity.check(x => x, this.props.messages.validation_gender_required);
      valueLinks.dob.check(x => x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
        .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
      this.checkFormError(valueLinks);
      valueLinks.linkedParentEmail.check(x => x, this.props.messages.validation_email_required)
        .check(x => isValidEmail(x), this.props.messages.validation_email_invalid);

      if (this.formError) {
        const errors = {};
        Object.keys(valueLinks).forEach(key => {if (valueLinks[key].error) errors[key] = valueLinks[key].error});
        this.setState({ errors });
      }
    }

    if (!this.formError) {
      if (this.state.editMode === 'add') {
        this.addNewDependent();
      } else if (this.state.editMode === 'edit') {
        this.updateExistingDependent();
      }
    }
  }

  addDependentWithoutCheck() {
    this.setState(prevState => ({ addChildModalEnabled: !prevState.addChildModalEnabled, editMode: null }));
    this.addNewDependent();
  }

  addNewDependent() {
    const dependentRegistration = this.props.sdk.consumerService.newDependentRegistration();
    this.populateDependentPayload(dependentRegistration);
    dependentRegistration.performDependentCheck = this.state.performDependentCheck;
    this.handleAddOrUpdatePromise(this.props.sdk.consumerService.registerDependent(this.props.consumer, dependentRegistration));
  }

  updateExistingDependent() {
    const dependentUpdate = this.props.sdk.consumerService.newDependentUpdate();
    this.populateDependentPayload(dependentUpdate);
    this.handleAddOrUpdatePromise(this.props.sdk.consumerService.updateDependent(this.state.selectedDependent, dependentUpdate));
  }

  handleAddOrUpdatePromise(addOrUpdatePromise) {
    this.props.enableSpinner();
    addOrUpdatePromise
      .then(() => this.props.sdk.consumerService.getUpdatedConsumer(this.props.consumer))
      .then(consumer => this.props.consumerUpdated(consumer))
      .then(() => this.props.sdk.consumerService.getDependents(this.props.activeConsumer))
      .then(dependents => this.props.updateDependentsCallback(dependents))
      .then(() => this.disableEditmode())
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  populateDependentPayload(payload) {
    payload.firstName = this.state.firstName;
    payload.lastName = this.state.lastName;
    payload.gender = this.state.gender;
    payload.genderIdentityKey = this.state.genderIdentity;

    if (this.state.dob.year !== '' && this.state.dob.month !== '' && this.state.dob.day !== '') {
      payload.dob = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
    }

    const middleNameOrInitial = this.state.middleNameOrInitial ? this.state.middleNameOrInitial : '';
    if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
      payload.middleName = middleNameOrInitial;
    } else if (this.consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
      payload.middleInitial = middleNameOrInitial;
    }
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
              const genderErrorMsg = this.props.genderSupportEnabled ? this.props.messages.validation_biologicalSex_required : this.props.messages.validation_gender_required;
              errors.gender = genderErrorMsg;
            } else if (fieldError.fieldName === 'dob' && fieldError.reason === 'field required') {
              errors.dob = this.props.messages.validation_dob_required;
            } else if (fieldError.fieldName === 'dob' && fieldError.reason === 'invalid format') {
              errors.dob = this.props.messages.validation_dob_invalid;
            } else if (fieldError.fieldName === 'firstName' && fieldError.reason === 'invalid format') {
              errors.firstName = this.props.messages.validation_first_name_invalid;
            } else if (fieldError.fieldName === 'lastName' && fieldError.reason === 'invalid format') {
              errors.lastName = this.props.messages.validation_last_name_invalid;
            } else if (fieldError.fieldName === 'middleName' && fieldError.reason === 'invalid format') {
              errors.middleNameOrInitial = this.props.messages.validation_middle_name_invalid;
            } else if (fieldError.fieldName === 'middleInitial' && fieldError.reason === 'invalid format') {
              errors.middleNameOrInitial = this.props.messages.validation_middle_initial_invalid;
            }
          }
        });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else if (error.errorCode === awsdk.AWSDKErrorCode.dependentOverage) {
        errors.dob = this.context.intl.formatMessage({ id: 'validation_dob_overage' }, { age: this.props.sdk.getSystemConfiguration().loginAgeRestriction });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.dependentDobInFuture) {
        errors.dob = this.props.messages.validation_dependent_dob_in_future;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.dependentMatchFound) {
        this.enableAddModal();
      } else {
        this.props.showErrorModal(error.message);
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  checkFormError(valueLinks) {
    this.formError = Boolean(valueLinks.firstName.error || valueLinks.lastName.error || valueLinks.gender.error || (this.props.genderSupportEnabled && valueLinks.genderIdentity.error) || valueLinks.dob.error);
  }

  render() {
    const props = this.props;
    const valueLinks = this.linkAll();
    const genderErrorMsg = this.props.genderSupportEnabled ? this.props.messages.validation_biologicalSex_required : this.props.messages.validation_gender_required;
    valueLinks.firstName.check(x => !this.state.modified.firstName || x, this.props.messages.validation_first_name_required);
    valueLinks.lastName.check(x => !this.state.modified.lastName || x, this.props.messages.validation_last_name_required);
    valueLinks.gender.check(x => !this.state.modified.gender || x, genderErrorMsg);
    if (this.props.genderSupportEnabled) valueLinks.genderIdentity.check(x => !this.state.modified.genderIdentity || x, this.props.messages.validation_gender_required);
    valueLinks.dob.check(x => !this.state.modified.dob || x.day || x.month > 0 || x.year, this.props.messages.validation_dob_required)
      .check(x => !this.state.modified.dob || isValidDate(x, false, false), this.props.messages.validation_dob_invalid);
    this.checkFormError(valueLinks);
    valueLinks.linkedParentEmail.check(x => !this.state.modified.linkedParentEmail || x, this.props.messages.validation_email_required)
      .check(x => !this.state.modified.linkedParentEmail || isValidEmail(x), this.props.messages.validation_email_invalid);

    const properties = {
      selectedDependent: this.state.selectedDependent,
      enableAdding: this.enableAdding,
      enableEditing: this.enableEditing,
      disableEditMode: this.disableEditmode,
      submitDependent: this.submitDependent,
      editMode: this.state.editMode,
      formError: this.formError,
      consumerMiddleNameHandling: this.consumerMiddleNameHandling,
      valueLinks,
      toggleAddOrLinkDependentModal: this.toggleAddOrLinkDependentModal,
      chooseCreateDependent: this.chooseCreateDependent,
      chooseLinkDependent: this.chooseLinkDependent,
      addOrLinkDependentModalEnabled: this.state.addOrLinkDependentModalEnabled,
      selectedCreateDependent: this.state.selectedCreateDependent,
      toggleModalThenTakeAction: this.toggleModalThenTakeAction,
      toggleLinkDependentModal: this.toggleLinkDependentModal,
      linkDependentModalEnabled: this.state.linkDependentModalEnabled,
      sendLinkDependentRequest: this.sendLinkDependentRequest,
      popUpMode: this.state.popUpMode,
      linkRequestSentModalEnabled: this.state.linkRequestSentModalEnabled,
      enableChoiceModal: this.enableChoiceModal,
      addChildModalEnabled: this.state.addChildModalEnabled,
      selectedLinkDependent: this.state.selectedLinkDependent,
      toggleAddChildModal: this.toggleAddChildModal,
      accessRequest: this.state.accessRequest,
      showAccessRequest: this.state.showAccessRequest,
      hideShowAccessRequest: this.hideShowAccessRequest,
      enableShowAccessRequest: this.enableShowAccessRequest,
      acceptAccessRequest: this.acceptAccessRequest,
      declineAccessRequest: this.declineAccessRequest,
      disableRequestConfirmation: this.disableRequestConfirmation,
      addDependentWithoutCheck: this.addDependentWithoutCheck,
    };

    return (
      <MyProfileDependentsComponent key="myProfileDependentDetailComponent" {...props} {...properties} />
    );
  }
}
MyProfileDependentsContainer.contextTypes = {
  intl: PropTypes.object,
};
MyProfileDependentsContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  consumerUpdated: PropTypes.func.isRequired,
};
MyProfileDependentsContainer.defaultProps = {};
export default MyProfileDependentsContainer;
