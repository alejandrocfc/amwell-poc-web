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

/**
 * Where the WebRTC visit occurs in its entirety once the consumer initiates the visit.
 */
class WebRTCVisitContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('WebRTCVisitContainer: props', props);
    this.visitConsoleWidget = React.createRef();
    this.consumerLogoutCallback = props.consumerLogoutCallback;
    this.sdk = props.sdk;

    this.state = {
      visit: this.getVisit(),
    };
  }

  getVisit() {
    // the visit in location (from react router) has priority
    if (this.props.location.state && this.props.location.state.visit) {
      // keep track of restored visit in SESSION storage
      const restoredVisit = awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit);
      sessionStorage.setItem('visit', restoredVisit);

      return restoredVisit;
    }

    // if we have a visit in storage fall back to it
    const visitFromStorage = sessionStorage.getItem('visit');
    return awsdk.AWSDKFactory.restoreVisit(visitFromStorage);
  }

  logoutConsumer() {
    this.sdk.authenticationService.clearAuthentication(this.props.activeConsumer);
    this.consumerLogoutCallback();
    this.props.history.replace('/');
  }

  componentDidMount() {
    this.props.setIsSimpleHeader(true);

    // get a reference to our visit console widget and wire it up + start it
    const visitConsole = this.visitConsoleWidget.current;
    const locale = this.props.locale;
    visitConsole.initialize(this.props.sdk,
      {
        visit: this.state.visit,
        messages: this.props.messages,
        locale,
        disableHeader: true
      });
    visitConsole.addEventListener('visitEnd', event => {
      this.onVisitEnd(event.detail.visit)
    });
    visitConsole.addEventListener('visitUpdated', event => {
      if(event.detail.visit.isVideoCallbackReturnInitiated || event.detail.visit.isVideoCallbackReturnCanceled) {
        this.logoutConsumer();
      }
    });
  }

  onVisitEnd(visit) {
    this.props.setIsSimpleHeader(false);
    this.props.logger.info('WebRTCVisitContainer#onVisitEnd', visit);
    if (visit.canTransfer) {
      this.props.logger.info('Visit transfer - go to waiting room ', visit);
      this.props.history.replace('/visit/waitingRoom', { visit: visit.toString() });
    } else if (visit.disposition === awsdk.AWSDKDisposition.ProviderWrapup || visit.disposition === awsdk.AWSDKDisposition.Completed) {
      this.props.logger.info('Visit finished - go to visit summary', visit);
      this.props.history.replace('/visit/summary', { visit: visit.toString() });
    } else {
      this.props.logger.info('Visit ended - go to visit ended', visit);
      this.props.history.replace('/visit/ended', { visit: visit.toString() });
    }
  }

  render() {
    return (<amwell-visit-console ref={this.visitConsoleWidget} />);
  }
}

WebRTCVisitContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
};
WebRTCVisitContainer.defaultProps = {};
export default WebRTCVisitContainer;
