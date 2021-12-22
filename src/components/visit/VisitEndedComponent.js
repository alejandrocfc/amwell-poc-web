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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { FormattedHTMLMessage } from 'react-intl';

import './VisitComponents.css';

class VisitEndedComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('VisitEndedComponent: props', props);
  }

  render() {
    const disposition = this.props.visit.disposition;
    let messageText = null;
    let buttonText = this.props.messages.visit_done;

    if (disposition === awsdk.AWSDKDisposition.ConsumerCanceled) {
      messageText = <div className="visitMessage">{this.props.messages.visit_canceled}</div>;
    } else if (disposition === awsdk.AWSDKDisposition.Bailed || disposition === awsdk.AWSDKDisposition.Declined) {
      const message = disposition === awsdk.AWSDKDisposition.Bailed ? this.props.messages.visit_provider_canceled : this.props.messages.visit_declined;
      messageText = <FormattedHTMLMessage id="visitMessage" className='visitMessage'
        defaultMessage={ message }
        values={{ doctor: this.props.visit.assignedProvider.fullName, specialty: this.props.visit.assignedProvider.specialty.value }}/>;
    } else {
      messageText = <div className="visitMessage">{this.props.messages.visit_ended_message}</div>;
      buttonText = this.props.messages.ok;
    }

    return (
      <div className="visitForm">
        <div className="visitEnded">
          {messageText}
        </div>
        <div id="visitEndedSubmit" className="visitSubmit">
          <Button id="submit" className='visitButton' onClick={this.props.visitDone}>{buttonText}</Button>
        </div>
      </div>
    );
  }
}

VisitEndedComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
  visitDone: PropTypes.func.isRequired,
};
VisitEndedComponent.defaultProps = {};
export default VisitEndedComponent;
