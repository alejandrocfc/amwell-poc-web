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
import { Button } from 'reactstrap';

import './SessionExpired.css';

class SessionExpiredComponent extends React.Component {
  constructor(props) {
    super(props);
    this.logger = props.logger;
    this.logger.debug('SessionExpiredComponent', props);
    this.sdk = props.sdk;
    this.authenticated = props.authenticated;
    this.consumer = props.consumer;
    this.consumerLogoutCallback = props.consumerLogoutCallback;
    this.onContinueClick = this.onContinueClick.bind(this);
  }

  UNSAFE_componentWillMount() {
    if (this.sdk.initialized && this.authenticated) {
      if (this.consumer) {
        this.sdk.authenticationService.clearAuthentication(this.consumer);
      }
      this.consumerLogoutCallback();
    }
  }

  onContinueClick() {
    this.props.history.replace('/');
  }

  render() {
    return (
      <div id='sessionExpired'>
        <div id='sessionExpiredBody' className='sessionExpiredBody'>
          <div id='sessionExpiredHeader' className='sessionExpiredHeader' />
          <div id='sessionExpiredMessage' className='sessionExpiredMessage'>{this.props.messages.session_expired}</div>
          <Button id='sessionExpiredButton' className='sessionExpiredButton' onClick={this.onContinueClick}>{this.props.messages.continue}</Button>
        </div>
      </div>
    );
  }
}

SessionExpiredComponent.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumerLogoutCallback: PropTypes.func.isRequired,
};
export default SessionExpiredComponent;
