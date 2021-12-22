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

import React from 'react';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';

import VisitHeader from '../components/visit/VisitHeaderComponent';
import VisitEnded from '../components/visit/VisitEndedComponent';

class VisitEndedContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitEndedContainer: props', props);
    this.state = {
      visit: props.location.state ? awsdk.AWSDKFactory.restoreVisit(props.location.state.visit) : null,
    };
  }

  componentDidMount() {
    if (!this.state.visit) {
      this.logger.info('Navigation error', this.props.location);
      this.props.showErrorModal();
    }
  }

  visitDone(e) {
    if (e) e.preventDefault();
    this.props.history.replace('/');
  }

  render() {
    const disposition = this.state.visit.disposition;

    let visitDispositionTitle = '';
    if (disposition === awsdk.AWSDKDisposition.ConsumerCanceled || disposition === awsdk.AWSDKDisposition.Bailed) {
      visitDispositionTitle = this.props.messages.visit_canceled_title;
    } else if (disposition === awsdk.AWSDKDisposition.Declined) {
      visitDispositionTitle = this.props.messages.visit_declined_title;
    } else {
      visitDispositionTitle = this.props.messages.visit_ended_title;
    }

    return (
      <VisitHeader id="visitEnded" icon='ended' title={visitDispositionTitle}>
        <VisitEnded key="visitEnded" visit={this.state.visit} visitDone={this.visitDone.bind(this)} {...this.props} />
      </VisitHeader>
    );
  }
}

VisitEndedContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitEndedContainer.defaultProps = {};
export default VisitEndedContainer;
