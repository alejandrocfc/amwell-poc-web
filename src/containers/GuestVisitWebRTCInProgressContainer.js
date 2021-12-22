/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */
import React from 'react';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';


class GuestVisitWebRTCInProgressContainer extends React.Component {
  constructor(props) {
    super(props);
    this.participant = this.props.location.state && this.props.location.state.participant ? awsdk.AWSDKFactory.restoreParticipant(this.props.location.state.participant) : null;
    this.videoConsoleRef = React.createRef();
    this.state = {};
  }

  endVisit(participant) {
    this.props.logger.warn('GuestVisitWebRTCInProgressContainer.endVisit', participant);

    // if the visit isn't ended and we're at this point (i.e. past the waiting room) it means we've left voluntarily
    if (participant.conferenceStatus !== awsdk.AWSDKConferenceStatus.Ended) {
      this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_left_visit });
    } else {
      this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_ended });
    }
  }

  componentDidMount() {
    const contextElements = {
      messages: this.props.messages,
      successCallback: this.endVisit.bind(this),
      errorCallback: this.endVisit.bind(this),
      videoConsoleContainer: this.videoConsoleRef.current,
    };
    const videoContext = this.props.sdk.visitService.createVideoContext(contextElements);
    this.props.sdk.visitService.startWebRTCVisitForGuest(this.participant, videoContext);
  }

  render() {
    return (
      <Blocker>
        <div ref={this.videoConsoleRef}/>
      </Blocker>
    );
  }
}

class Blocker extends React.Component {
  UNSAFE_componentWillUpdate() {
    return false;
  }
  render() {
    return this.props.children;
  }
}

GuestVisitWebRTCInProgressContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
GuestVisitWebRTCInProgressContainer.defaultProps = {};

export default GuestVisitWebRTCInProgressContainer;
