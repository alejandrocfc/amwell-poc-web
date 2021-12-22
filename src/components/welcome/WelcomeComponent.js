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

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import './WelcomeComponent.css';

// this component is now really dumb :)
class WelcomeComponent extends Component {
  constructor(props) {
    super(props);
    this.messages = props.messages;
    this.onClose = props.onClose;
    this.showWelcomeText = props.showWelcomeText;
  }

  render() {
    if (!this.showWelcomeText) {
      return (
        <div id='welcome'>
          <div id='overlay' className='overlay'></div>
        </div>
      );
    }
    return (
      <div id='welcome'>
        <div id='overlay' className='overlay'>
          <div id='welcomeBody' className='welcomeBody'>
            <div id='welcomeTitle' className='welcomeTitle'>{this.props.messages.welcome}</div>
            <div id='welcomeMessage' className='welcomeMessage'>{this.props.messages.welcome_message}</div>
            <Button id='welcomeButton' className='welcomeButton' onClick={this.onClose.bind(this)}>{this.props.messages.continue}</Button>
          </div>
        </div>
      </div>
    );
  }
}

WelcomeComponent.propTypes = {
  messages: PropTypes.any.isRequired,
};

export default WelcomeComponent;
