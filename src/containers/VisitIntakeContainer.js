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

import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import React from 'react';
import { Route } from 'react-router-dom';

import ValueLinkedContainer from './ValueLinkedContainer';
import { isValidEmail, isValidPhoneNumber, isUnsetOrEmptyString, shouldUseWebRTC } from '../components/Util';

import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitIntake from '../components/visit/intake/VisitIntakeComponent';
import TytoDeviceStepper from '../components/visit/tytoDevice/TytoDeviceStepperComponent';

class VisitIntakeContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('VisitIntakeContainer: props', props);
    this.provider = props.location.state.provider ? awsdk.AWSDKFactory.restoreProviderDetails(props.location.state.provider) : null;
    this.appointment = props.location.state.appointment ? awsdk.AWSDKFactory.restoreAppointment(props.location.state.appointment) : null;
    this.specialty = props.location.state.specialty ? awsdk.AWSDKFactory.restoreSpecialty(props.location.state.specialty) : null;
    this.practice = props.location.state.practice ? awsdk.AWSDKFactory.restorePractice(props.location.state.practice) : this.provider.practice;
    this.providerOrSpecialty = this.provider ? this.provider : this.specialty;
    this.isMultipleParticipantsEnabled = this.props.sdk.getSystemConfiguration().multipleVideoParticipantsEnabled;
    this.maxVideoInvites = props.sdk.getSystemConfiguration().maxVideoInvites;
    this.availableModalities = this.appointment ? [this.appointment.modality] : this.practice.availableModalities;

    this.state = {
      errors: [],
      modified: [],
      topicOther: '',
      callbackNumber: props.activeConsumer.phone ? props.activeConsumer.phone : '',
      shareHealthSummary: false,
      disclaimerAcknowledged: false,
      visitContext: null,
      speedPassModalActive: false,
      speedPass: null,
      guestsToInvite: [],
      visitGuestEmail: '',
      showAddGuestInput: false,
      maxGuestInvited: this.maxVideoInvites === 0 || false,
      visitModalityType: this.availableModalities[0].modalityType,
      feedbackAnswer: '',
      useTytoDeviceDuringVisit: false,
      isTytoDevicePaired: false
    };

  }

  setTytoDevicePairedStatus(isPaired) {
    this.setState({ isTytoDevicePaired: isPaired });
  }

  setVisitIntakeForm(visitContextResponse, tytoResponse) {
    const visitContext = visitContextResponse;
    this.props.logger.debug('Visit Context: ', visitContext);
    const state = {};
    state.visitContext = visitContext;
    const triageQuestions = visitContext.triageQuestions || [];
    const topics = visitContext.topics || [];

    triageQuestions.forEach((question, idx) => {
      state[`triageQuestions${idx}`] = '';
    });

    topics.forEach((topic, idx) => {
      state[`topics${idx}`] = '';
    });
    state.isTytoDevicePaired =
      tytoResponse.devicePairingStatus.toString() === awsdk.AWSDKDevicePairingStatusEnum.PAIRED;

    const visitIntakeFormPreviousData =
      sessionStorage.getItem('visitIntakeFormPreviousData');

    if (visitIntakeFormPreviousData !== null) {
      const formPreviousData =
        JSON.parse(visitIntakeFormPreviousData)

      state.topicOther = formPreviousData.topicOther;
      state.callbackNumber = formPreviousData.callbackNumber;
      state.shareHealthSummary = formPreviousData.shareHealthSummary;
      state.disclaimerAcknowledged = formPreviousData.disclaimerAcknowledged;
      state.guestsToInvite = formPreviousData.guestsToInvite;
      state.visitGuestEmail = formPreviousData.visitGuestEmail;
      state.showAddGuestInput = formPreviousData.visitGuestEmail.length > 0;
      state.feedbackAnswer = formPreviousData.feedbackAnswer;
      state.useTytoDeviceDuringVisit = formPreviousData.useTytoDeviceDuringVisit;

      formPreviousData.triageQuestionsSavedAnswers.forEach((data, idx) => {
        state[`triageQuestions${idx}`] = data;
      });

      formPreviousData.topicsSavedAnswers.forEach((data, idx) => {
        state[`topics${idx}`] = data;
      });
      sessionStorage.removeItem('visitIntakeFormPreviousData')
    }
    this.setState(state);

  }

  getVisitContext(consumer, providerOrSpecialty, appointment) {
    if (appointment) {
      return this.props.sdk.visitService.getVisitContextForAppointment(appointment);
    }
    return this.props.sdk.visitService.getVisitContext(consumer, providerOrSpecialty);
  }

  componentDidMount() {
    this.props.enableSpinner();
    const getVisitContextPromise = this.getVisitContext(this.props.activeConsumer, this.providerOrSpecialty, this.appointment);
    const getDevicePairingStatusPromise =
      this.props.sdk.deviceLiveStreamService.getDevicePairingStatus(this.props.consumer, awsdk.AWSDKDeviceLiveStreamType.TYTO_LIVESTREAM)

    Promise.all([getVisitContextPromise, getDevicePairingStatusPromise])
      .then((results) => {
        this.setVisitIntakeForm(results[0], results[1]);
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => {
        this.props.disableSpinner();
        const ignoreSpeedPass = this.props.location.state.ignoreSpeedPass ? (this.props.location.state.ignoreSpeedPass === 'true') : false;
        const canProceedToSpeedPass = this.state.visitContext && (!ignoreSpeedPass) &&
          (!this.state.visitContext.hasAppointment && this.providerOrSpecialty != null && this.props.sdk.getSystemConfiguration().speedPassActive);
        if (canProceedToSpeedPass) {
          this.getSpeedPass();
        }
      });
  }

  getSpeedPass() {
    this.props.enableSpinner();
    this.props.logger.info('VisitIntakeContainer request speedPass');
    this.props.sdk.visitService.getSpeedPass(this.props.activeConsumer, this.providerOrSpecialty)
      .then((speedPass) => {
        this.setState({ speedPassModalActive: true, speedPass });
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  continueSpeedPass() {
    this.props.enableSpinner();
    let visit = null;
    this.props.sdk.visitService.createVisitFromSpeedPass(this.state.speedPass)
      .then((v) => {
        visit = v;
        this.props.logger.info('Visit: ', visit);
        this.setState({ speedPassModalActive: false });
        return this.processVisit(visit, true);
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  cancelSpeedPass(e) {
    if (e) e.preventDefault();
    this.setState({ speedPassModalActive: false });
  }

  submitIntake(e) {
    e.preventDefault();

    sessionStorage.removeItem('visitIntakeFormPreviousData')
    if (this.state.useTytoDeviceDuringVisit && !this.state.isTytoDevicePaired) {
      this.handleTytoDeviceIntegration();
      return;
    }

    const errors = {};
    if (isUnsetOrEmptyString(this.state.callbackNumber)) {
      errors.callbackNumber = this.props.messages.validation_phone_number_required;
    } else if (!isValidPhoneNumber(this.state.callbackNumber)) {
      errors.callbackNumber = this.props.messages.validation_phone_number_invalid;
    } else if (this.state.visitModalityType === awsdk.AWSDKVisitModalityType.PHONE && !this.appointment && isUnsetOrEmptyString(this.state.feedbackAnswer)) {
      errors.feedbackAnswer = this.props.messages.validation_feedback_answer_required;
    }
    if (!this.state.disclaimerAcknowledged) {
      errors.disclaimerAcknowledged = this.props.messages.validation_disclaimer_not_acknowledged;
    }
    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }


    this.state.visitContext.modalityType = this.state.visitModalityType;
    this.state.visitContext.otherTopic = this.state.topicOther;
    this.state.visitContext.callbackNumber = this.state.callbackNumber;
    this.state.visitContext.shareHealthSummary = this.state.shareHealthSummary;
    const triageQuestions = this.state.visitContext.triageQuestions || [];
    const topics = this.state.visitContext.topics || [];
    triageQuestions.forEach((question, idx) => {
      this.state.visitContext.triageQuestions[idx].answer = this.state[`triageQuestions${idx}`];
    });

    topics.forEach((topic, idx) => {
      this.state.visitContext.topics[idx].selected = this.state[`topics${idx}`];
    });

    this.props.enableSpinner();
    this.props.sdk.visitService.createOrUpdateVisit(this.state.visitContext)
      .then((visit) => {
        this.props.logger.info('Visit: ', visit);
        if (this.state.guestsToInvite.length > 0 && this.state.visitModalityType !== awsdk.AWSDKVisitModalityType.PHONE) {
          visit.guestInvitationEmails = this.state.guestsToInvite;
        }

        if (this.state.feedbackAnswer && this.state.visitModalityType === awsdk.AWSDKVisitModalityType.PHONE) {
          this.props.sdk.visitService.addFeedback(visit, this.state.visitContext.consumerFeedbackQuestion.questionText, this.state.feedbackAnswer)
            .catch(error => this.mapError(error));
        }

        return this.processVisit(visit, false);
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  // all errors are passed to the caller of processVisit and expected to be handled accordingly
  processVisit(visit, speedPassActive) {
    // first thing to do is wait for cost calculation
    return this.props.sdk.visitService.waitForVisitCostCalculationToFinish(visit)
      .then((calculatedVisit) => {
        this.props.logger.info('Visit: ', calculatedVisit);

        if (!calculatedVisit.cost.proposedCouponCode) {
          return Promise.resolve(calculatedVisit);
        }

        // we either send back the visit with a calculated cost as is, or apply whatever proposedCouponCode first
        // then send back the visit with the updated cost
        return this.props.sdk.visitService.applyCouponCode(calculatedVisit, calculatedVisit.cost.proposedCouponCode)
          .then((visitCost) => {
            calculatedVisit.cost = visitCost;
            return calculatedVisit;
          });
      })
      .then((visitWithCost) => {
        this.props.logger.info('Visit : ', visitWithCost);

        // if we need payment info, send them to the payment screen
        if (!visitWithCost.cost.zeroCostVisit) {
          this.props.history.replace('/visit/cost', { visit: visitWithCost.toString(), speedPassActive });
          return Promise.resolve();
        }

        // if we're first available + zeroCostVisit, skip payment and go straight to the ffa screen
        if (this.specialty != null) {
          this.props.history.push('/visit/firstAvailable', { visit: visitWithCost.toString() });
          return Promise.resolve();
        }

        // if we're a zeroCostVisit and not first available:
        return this.startVisitAndMoveToWaitingRoom(visitWithCost);
      });
  }

  startVisitAndMoveToWaitingRoom(visit) {
    let visitToSendToWaitingRoom = null;
    return this.props.sdk.visitService.startVisit(visit)
      .then((startedVisit) => {
        this.props.logger.info('Start visit complete', startedVisit);
        visitToSendToWaitingRoom = startedVisit;

        if (!shouldUseWebRTC(startedVisit) && startedVisit.modality.modalityType !== awsdk.AWSDKVisitModalityType.PHONE) {
          this.props.logger.info('Launching TelehealthVideo');
          return this.props.sdk.visitService.launchTelehealthVideo(startedVisit);
        }
        return Promise.resolve(false);
      })
      .then((telehealthVideoLaunched) => {
        this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
        this.props.disableSpinner();
        this.clearState();
        if (visitToSendToWaitingRoom.modality.modalityType === awsdk.AWSDKVisitModalityType.PHONE) {
          this.props.history.replace('/visit/phone/waitingRoom', { visit: visitToSendToWaitingRoom.toString() });
        } else {
          this.props.history.replace('/visit/waitingRoom', { visit: visitToSendToWaitingRoom.toString(), telehealthVideoLaunched });
        }
      });
  }

  toggleShowAddGuest(e) {
    e.preventDefault();
    this.setState(prevState => ({
      showAddGuestInput: !prevState.showAddGuestInput,
    }));
  }

  addGuestEmail(e) {
    if (e) e.preventDefault();
    if (!this.state.maxGuestInvited) { // defensive guard against some code change in component
      const unique = this.state.guestsToInvite.every(email => email.toLowerCase() !== this.state.visitGuestEmail.toLowerCase());
      if (unique) {
        this.state.guestsToInvite.push(this.state.visitGuestEmail);
      }
      const hasReachedCapacity = !(this.state.guestsToInvite.length < this.maxVideoInvites);
      this.setState({ visitGuestEmail: '', modified: { visitGuestEmail: false }, showAddGuestInput: false, maxGuestInvited: hasReachedCapacity });
    }
  }

  removeGuestEmail(e, email) {
    if (e) e.preventDefault();
    const newArray = this.state.guestsToInvite.filter(toInvite => toInvite !== email);
    this.setState({ guestsToInvite: newArray, maxGuestInvited: false });
  }

  clearState() {
    sessionStorage.removeItem('invalidCoupon');
    sessionStorage.removeItem('couponApplied');
    sessionStorage.removeItem('showPaymentMethod');
  }

  handleTytoDeviceIntegration() {

    let visitIntakeFormPreviousData = {
      topicOther: this.state.topicOther,
      callbackNumber: this.state.callbackNumber,
      shareHealthSummary: this.state.shareHealthSummary,
      disclaimerAcknowledged: this.state.disclaimerAcknowledged,
      guestsToInvite: this.state.guestsToInvite,
      visitGuestEmail: this.state.visitGuestEmail,
      showAddGuestInput: this.state.visitGuestEmail.length > 0,
      feedbackAnswer: this.state.feedbackAnswer,
      useTytoDeviceDuringVisit: this.state.useTytoDeviceDuringVisit,
    };

    let triageQuestionsSavedAnswers = [];
    const triageQuestions = this.state.visitContext.triageQuestions || [];
    triageQuestions.forEach((question, idx) => {
      triageQuestionsSavedAnswers[idx] = this.state[`triageQuestions${idx}`]
    });
    visitIntakeFormPreviousData.triageQuestionsSavedAnswers = triageQuestionsSavedAnswers;

    let topicsSavedAnswers = [];
    const topics = this.state.visitContext.topics || [];
    topics.forEach((topic, idx) => {
      topicsSavedAnswers[idx] = this.state[`topics${idx}`];
    });
    visitIntakeFormPreviousData.topicsSavedAnswers = topicsSavedAnswers;

    sessionStorage.setItem('visitIntakeFormPreviousData', JSON.stringify(visitIntakeFormPreviousData));
    this.props.history.push('/visit/intake/tytoDeviceIntegration', { ...this.props.location.state });
  }

  setUseTytoDeviceDuringVisit(useTytoDeviceDuringVisit) {
    this.setState({ useTytoDeviceDuringVisit });
  }

  setVisitModalityType(visitModalityType) {
    this.setState({ visitModalityType });
  }

  mapError(error) {
    const errors = {};
    const { formatMessage } = this.context.intl;
    if (error != null) {
      this.props.logger.debug('map error', error);
      switch (error.errorCode) {
        case awsdk.AWSDKErrorCode.validationErrors:
          {
            const fieldErrors = error.errors;
            this.props.logger.debug('map errors - validation errors', fieldErrors);
            fieldErrors.forEach((fieldError) => {
              if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
                if (fieldError.fieldName === 'callbackNumber' && fieldError.reason === 'field required') {
                  errors.callbackNumber = this.props.messages.validation_first_name_required;
                }
              }
            });
          }
          break;
        case awsdk.AWSDKErrorCode.consumerNotEligibleForSpeedPass:
          this.setState({ speedPassModalActive: false });
          break;
        case awsdk.AWSDKErrorCode.visitConsumerCallbackInvalid:
          this.props.showErrorModal(this.props.messages.validation_phone_number_invalid);
          break;
        case awsdk.AWSDKErrorCode.authenticationSessionExpired:
          this.props.history.push('/sessionExpired');
          break;
        case awsdk.AWSDKErrorCode.consumerAlreadyInVisit:
          this.props.showErrorModal(this.props.messages.visit_intake_consumer_already_in_visit);
          break;
        case awsdk.AWSDKErrorCode.pollingTimeout:
          this.props.showErrorModal(this.props.messages.pollingTimeout_exceeded);
          break;
        case awsdk.AWSDKErrorCode.providerNotLicensedForConsumerLocation:
          this.props.showErrorModal(this.props.messages.visit_provider_not_licensed_in_consumer_location);
          this.props.history.goBack();
          break;
        case awsdk.AWSDKErrorCode.providerNotFound:
          this.props.showErrorModal(
            this.practice.specialtyName
              ?
              formatMessage({ id: 'visit_providers_not_found' }, { practice: this.practice.name, specialty: this.practice.specialtyName })
              :
              this.props.messages.first_available_provider_search_exhausted_title);
          break;
        case awsdk.AWSDKErrorCode.requiredAddressMissing:
          this.props.showErrorModal(this.props.messages.validation_required_address_missing);
          break;
        default:
          this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  render() {
    const visitIntakeLinks = this.linkAll();
    visitIntakeLinks.callbackNumber.check(x => !this.state.modified.callbackNumber || !isUnsetOrEmptyString(x), this.props.messages.validation_phone_number_required);
    visitIntakeLinks.callbackNumber.check(x => !this.state.modified.callbackNumber || isValidPhoneNumber(x), this.props.messages.validation_phone_number_invalid);
    visitIntakeLinks.disclaimerAcknowledged.check(x => !this.state.modified.disclaimerAcknowledged || x, this.props.messages.validation_disclaimer_not_acknowledged);
    visitIntakeLinks.visitGuestEmail.check(x => !this.state.modified.visitGuestEmail || isValidEmail(x), this.props.messages.validation_email_invalid);
    const isPhoneVisit = this.state.visitModalityType === awsdk.AWSDKVisitModalityType.PHONE;
    const showFeedbackQuestions = this.state.visitContext && this.state.visitContext.consumerFeedbackQuestion && this.state.visitContext.consumerFeedbackQuestion.show;
    visitIntakeLinks.feedbackAnswer.check(x => !isPhoneVisit || (isPhoneVisit && this.appointment) || !showFeedbackQuestions || !this.state.modified.feedbackAnswer || !isUnsetOrEmptyString(x), this.props.messages.validation_feedback_answer_required);
    const isValidGuestEmail = visitIntakeLinks.visitGuestEmail.error == null && this.state.modified.visitGuestEmail;

    const properties = {
      speedPassModalActive: this.state.speedPassModalActive,
      speedPass: this.state.speedPass,
      continueSpeedPass: this.continueSpeedPass.bind(this),
      cancelSpeedPass: this.cancelSpeedPass.bind(this),
      addGuestEmail: this.addGuestEmail.bind(this),
      isMultipleVideoParticipantsEnabled: this.isMultipleParticipantsEnabled,
      guestsToInvite: this.state.guestsToInvite,
      showAddGuestInput: this.state.showAddGuestInput,
      toggleShowAddGuest: this.toggleShowAddGuest.bind(this),
      removeGuestEmail: this.removeGuestEmail.bind(this),
      isValidGuestEmail,
      maxGuestInvited: this.state.maxGuestInvited,
      visitModalityType: this.state.visitModalityType,
      setVisitModalityType: this.setVisitModalityType.bind(this),
      availableModalities: this.availableModalities,
      feedbackAnswer: this.state.feedbackAnswer,
      isPhoneVisit,
      appointment: this.appointment,
      deviceIntegrationMode: this.practice.deviceIntegrationMode,
      useTytoDeviceDuringVisit: this.state.useTytoDeviceDuringVisit,
      isTytoDevicePaired: this.state.isTytoDevicePaired,
      setUseTytoDeviceDuringVisit: this.setUseTytoDeviceDuringVisit.bind(this),
      changeUserWiFiNetwork: this.handleTytoDeviceIntegration.bind(this),
    };
    return (
      <React.Fragment>
        <Route path={`${this.props.match.url}/start`} render={() => (
          (this.state.visitContext != null &&
            <VisitHeader matchPath="intake" id="visitIntake" icon='intake' title={this.props.messages.visit_before_you_begin}>
              <VisitIntake key="visitIntakeBody" submitIntake={this.submitIntake.bind(this)} visitContext={this.state.visitContext} valueLinks={visitIntakeLinks} {...properties} {...this.props} />
            </VisitHeader>
          )
        )} />
        <Route path={`${this.props.match.url}/tytoDeviceIntegration`} render={() => (
          (this.state.visitContext != null &&
            <VisitHeader id="visitTytoDevice" icon='tyto' title={this.props.messages.amwell_tyto_device_deviceSetupHeader}>
              <TytoDeviceStepper {...this.props} setTytoDevicePairedStatus={this.setTytoDevicePairedStatus.bind(this)} />
            </VisitHeader>)
        )} />
      </React.Fragment>
    );
  }
}

VisitIntakeContainer.contextTypes = {
  intl: PropTypes.object,
};

VisitIntakeContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitIntakeContainer.defaultProps = {};
export default VisitIntakeContainer;
