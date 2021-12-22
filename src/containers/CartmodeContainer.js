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

import CartModeComponent from '../components/cartmode/CartModeComponent';
import { shouldUseWebRTC } from '../components/Util';

class CartModeContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('CartModeContainer: props', props);
    this.state = {
      practice: props.location.state.practice && awsdk.AWSDKFactory.restorePractice(props.location.state.practice),
      provider: props.location.state.provider && awsdk.AWSDKFactory.restoreProviderDetails(props.location.state.provider),
      countries: [],
      consumerOverrideDetails: null,
      topicText: '',
      visit: null,
      visitModalityType: awsdk.AWSDKVisitModalityType.VIDEO,
    };
  }

  componentDidMount() {
    this.props.enableSpinner();
    this.props.sdk.getCountries()
      .then(countries => this.setState({ countries }))
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  UNSAFE_componentWillMount() {
    // if we're not coming from somewhere with a practice or cart mode is inactive redirect to homepage
    if (!this.state.practice || !this.props.isCartModeActive) {
      this.props.history.replace('/');
    }
  }

  setConsumerOverrideDetails(consumerOverrideDetails) {
    this.setState({ consumerOverrideDetails });
  }

  setTopicText(topicText) {
    this.setState({ topicText });
  }

  startCartModeVisit() {
    this.props.enableSpinner();

    let getVisitContextPromise = null;
    // get a visit context or a ffa visit context if no provider available
    if (this.state.provider) {
      getVisitContextPromise = this.props.sdk.visitService.getVisitContext(this.props.activeConsumer, this.state.provider);
    } else {
      getVisitContextPromise = this.props.sdk.practiceService.getOnDemandSpecialties(this.props.activeConsumer, this.state.practice)
        .then(onDemandSpecialties => this.props.sdk.visitService.getVisitContext(this.props.activeConsumer, onDemandSpecialties[0]))
        .catch(error => this.handleError(error));
    }

    getVisitContextPromise
      .then((visitContext) => {
        visitContext.modalityType = this.state.visitModalityType;
        visitContext.consumerOverrideDetails = this.state.consumerOverrideDetails;
        visitContext.otherTopic = this.state.topicText;
        visitContext.isQuickConnect = true;
        return this.props.sdk.visitService.createVisit(visitContext);
      })
      .then(visit => this.props.sdk.visitService.waitForVisitCostCalculationToFinish(visit))
      .then((visitWithCost) => {
        this.props.logger.info('Visit : ', visitWithCost);

        return this.setState({ visit: visitWithCost }, () => {
          // if we need payment info, send them to the payment screen
          if (!visitWithCost.cost.zeroCostVisit) {
            this.props.history.replace('/visit/cost', { visit: visitWithCost.toString() });
            return Promise.resolve();
          }

          // if we're first available + zeroCostVisit, skip payment and go straight to the ffa screen
          if (!this.state.provider) {
            this.props.history.push('/visit/firstAvailable', { visit: visitWithCost.toString() });
            return Promise.resolve();
          }

          // if we're a zeroCostVisit and not first available:
          return this.props.sdk.visitService.startVisit(visitWithCost)
            .then((startedVisit) => {
              this.props.logger.info('Start visit complete', startedVisit);

              if (!shouldUseWebRTC(startedVisit)) {
                this.props.logger.info('Launching TelehealthVideo');
                return this.props.sdk.visitService.launchTelehealthVideo(startedVisit);
              }

              // using webRTC so telehealth video is definitely not launched + return false
              return Promise.resolve(false);
            })
            .then((telehealthVideoLaunched) => {
              this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
              this.props.history.replace('/visit/waitingRoom', { visit: this.state.visit.toString(), telehealthVideoLaunched });
            });
        });
      })
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.clearSessionStorage();
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.pollingTimeout) {
      this.props.showErrorModal(this.props.messages.pollingTimeout_exceeded);
    } else if (error.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
      this.props.showErrorModal(this.props.messages.validation_required_address_missing);
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal(error.message || error.reason, error.reason);
    }
  }

  render() {
    const properties = {
      startCartModeVisit: this.startCartModeVisit.bind(this),
      setConsumerOverrideDetails: this.setConsumerOverrideDetails.bind(this),
      setTopicText: this.setTopicText.bind(this),
      topicText: this.state.topicText,
      consumerOverrideDetails: this.state.consumerOverrideDetails,
      countries: this.state.countries,
      practice: this.state.practice,
      provider: this.state.provider,
    };

    return (
      <div>
        <CartModeComponent {...properties} {...this.props}/>
      </div>
    );
  }
}

CartModeContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
export default CartModeContainer;
