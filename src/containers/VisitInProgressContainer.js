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

import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitInProgress from '../components/visit/VisitInProgressComponent';
import { shouldUseWebRTC } from '../components/Util';

class VisitInProgressContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      providerForTransfer: null,
      showExtendedVisitModal: false,
      extensionOfferAcceptedOrRejected: false,
      visit: this.props.location.state ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit) : null,
    };
  }

  componentDidMount() {
    if (this.state.visit) {
      this.props.sdk.visitService.waitForVisitToFinish(this.state.visit, (updatedVisit) => {
        const newState = { visit: updatedVisit };
        if (updatedVisit.paidExtensionOffered && updatedVisit.longExtensionEntity && !this.state.extensionOfferAcceptedOrRejected) {
          newState.showExtendedVisitModal = true;
        }
        this.setState(newState);
      })
        .then((visit) => {
          if (visit.canTransfer) {
            this.setState({ providerForTransfer: visit.providerForTransfer });
            // give the user at least 5 seconds to see the 'you're being transferred' screen
            setTimeout(() => { this.visitTransfer(visit); }, 5000);
          } else if (visit.finished) {
            this.visitFinished(visit);
          }
        })
        .catch(error => this.handleError(error));
    }
  }

  visitTransfer(visit) {
    this.props.logger.info('Provider has ended the visit and transferred the consumer:', visit);
    this.props.enableSpinner();
    this.props.sdk.visitService.handleTransfer(visit)
      .then((transfer) => {
        this.props.disableSpinner();
        this.setState({ visit: transfer.visit });
        if (!transfer.isQuickTransfer) {
          return this.props.history.replace('/visit/intake/start', {
            provider: visit.providerForTransfer.toString(),
            ignoreSpeedPass: 'true'
          });
        }
        return this.props.sdk.visitService.startVisit(transfer.visit)
          .then((xfrVisit) => {
            this.props.logger.info('Start visit complete', xfrVisit);

            // if we're handling a webrtc transfer, just go to the waiting room
            if (shouldUseWebRTC(xfrVisit)) {
              return Promise.resolve({ xfrVisit, telehealthVideoLaunched: false });
            }

            // otherwise start up the EV first and then go to waiting room
            this.props.logger.info('Launching TelehealthVideo');
            return this.props.sdk.visitService.launchTelehealthVideo(xfrVisit)
              .then((telehealthVideoLaunched) => {
                this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
                return Promise.resolve({ xfrVisit, telehealthVideoLaunched });
              });
          })
          .then((result) => {
            this.props.history.replace('/visit/waitingRoom', { visit: result.xfrVisit.toString(), telehealthVideoLaunched: result.telehealthVideoLaunched });
          });
      })
      .catch(error => this.handleError(error));
  }

  visitFinished(visit) {
    if (visit.disposition === awsdk.AWSDKDisposition.ProviderWrapup || visit.disposition === awsdk.AWSDKDisposition.Completed) {
      this.props.logger.info('Visit finished - go to visit summary', visit);
      this.props.history.replace('/visit/summary', { visit: visit.toString() });
    } else {
      this.props.logger.info('Visit ended - go to visit ended', visit);
      this.props.history.replace('/visit/ended', { visit: visit.toString() });
    }
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
      this.props.showErrorModal(this.props.messages.validation_required_address_missing);
    } else {
      this.props.logger.error('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  endVisit() {
    this.props.enableSpinner();
    this.props.sdk.visitService.endVisit(this.state.visit)
      .then(() => this.props.sdk.visitService.waitForVisitToFinish(this.state.visit))
      .finally(() => this.props.disableSpinner());
  }

  launchTelehealthVideo() {
    this.props.sdk.visitService.launchTelehealthVideo(this.state.visit);
  }

  acceptPaidVisitExtension(accept) {
    this.props.enableSpinner();
    this.props.sdk.visitService.acceptPaidVisitExtension(this.state.visit, accept)
      .then((extensionAccepted) => {
        this.props.logger.info('Paid Extension Accepted', extensionAccepted);
        this.setState({ showExtendedVisitModal: false, extensionOfferAcceptedOrRejected: true });
      })
      .catch(error => this.handleError(error))
      .finally(() => this.props.disableSpinner());
  }

  toggleExtendVisitModal() {
    this.setState(prevState => ({
      showExtendedVisitModal: !prevState.showExtendedVisitModal,
    }));
  }

  render() {
    const properties = {
      visit: this.state.visit,
      providerForTransfer: this.state.providerForTransfer,
      showExtendedVisitModal: this.state.showExtendedVisitModal,
      endVisit: this.endVisit.bind(this),
      launchTelehealthVideo: this.launchTelehealthVideo.bind(this),
      toggleExtendVisitModal: this.toggleExtendVisitModal.bind(this),
      acceptPaidVisitExtension: this.acceptPaidVisitExtension.bind(this),
    };

    return (
      <div>
        { this.state.visit &&
          <VisitHeader id="visitInProgress" icon={!this.state.providerForTransfer ? 'visit' : 'transfer'} title={!this.state.providerForTransfer ? this.props.messages.visit_your_visit : this.props.messages.transfer}>
            <VisitInProgress key="visitInProgress" {...properties} {...this.props} />
          </VisitHeader>
        }
      </div>);
  }
}

VisitInProgressContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitInProgressContainer.defaultProps = {};
export default VisitInProgressContainer;
