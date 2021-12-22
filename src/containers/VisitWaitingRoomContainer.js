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
import ValueLinkedComponent from './ValueLinkedContainer';
import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitSetUpTelehealthVideo from '../components/visit/VisitSetUpTelehealthVideoComponent';
import VisitWaitingRoom from '../components/visit/VisitWaitingRoomComponent';
import {isUnsetOrEmptyString, isValidPhoneNumber, shouldUseWebRTC} from '../components/Util';
import ChatContainer from './ChatContainer';


class VisitWaitingRoomContainer extends ValueLinkedComponent {
  constructor(props) {
    super(props);
    this.handleIsVideoCallbackActiveChange = this.handleIsVideoCallbackActiveChange.bind(this);
    this.props.logger.debug('VisitWaitingRoomContainer: props', props);
    this.telehealthVideoLaunched = props.location.state.telehealthVideoLaunched;
    this.consumerLogoutCallback = props.consumerLogoutCallback;
    this.sdk = props.sdk;
    this.state = {
      errors: [],
      modified: [],
      sentMessage: null,
      smsPhoneNumber: '',
      vcbPhoneNumber: '',
      visit: this.props.location.state && this.props.location.state.visit ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit) : null,
      telehealthVideoStarted: false,
      smsNumberAlreadyProvided: false,
      isCancelModalOpen: false,
      displayVCBInput: this.props.location.state && this.props.location.state.visit ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit).isVideoCallbackActive : null
    };
    if (this.state.visit && this.state.visit.initiatorEngagementOverridePhone) {
      this.state.vcbPhoneNumber = this.state.visit.initiatorEngagementOverridePhone
    } else {
      this.state.vcbPhoneNumber = this.props.activeConsumer.phone || '';
    }
  }

  handleIsVideoCallbackActiveChange(isVideoCallbackActive) {
    this.setState({ displayVCBInput: isVideoCallbackActive });
  }

  handleVisitFinished(visit) {
    this.setState({ visit });
    if (visit.canTransfer) {
      // give the user at least 5 seconds to see the 'you're being transferred' screen
      setTimeout(() => { this.visitTransfer(visit); }, 5000);
    } else if (visit.disposition === awsdk.AWSDKDisposition.ProviderWrapup || visit.disposition === awsdk.AWSDKDisposition.Completed) {
      this.props.logger.info('Visit finished - go to visit summary', visit);
      this.props.history.replace('/visit/summary', { visit: visit.toString() });
    } else {
      this.props.logger.info('Visit ended - go to visit ended', visit);
      this.props.history.replace('/visit/ended', { visit: visit.toString() });
    }
  }

  componentDidMount() {
    this.processVisit();
  }

  logoutConsumer() {
    this.sdk.authenticationService.clearAuthentication(this.props.activeConsumer);
    this.consumerLogoutCallback();
    this.props.history.replace('/');
  }

  processVisit() {
    if (this.state.visit) {
      this.props.disableSpinner();
      if (shouldUseWebRTC(this.state.visit)) {
        this.props.sdk.visitService.waitForProviderToJoinVisit(this.state.visit, ((updatedVisit) => {
          this.setState({ visit: updatedVisit, sentMessage: null });
          if (updatedVisit.isVideoCallbackReturnInitiated || updatedVisit.isVideoCallbackReturnCanceled) {
            this.logoutConsumer();
          }
        }))
          .then((visit) => {
            this.props.logger.info('No longer waiting for the provider to join the visit');
            if (visit.finished) {
              this.handleVisitFinished(visit);
            }
            else {
              this.props.history.replace('/visit/webRTC', { visit: visit.toString() });
            }
          }).catch((error) => {
            this.props.logger.info('Something went wrong that should be logged', error);
          });
        return;
      }
      this.props.sdk.visitService.waitForTelehealthVideoToStart(this.state.visit)
        .then((visit) => {
          this.props.logger.info('Video client started - enter waiting room', visit);
          this.setState({ telehealthVideoStarted: visit.telehealthVideoStarted });
          return this.props.sdk.visitService.waitForProviderToJoinVisit(visit, ((updatedVisit) => {
            this.setState({ visit: updatedVisit, sentMessage: null });
            this.props.logger.info('patients ahead', updatedVisit.patientsAheadOfYou);
            if (!updatedVisit.possibleFirstAvailableTransferAcceptedByConsumer && updatedVisit.optionForFindFirstAvailableTransferAvailable) {
              this.props.logger.info('First Available providers are available for transfer, query consumer.');
            }
            if (updatedVisit.suggestedProviderForTransfer) {
              this.props.logger.info('Suggested provider for transfer', updatedVisit.suggestedProviderForTransfer);
            }
          }));
        })
        .then((visit) => {
          this.setState({ visit });
          if (visit.canTransfer) {
            // give the user at least 5 seconds to see the 'you're being transferred' screen
            setTimeout(() => { this.visitTransfer(visit); }, 5000);
          } else if (visit.finished) {
            this.visitFinished(visit);
          }
          else {
            this.visitInProgress(visit);
          }
        })
        .catch((reason) => {
          this.handleError(reason);
        });
    } else {
      this.props.showErrorModal();
    }
  }

  visitTransfer(visit) {
    this.props.logger.info('Provider has declined visit and suggested a transfer:', visit);
    this.props.sdk.visitService.handleTransfer(visit)
      .then((transfer) => {
        if (!transfer.isQuickTransfer) {
          this.props.history.replace('/visit/intake/start', {
            provider: visit.providerForTransfer.toString(),
            ignoreSpeedPass: 'true'
          });
        } else {
          this.props.sdk.visitService.startVisit(transfer.visit)
            .then((xfrVisit) => {
              this.props.logger.info('Start visit complete', xfrVisit);
              this.setState({ visit: xfrVisit });

              // if we're handling a webrtc transfer, just go to the waiting room
              if (!shouldUseWebRTC(this.state.visit)) {
                this.props.logger.info('Launching TelehealthVideo');
                this.props.sdk.visitService.launchTelehealthVideo(xfrVisit)
                  .then((telehealthVideoLaunched) => {
                    this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
                  });
              }

              this.processVisit();
            });
        }
      });
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

  visitInProgress(visit) {
    this.props.logger.info('go to visit inProgress', visit);
    this.props.history.replace('/visit/inProgress', { visit: visit.toString() });
  }

  cancelVisit() {
    this.props.enableSpinner();
    this.props.sdk.visitService.cancelVisit(this.state.visit)
      .then(() => this.props.sdk.visitService.waitForVisitToFinish(this.state.visit))
      .finally(() => this.props.disableSpinner());
  }

  submitSMSPhoneNumber(e) {
    e.preventDefault();
    if (!isValidPhoneNumber(this.state.smsPhoneNumber)) {
      const errors = { smsPhoneNumber: this.props.messages.validation_phone_number_invalid };
      this.setState({ errors });
      return;
    }
    this.props.enableSpinner();
    this.props.sdk.visitService.setupWaitingRoomAlerts(this.state.visit, this.state.smsPhoneNumber, true)
      .then(() => {
        this.props.logger.info('Waiting room sms mobile number set succeeded');
        this.setState({ smsNumberAlreadyProvided: true });
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  submitVCBRequest(e) {
    this.props.logger.debug('Submitting Video Callback Request for ', this.state.vcbPhoneNumber);
    e.preventDefault();
    if (!isValidPhoneNumber(this.state.vcbPhoneNumber)) {
      const errors = { vcbPhoneNumber: this.props.messages.validation_phone_number_invalid };
      this.setState({ errors });
      return;
    }
    this.props.enableSpinner();
    return this.props.sdk.visitService.requestVideoCallback(this.state.visit, this.state.vcbPhoneNumber)
        .then(vcbRequestSubmitted => {
          this.props.logger.info('Video Callback request succeeded');
          this.setState({ smsNumberAlreadyProvided: true });
          return vcbRequestSubmitted;
        })
        .catch(error => {
          this.props.logger.info('Something went wrong:', error);
          this.mapError(error);
          this.setState({ displayVCBInput: false });
        })
        .finally(() => this.props.disableSpinner());
  }

  addChatMessage(message, lastOrdinal) {
    // No spinner on chat
    this.props.sdk.visitService.addChatMessage(this.state.visit, message, lastOrdinal)
      .then((chatReport) => {
        this.setState({ sentMessage: chatReport.chatItems[0] });
      })
      .catch(error => this.mapError(error));
  }

  launchTelehealthVideo() {
    this.props.sdk.visitService.launchTelehealthVideo(this.state.visit);
  }

  acceptTransfer() {
    this.props.logger.info('Accepted suggested provider for transfer', this.state.visit.suggestedProviderForTransfer);
    this.props.enableSpinner();
    this.props.sdk.visitService.acceptSuggestedTransfer(this.state.visit)
      .catch((reason) => {
        this.handleError(reason);
      });
    // spinner disabled when visit is started.
  }

  acceptFATransfer() {
    this.props.logger.info('Accepted first available provider for transfer', this.state.visit);
    this.props.enableSpinner();
    this.props.sdk.visitService.acceptFindFirstAvailableTransferVisitSuggestion(this.state.visit)
      .catch((reason) => {
        this.handleError(reason);
      });
    // spinner disabled when visit is started.
  }

  declineTransfer(dontAskAgain) {
    this.props.logger.info('Declined suggested provider for transfer. Done ask again', dontAskAgain);
    this.props.enableSpinner();
    this.props.sdk.visitService.declineSuggestedTransfer(this.state.visit, dontAskAgain)
      .catch((reason) => {
        this.handleError(reason);
      }).finally(() => this.props.disableSpinner());
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.validationError) {
        errors.smsPhoneNumber = this.props.messages.validation_phone_number_invalid;
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  handleError(reason) {
    if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (reason.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
      this.props.showErrorModal(this.props.messages.validation_required_address_missing); 
    } else {
      this.props.logger.info('Something went wrong:', reason);
      this.props.showErrorModal();
    }
  }

  toggleCancelModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      isCancelModalOpen: !prevState.isCancelModalOpen,
    }));
  }

  toggleDisplayVCBInput(e) {
    this.setState(prevState => ({
      displayVCBInput: !prevState.displayVCBInput,
    }));
  }

  render() {
    const props = this.props;
    const smsPhoneNumberLink = this.linkAt('smsPhoneNumber');
    const vcbPhoneNumberLink = this.linkAt('vcbPhoneNumber');
    vcbPhoneNumberLink.check(x => !this.state.modified.vcbPhoneNumber || !isUnsetOrEmptyString(x), this.props.messages.validation_phone_number_required);
    vcbPhoneNumberLink.check(x => !this.state.modified.vcbPhoneNumber || isValidPhoneNumber(x), this.props.messages.validation_phone_number_invalid);
    const properties = {
      launchTelehealthVideo: this.launchTelehealthVideo.bind(this),
      acceptTransfer: this.acceptTransfer.bind(this),
      acceptFATransfer: this.acceptFATransfer.bind(this),
      declineTransfer: this.declineTransfer.bind(this),
      cancelVisit: this.cancelVisit.bind(this),
      toggleCancelModal: this.toggleCancelModal.bind(this),
      toggleDisplayVCBInput: this.toggleDisplayVCBInput.bind(this),
      submitSMSPhoneNumber: this.submitSMSPhoneNumber.bind(this),
      submitVCBRequest: this.submitVCBRequest.bind(this),
      isCancelModalOpen: this.state.isCancelModalOpen,
      displayVCBInput: this.state.displayVCBInput,
      telehealthVideoLaunched: this.telehealthVideoLaunched,
      telehealthVideoInstallUrl: this.props.sdk.visitService.telehealthVideoInstallUrl,
      smsNumberAlreadyProvided: this.state.smsNumberAlreadyProvided,
      visit: this.state.visit,
      isVideoCallbackActive: this.state.visit.isVideoCallbackActive
    };

    const showWaitingRoomContent = this.state.visit && (shouldUseWebRTC(this.state.visit) || this.state.telehealthVideoStarted);

    return (
      <div>
        { showWaitingRoomContent &&
          <VisitHeader id="visitWaitingRoom" icon={this.state.visit.canTransfer ? 'transfer' : 'waiting'} title={this.state.visit.canTransfer ? this.props.messages.transfer : this.props.messages.visit_waiting_room}>
            <VisitWaitingRoom key="visitWaitingRoom" visit={this.state.visit}
              onIsVideoCallbackActiveChange={this.handleIsVideoCallbackActiveChange}
              smsPhoneNumberLink={smsPhoneNumberLink} vcbPhoneNumberLink={vcbPhoneNumberLink} {...props} {...properties} />
            {this.state.visit.chatReport && !this.state.visit.canTransfer &&
            <ChatContainer
              topBumperMessage={this.props.messages.chat_window_preparing}
              handleSendMessageClick={this.addChatMessage.bind(this)}
              chatReport={this.state.visit.chatReport}
              sentMessage={this.state.sentMessage}
              {...this.props}/>}
          </VisitHeader>
        }
        { !showWaitingRoomContent &&
          <VisitHeader id="visitSetUpTelehealthVideo" icon='video' title={this.props.messages.visit_setup_video_title}>
            <VisitSetUpTelehealthVideo key="visitSetUpTelehealthVideo" {...properties} {...props} />
          </VisitHeader>
        }
      </div>);
  }
}

VisitWaitingRoomContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitWaitingRoomContainer.defaultProps = {};
export default VisitWaitingRoomContainer;
