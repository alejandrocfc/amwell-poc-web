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
import React from 'react';
import PropTypes from 'prop-types';

import PracticeComponent from '../components/practice/PracticeComponent';
import { hasContextChanged } from '../components/Util';

class PracticeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('PracticeContainer: props', props);
    this.handleToggleWelcomeMessage = this.toggleWelcomeMessage.bind(this);
    this.handleProviderClick = this.getProviderDetails.bind(this);
    this.handleCloseProviderDetails = this.closeProviderDetails.bind(this);
    this.handleStartFirstAvailableSearch = this.startFirstAvailableSearch.bind(this);
    this.handleStartCartMode = this.startCartMode.bind(this);
    this.state = {
      providers: [],
      specialty: null,
      selectedProvider: null,
      welcomeMessageShowAll: false,
      practice: this.props.location.state ? awsdk.AWSDKFactory.restorePractice(this.props.location.state.practice) : null,
    };
  }

  componentDidMount() {
    this.setupContainer();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.setupContainer();
    }
  }

  setupContainer() {
    this.props.enableSpinner();
    const providersPromise = this.props.sdk.providerService.findProvidersInPractice(this.state.practice, this.props.activeConsumer);
    const practiceDetailsPromise = this.props.sdk.practiceService.getPracticeDetails(this.state.practice);
    const onDemandSpecialtiesPromise = this.props.sdk.practiceService.getOnDemandSpecialties(this.props.activeConsumer, this.state.practice);
    Promise.all([providersPromise, practiceDetailsPromise, onDemandSpecialtiesPromise])
      .then((values) => {
        const providers = values[0];
        const practiceDetails = values[1];
        const onDemandSpecialties = values[2];
        this.props.logger.debug('Results: ', providers, practiceDetails, onDemandSpecialties);
        this.setState({ practice: practiceDetails, providers, specialty: onDemandSpecialties[0] });
      })
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  getProviderDetails(e, provider) {
    e.preventDefault();
    this.props.logger.debug('getProviderDetails:', provider, e);
    this.props.enableSpinner();
    this.props.sdk.providerService.getProviderDetails(provider, this.props.activeConsumer)
      .then((providerDetails) => {
        this.props.logger.debug('ProviderDetails:', providerDetails);
        this.setState({ selectedProvider: providerDetails });
      })
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  startFirstAvailableSearch(e) {
    if (e) e.preventDefault();
    this.props.history.push('/visit/intake/start', {
      specialty: this.state.specialty.toString(),
      practice: this.state.practice.toString()
    });
  }

  closeProviderDetails() {
    this.setState({ selectedProvider: null });
  }

  startCartMode(e) {
    if (e) e.preventDefault();
    this.props.setCartModeActive(true);
    this.props.history.push('/cartmode/patient', { practice: this.state.practice.toString(), provider: this.state.selectedProvider && this.state.selectedProvider.toString() });
  }

  toggleWelcomeMessage(e) {
    e.preventDefault();
    this.setState(prevState => ({
      welcomeMessageShowAll: !prevState.welcomeMessageShowAll,
    }));
  }

  render() {
    const props = this.props;
    const properties = {
      practice: this.state.practice,
      showFirstAvailableOption: this.state.specialty,
      toggleWelcomeMessage: this.handleToggleWelcomeMessage,
      handleProviderClick: this.handleProviderClick,
      closeProviderDetails: this.handleCloseProviderDetails,
      startFirstAvailableSearch: this.handleStartFirstAvailableSearch,
      startCartMode: this.handleStartCartMode,
      welcomeMessageShowAll: this.state.welcomeMessageShowAll,
      providers: this.state.providers,
      selectedProvider: this.state.selectedProvider,
    };

    return (
      <PracticeComponent key="practiceComponent" {...props} {...properties} />
    );
  }
}

PracticeContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
PracticeContainer.defaultProps = {};
export default PracticeContainer;
