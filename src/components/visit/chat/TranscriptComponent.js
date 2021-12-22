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

import './TranscriptComponent.css';

class TranscriptComponent extends React.Component {
  buildNonAdminMessage(item, className) {
    return (
      <div key={item.ordinal} className={`chatMessage ${className}`}>
        <div>
          <div className="senderName">{item.fullName}</div>
          <div className="messageBody">
            {item.message}
          </div>
        </div>
      </div>);
  }

  buildMessage(item) {
    if (item.userType === awsdk.AWSDKUserType.PROVIDER || item.userType === awsdk.AWSDKUserType.ASSISTANT) {
      return this.buildNonAdminMessage(item, 'providerMessage');
    }
    if (item.userType === awsdk.AWSDKUserType.CONSUMER) {
      return this.buildNonAdminMessage(item, 'consumerMessage');
    }
    return <div key={item.ordinal} className="adminMessage">{item.message}</div>;
  }

  render() {
    const transcript = [];

    this.props.chatItems.forEach((item) => {
      transcript.push(this.buildMessage(item));
    });

    return (
      <div className="chatTranscript">
        {transcript}
        {this.props.sentMessage && this.buildNonAdminMessage(this.props.sentMessage, 'consumerMessage')}
      </div>
    );
  }
}
TranscriptComponent.propTypes = {
  chatItems: PropTypes.array.isRequired,
  sentMessage: PropTypes.object,
};

export default TranscriptComponent;
