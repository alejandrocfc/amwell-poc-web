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
import VisitPhoneWaitingRoomComponent from '../components/visit/phone/VisitPhoneWaitingRoomComponent';
import VisitHeader from '../components/visit/VisitHeaderComponent';


class VisitPhoneWaitingRoomContainer extends React.Component {
  constructor(props) {
    super();
    props.logger.info('VisitPhoneWaitingRoomContainer: props', props);
    this.state = {
      visit: awsdk.AWSDKFactory.restoreVisit(props.location.state.visit),
    };
  }

  componentDidMount() {
    this.props.disableSpinner();
    this.props.sdk.visitService.waitForProviderToJoinVisit(this.state.visit)
      .then((visit) => {
        if (visit.finished) {
          this.props.history.replace('/visit/ended', { visit: visit.toString() });
        } else {
          this.props.history.replace('/visit/phone/inProgress', { visit: visit.toString() });
        }
      }).catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else {
          this.props.showErrorModal();
        }
      });
  }

  cancelVisit(e) {
    e.preventDefault();
    this.props.enableSpinner();
    this.props.sdk.visitService.cancelVisit(this.state.visit)
      .then(() => this.props.sdk.visitService.waitForVisitToFinish(this.state.visit))
      .finally(() => this.props.disableSpinner());
  }

  render() {
    const properties = {
      visit: this.state.visit,
      cancelVisit: this.cancelVisit.bind(this),
    };

    return (
      <VisitHeader id="visitPhoneWaitingRoomComponent" icon='waiting' title={this.props.messages.visit_waiting_room}>
        <VisitPhoneWaitingRoomComponent {...properties} {...this.props} />
      </VisitHeader>
    );
  }
}

VisitPhoneWaitingRoomContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
export default VisitPhoneWaitingRoomContainer;
