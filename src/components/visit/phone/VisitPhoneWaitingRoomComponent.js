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
import { FormattedMessage } from 'react-intl';

import WaitingSpinner from './images/waiting-spinner.png';
import ProviderPlaceholder from '../../provider/images/provider_photo_placeholder.png';

import './VisitPhoneWaitingRoomComponent.css';


const VisitPhoneWaitingRoomComponent = (props) => {
  const provider = props.visit.assignedProvider;
  return (
    <div className="visitForm visitPhoneWaitingRoomComponent">
      <div className="visitPhoneWaitingSpinnerLogo">
        <img alt="Spinner" src={WaitingSpinner}/>
        <img alt={provider.fullName} src={provider.logoUrl || ProviderPlaceholder}/>
      </div>
      <div className="visitPhoneWaitingMessage">
        <FormattedMessage
          className="next_to_speak" id="next_to_speak"
          defaultMessage={ props.messages.visit_phone_waiting_next }
          values={{ fullName: <span>{provider.fullName}</span>, specialty: <span>{provider.specialty.value}</span> }}
          tagName="div"/>
      </div>
      <div className="visitPhoneWaitingCancelSection">
        <FormattedMessage
          className="we_will_call" id="we_will_call"
          defaultMessage={ props.messages.visit_phone_waiting_when_ready }
          values={{ phoneNumber: <span>{props.visit.formattedInitiatorEngagementOverridePhone}</span> }}
          tagName="div"/>
        <div>
          {props.messages.visit_phone_waiting_close_window}
        </div>
        <button className="link-like" onClick={props.cancelVisit}>{props.messages.visit_phone_waiting_cancel}</button>
      </div>
    </div>
  );
};


VisitPhoneWaitingRoomComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
  cancelVisit: PropTypes.func.isRequired,
};
VisitPhoneWaitingRoomComponent.defaultProps = {};
export default VisitPhoneWaitingRoomComponent;
