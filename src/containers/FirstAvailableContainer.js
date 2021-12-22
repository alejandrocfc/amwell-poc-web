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

import awsdk from 'awsdk';
import React from 'react';
import PropTypes from 'prop-types';
import FirstAvailableComponent from '../components/firstAvailable/FirstAvailableComponent';
import { shouldUseWebRTC } from '../components/Util';

class FirstAvailableContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('FirstAvailableContainer: props', props);
    if (this.props.location.state) {
      this.visit = this.props.location.state.visit ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit) : null;
    }
    this.state = {
      isCancelModalOpen: false,
      isSearchCanceled: false,
      cancelMessage: props.messages.cancel_visit_txt,
      isSurescriptsErrorModalOpen: false,
    };
  }

  cancelFirstAvailableSearch(e) {
    if (e) e.preventDefault();
    this.props.enableSpinner();
    this.props.logger.debug('Canceling the first-available search');
    this.props.sdk.visitService.cancelFirstAvailableSearch(this.props.activeConsumer).then((result) => {
      this.props.logger.debug('First-available search was canceled with result: ', result);
      this.setState({ isSearchCanceled: true });
    }).catch((err) => {
      this.props.logger.debug('Error when canceling the first-available search: ', err);
    }).finally(() => {
      this.props.disableSpinner();
      this.props.history.push('/');
    });
  }

  startFirstAvailableVisit() {
    this.props.sdk.visitService.findFirstAvailable(this.visit).then((visit) => {
      this.props.logger.debug('First available search completed ', visit);
      return this.props.sdk.visitService.startVisit(visit);
    }).then((startedVisit) => {
      this.props.logger.info('Start visit complete', startedVisit);
      if (startedVisit.modality.modalityType === awsdk.AWSDKVisitModalityType.PHONE) {
        return this.props.history.replace('/visit/phone/waitingRoom', { visit: startedVisit.toString() });
      }
      if (shouldUseWebRTC(startedVisit)) {
        return this.props.history.replace('/visit/waitingRoom', { visit: startedVisit.toString(), telehealthVideoLaunched: false });
      }
      this.props.logger.info('Launching TelehealthVideo');
      return this.props.sdk.visitService.launchTelehealthVideo(startedVisit)
        .then((telehealthVideoLaunched) => {
          this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
          this.props.history.replace('/visit/waitingRoom', { visit: startedVisit.toString(), telehealthVideoLaunched });
        });
    })
      .catch((err) => {
        this.props.logger.error('Something went wrong starting the first available visit:', err);
        this.mapError(err);
      });
  }

  mapError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
      this.setState({ cancelMessage: this.props.messages.validation_required_address_missing });
      this.setState(prevState => ({ isSurescriptsErrorModalOpen: true, }));
    } else if (error.errorCode === awsdk.AWSDKErrorCode.requiredHeightAndWeightMeasurementsMissing) {
      this.setState({ cancelMessage: this.props.messages.validation_required_height_and_weight_vitals_missing });
      this.setState(prevState => ({ isSurescriptsErrorModalOpen: true, }));
    } else if (error.errorCode === awsdk.AWSDKErrorCode.visitConsumerCallbackInvalid) {
      this.props.showErrorModal(this.props.messages.validation_phone_number_invalid);
    } else if (error.errorCode === awsdk.AWSDKErrorCode.noProvidersAvailable || error.errorCode === awsdk.AWSDKErrorCode.pollingTimeout) {
      this.setState({ isSearchExhausted: true });
    } else if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (this.state.isSearchCanceled && error.errorCode === awsdk.AWSDKErrorCode.responseError && error.httpResponseCode === 410) {
      this.props.logger.warn('First Available search has been canceled');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.providerNotAvailable) {
      this.props.showErrorModal(this.props.messages.first_available_provider_search_exhausted_title, this.props.messages.first_available_provider_search);
    } else {
      this.props.showErrorModal();
    }
  }

  componentDidMount() {
    if (this.visit != null) {
      // we've already gone through intake, just need to find a provider
      this.props.logger.debug('Visit was specified, performing the first available search', this.visit);
      this.startFirstAvailableVisit();
    } else {
      this.props.logger.error('Invalid page transition state: no visit specified');
      this.props.showErrorModal();
    }
  }

  toggleCancelModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      isCancelModalOpen: !prevState.isCancelModalOpen,
    }));
  }

  toggleSurescriptsErrorModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      isSurescriptsErrorModalOpen: !prevState.isSurescriptsErrorModalOpen,
    }));
  }

  toggleExhaustedModal() {
    this.setState(prevState => ({
      isSearchExhausted: !prevState.isSearchExhausted,
    }));
  }

  exitSearch() {
    this.toggleExhaustedModal();
    const practice = sessionStorage.getItem('selectedPractice');
    if (practice) {
      this.props.history.replace('/practice/providers', { practice });
    } else {
      this.props.history.replace('/services');
    }
  }

  render() {
    const props = this.props;
    const properties = {
      isCancelModalOpen: this.state.isCancelModalOpen,
      toggleCancelModal: this.toggleCancelModal.bind(this),
      cancelFirstAvailableSearch: this.cancelFirstAvailableSearch.bind(this),
      isSearchExhausted: this.state.isSearchExhausted,
      exitSearch: this.exitSearch.bind(this),
      cancelMessage: this.state.cancelMessage,
      cancelHeader: props.messages.modal_error_generic_header,
      isSurescriptsErrorModalOpen: this.state.isSurescriptsErrorModalOpen,
      toggleSurescriptsErrorModal: this.toggleSurescriptsErrorModal.bind(this),
    };

    return (
      <FirstAvailableComponent key="firstAvailableComponent" {...props} {...properties} />
    );
  }
}

FirstAvailableContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
FirstAvailableContainer.defaultProps = {};
export default FirstAvailableContainer;
