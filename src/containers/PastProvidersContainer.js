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

import PastProvidersComponent from '../components/provider/PastProvidersComponent';
import { hasContextChanged } from '../components/Util';

class PastProvidersContainer extends React.Component {
  constructor(props) {
    super(props);
    this.logger = props.logger;
    this.logger.debug('ServicesContainer: props', props);
    this.state = {
      errors: [],
      providers: [],
      selectedProvider: null,
      showCallRequested: false,
    };
  }

  getProviderDetails(e, provider) {
    e.preventDefault();
    this.logger.debug('getProviderDetails:', provider, e);
    this.props.enableSpinner();
    this.props.sdk.providerService.getProviderDetails(provider, this.props.activeConsumer)
      .then((providerDetails) => {
        this.logger.debug('ProviderDetails:', providerDetails);
        this.setState({ selectedProvider: providerDetails });
      })
      .catch((reason) => {
        if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else {
          this.logger.info('Something went wrong:', reason);
          this.props.showErrorModal();
        }
      }).finally(() => this.props.disableSpinner());
  }

  closeProviderDetails() {
    this.setState({ selectedProvider: null });
  }

  initiateIVRCall(e) {
    e.preventDefault();
    this.props.enableSpinner();
    this.props.sdk.IVRService.initiateCall(this.props.activeConsumer, this.state.selectedProvider, null)
      .catch((reason) => {
        if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else if (!this.props.activeConsumer.phone && reason.errorCode === awsdk.AWSDKErrorCode.validationRequiredParameterMissing) {
          this.props.showErrorModal(this.props.messages.past_providers_add_number, this.props.messages.past_providers_call_could_not_be_placed);
        } else {
          this.logger.error('Something went wrong:', reason);
          this.props.showErrorModal();
        }
      })
      .finally(() => this.props.disableSpinner());
  }

  startCartMode(event) {
    if (event) event.preventDefault();
    const provider = this.state.selectedProvider;
    const practice = provider && provider.practice;
    if (provider && practice) {
      this.props.setCartModeActive(true);
      this.props.history.push('/cartmode/patient', { practice: practice.toString(), provider: provider.toString() });
    }
  }

  componentDidMount() {
    this.findPastProviders();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.findPastProviders();
    }
  }

  findPastProviders() {
    this.props.enableSpinner();
    this.props.sdk.providerService.searchPastProviders(this.props.activeConsumer)
      .then((providers) => {
        this.logger.debug('providers: ', providers);
        this.setState({ providers });
      })
      .catch((reason) => {
        if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else {
          this.logger.error('Something went wrong:', reason);
          this.props.showErrorModal();
        }
      }).finally(() => this.props.disableSpinner());
  }

  toggleCallRequested() {
    this.setState(prevState => ({
      showCallRequested: !prevState.showCallRequested,
    }));
  }

  render() {
    const properties = {
      providers: this.state.providers,
      selectedProvider: this.state.selectedProvider,
      handleProviderClick: this.getProviderDetails.bind(this),
      closeProviderDetails: this.closeProviderDetails.bind(this),
      handleRequestCallClick: this.initiateIVRCall.bind(this),
      showCallRequested: this.state.showCallRequested,
      toggleCallRequested: this.toggleCallRequested.bind(this),
      startCartMode: this.startCartMode.bind(this),
    };

    return (
      <PastProvidersComponent key='pastProvidersComponent' {...properties} {...this.props} />
    );
  }
}

PastProvidersContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
PastProvidersContainer.defaultProps = {};

export default PastProvidersContainer;
