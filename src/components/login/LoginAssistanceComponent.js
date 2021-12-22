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
import { FormattedMessage } from 'react-intl';
import { FormGroup, Form, Button, Label, Input } from 'reactstrap';
import PropTypes from 'prop-types';

import './Login.css';

class LoginAssistanceComponent extends Component {
  constructor() {
    super();
    this.state = {
      selectedOption: undefined,
    };
  }

  onContinue() {
    if (this.state.selectedOption === 'username') {
      this.props.history.push('/usernameAssistance');
    } else if (this.state.selectedOption === 'password') {
      this.props.history.push('/passwordAssistance');
    }
  }

  render() {
    return (
      <div id="login" className="loginAssistanceContainer">
        <div className='loginAssistanceForm'>
          <div className='blueFormHeader'> { this.props.messages.login_assistance_help } </div>
          <Form className="formGroupContent">
            <FormGroup check>
              <Label check>
                <Input onClick={() => this.setState({ selectedOption: 'password' })} value="password" type="radio" name="option" /> {' '}
                {this.props.messages.login_assistance_password_option}
              </Label>
            </FormGroup>
            <FormGroup check>
              <Label check>
                <Input onClick={() => this.setState({ selectedOption: 'username' })} value="username" type="radio" name="option" />{' '}
                {this.props.messages.login_assistance_username_option}
              </Label>
            </FormGroup>
            <div className="loginAssistanceSubtext"><FormattedMessage id="login_assistance_further_assistance" values={{ formattedNumber: this.props.messages.customer_support_phone_number }}/></div>
            <div className="continueButton">
              <Button color="success" id="continue" onClick={this.onContinue.bind(this)}>
                {this.props.messages.continue}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

LoginAssistanceComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
};

export default LoginAssistanceComponent;
