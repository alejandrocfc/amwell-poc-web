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
import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitSetUpTelehealthVideo from '../components/visit/VisitSetUpTelehealthVideoComponent';
import CheckIcon from '../components/visit/images/Check.png';


class GuestVisitInProgressContainer extends React.Component {
  constructor(props) {
    super(props);
    this.telehealthVideoLaunched = props.location.state.telehealthVideoLaunched;
    this.participant = this.props.location.state && this.props.location.state.participant ? awsdk.AWSDKFactory.restoreParticipant(this.props.location.state.participant) : null;
    this.state = {
      guestLeftVisit: false,
      telehealthVideoLaunched: props.location.state ? props.location.state.telehealthVideoLaunched : false,
    };
  }

  launchTelehealthVideo(e) {
    e.preventDefault();
    this.props.sdk.visitService.launchVideoParticipantTelehealthVideo(this.participant).then((launched) => {
      this.setState({ telehealthVideoLaunched: launched });
    });
  }

  leaveVisit(e) {
    e.preventDefault();
    this.setState({ guestLeftVisit: true }, () => {
      this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_left_visit });
    });
  }

  componentDidMount() {
    this.props.sdk.visitService.updateVideoParticipantConnectionStatus(this.participant)
      .then((participant) => {
        this.props.logger.debug('Updated connection status for participant ', participant);
        this.props.logger.info(participant);
        return this.props.sdk.visitService.waitForVideoParticipantVisitToEnd(participant);
      })
      .then((participant) => {
        if (!this.state.guestLeftVisit) {
          this.props.logger.info('Guest visit has ended ', participant);
          this.props.history.push('/guestVisitEnded', { message: this.props.messages.guest_visit_ended });
        }
      })
      .catch((reason) => {
        this.props.logger.error(reason);
        this.props.showErrorModal();
      });
  }
  cancelGuestVisit() {
    this.props.history.replace('/');
  }
  render() {
    const properties = {
      telehealthVideoLaunched: this.telehealthVideoLaunched,
      telehealthVideoInstallUrl: this.props.sdk.visitService.telehealthVideoInstallUrl,
    };
    return (
      <div>
        { !this.telehealthVideoLaunched &&
        <VisitHeader id="visitSetUpTelehealthVideo" icon='video' title={this.props.messages.visit_setup_video_title}>
          <VisitSetUpTelehealthVideo key="visitSetUpTelehealthVideo" cancelVisit={this.cancelGuestVisit.bind(this)} {...properties} {...this.props} />
        </VisitHeader>
        }
        { this.telehealthVideoLaunched &&
        <VisitHeader id="visitInProgress" icon='visit' title={this.props.messages.visit_your_visit}>
          <div className="visitForm">
            <div id="visitInProgress" className="visitInProgress">
              <div className="visitProviderLogo"><img alt='Visit has started' src={CheckIcon}/></div>
              <div>
                <div className="visitInProgressVisitStarted">{this.props.messages.visit_your_visit_started}</div>
                <div className="visitInProgressRefreshVideo"><button className="link-like" onClick={e => this.launchTelehealthVideo(e)}>{this.props.messages.visit_refresh_video}</button></div>
                <div className="visitInProgressLeaveVisit"><button className="link-like" onClick={e => this.leaveVisit(e)}>{this.props.messages.guest_visit_leave_visit}</button></div>
              </div>
            </div>
          </div>
        </VisitHeader>
        }
      </div>
    );
  }
}

GuestVisitInProgressContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
GuestVisitInProgressContainer.defaultProps = {};

export default GuestVisitInProgressContainer;
