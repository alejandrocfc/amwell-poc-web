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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import VisitHeader from '../components/visit/VisitHeaderComponent';
import ProviderSilhouette from '../components/firstAvailable/images/icon-silo-provider.png';
import '../components/visit/VisitComponents.css';
import '../components/guest/GuestIntake.css';
import YesNoModal from '../components/popups/info/YesNoModal';
import { shouldUseWebRTC } from '../components/Util';

class GuestVisitWaitingRoomContainer extends React.Component {
  constructor(props) {
    super(props);
    this.toggleCancelModal = this.toggleCancelModal.bind(this);
    this.participant = awsdk.AWSDKFactory.restoreParticipant(this.props.location.state.participant);
    this.state = {
      promptCancel: false,
    };
  }

  componentDidMount() {
    this.props.sdk.visitService.waitForVideoParticipantVisitToStart(this.participant).then((participant) => {
      this.participant = participant;
      // if conference has started, start the telehealth client and redirect
      if (this.participant.conferenceStatus === awsdk.AWSDKConferenceStatus.Started) {
        if (shouldUseWebRTC(this.participant)) {
          this.props.history.push('/guestVisitWebRTC', { participant: this.participant.toString() });
        } else {
          this.props.logger.info('Visit is starting for guest ', this.participant);
          this.props.sdk.visitService.launchVideoParticipantTelehealthVideo(this.participant)
            .then((telehealthVideoLaunched) => {
              this.props.history.push('/guestVisit', { telehealthVideoLaunched, participant: this.participant.toString() });
            });
        }
      }

      // visit is canceled
      if (this.participant.conferenceStatus === awsdk.AWSDKConferenceStatus.Cancelled) {
        this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_cancelled });
      }

      // visit is already ended
      if (this.participant.conferenceStatus === awsdk.AWSDKConferenceStatus.Ended) {
        this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_already_ended });
      }
    }).catch((error) => {
      this.props.logger.error(error);
      this.props.showErrorModal();
    });
  }

  toggleCancelModal(e) {
    e.preventDefault();
    this.setState(prevState => ({
      promptCancel: !prevState.promptCancel,
    }));
  }

  render() {
    return (
      <div>
        <VisitHeader id='guestVisitWaitingRoom' icon='waiting' title={this.props.messages.visit_waiting_room}>
          <div className="visitForm">
            <div className="visitWaitingRoom guest">
              <div className="waitingRoomProviderLogo"><img alt='waitingLogo' src={ProviderSilhouette}/></div>
              <div className="waitingRoomGreeting">{this.props.messages.guest_visit_waiting_room_desc}</div>
              <div className="visitCancelRequest"><button className="link-like" onClick={e => this.toggleCancelModal(e)}>{this.props.messages.visit_cancel}</button></div>
            </div>
          </div>
        </VisitHeader>
        <YesNoModal
          isOpen={this.state.promptCancel}
          toggle={this.toggleCancelModal}
          messages={this.props.messages}
          message={this.props.messages.cancel_visit_txt}
          header={this.props.messages.cancel_visit}
          yesClickHandler={(e) => { e.preventDefault(); this.props.history.replace('/'); }}
        />
      </div>
    );
  }
}
GuestVisitWaitingRoomContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
GuestVisitWaitingRoomContainer.defaultProps = {};

export default GuestVisitWaitingRoomContainer;
