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

import PhoneIcon from './images/phone-icon.png';

import './VisitPhoneInProgressComponent.css';


const VisitPhoneInProgressComponent = (props) => {
  const provider = props.visit.assignedProvider;
  return (
    <div className="visitForm visitPhoneInProgressComponent">
      <div className="visitPhoneInProgressLogo">
        <div className="visitPhoneInProgressAquaBg">
          <img alt="Phone" src={PhoneIcon}/>
        </div>
      </div>
      <div className="visitPhoneInProgressMessages">
        <FormattedMessage
          className="ready_to_speak" id="ready_to_speak"
          defaultMessage={ props.messages.visit_phone_in_progress_ready }
          values={{ fullName: <span>{provider.fullName}</span>, specialty: <span>{provider.specialty.value}</span> }}
          tagName="div"/>
        <FormattedMessage
          className="placing_a_call" id="placing_a_call"
          defaultMessage={ props.messages.visit_phone_in_progress_placing }
          values={{ phoneNumber: <span>{props.visit.formattedInitiatorEngagementOverridePhone}</span> }}
          tagName="div"/>
        <button className="visitButton" onClick={() => props.history.replace('/')}>{props.messages.visit_phone_in_progress_return_home}</button>
      </div>
    </div>
  );
};

VisitPhoneInProgressComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
};
VisitPhoneInProgressComponent.defaultProps = {};
export default VisitPhoneInProgressComponent;
