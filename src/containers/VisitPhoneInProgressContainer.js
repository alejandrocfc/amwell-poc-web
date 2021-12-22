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

import VisitPhoneInProgressComponent from '../components/visit/phone/VisitPhoneInProgressComponent';
import VisitHeader from '../components/visit/VisitHeaderComponent';


class VisitPhoneInProgressContainer extends React.Component {
  constructor(props) {
    super();
    props.logger.info('VisitPhoneInProgressContainer: props', props);
    this.state = {
      visit: awsdk.AWSDKFactory.restoreVisit(props.location.state.visit),
    };
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this._isMounted = true;
    this.props.sdk.visitService.waitForVisitToFinish(this.state.visit)
      .then((visit) => {
        // We only want to transition to these pages if we're still on this page,
        // the user has the option to 'return home' if they wish
        if (this._isMounted) {
          if (visit.disposition === awsdk.AWSDKDisposition.ProviderWrapup || visit.disposition === awsdk.AWSDKDisposition.Completed) {
            this.props.history.replace('/visit/summary', { visit: visit.toString() });
          } else {
            this.props.history.replace('/visit/ended', { visit: visit.toString() });
          }
        }
      })
      .catch(error => this.handleError(error));
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else {
      this.props.showErrorModal();
    }
  }

  render() {
    const properties = {
      visit: this.state.visit,
    };
    return (
      <VisitHeader id="visitPhoneInProgressContainer" icon='visit' title={this.props.messages.visit_your_visit}>
        <VisitPhoneInProgressComponent {...properties} {...this.props} />
      </VisitHeader>
    );
  }
}

VisitPhoneInProgressContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
export default VisitPhoneInProgressContainer;
