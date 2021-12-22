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
import { Form, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { Checkbox, PasswordInput, TextInput } from '../form/Inputs';

import './Login.css';

class LoginComponent extends Component {
  render() {
    const usernameLink = this.props.valueLinks.username;
    const passwordLink = this.props.valueLinks.password;
    const rememberMeLink = this.props.valueLinks.rememberMe;

    return (
      <div id="login">
        <div className='loginForm'>
          <Form className="formGroupContent">
            <TextInput id="username" name="username" valueLink={usernameLink} placeholder={this.props.messages.login_username_prompt} />
            <PasswordInput id="password" name="password" valueLink={passwordLink} placeholder={this.props.messages.login_password_prompt} />
            <Checkbox className="rememberMe" id="rememberMe" name="rememberMe" checkedLink={rememberMeLink}>
              {this.props.messages.login_remember_me}
            </Checkbox>
            <div className="loginAssistance">
              <Link to={'/loginAssistance'}>{this.props.messages.login_reminder_question}</Link>
            </div>
            <div className="loginButton">
              <Button color="success" id="submit" type="submit" onClick={this.props.submitLogin}>
                {this.props.messages.login_button}
              </Button>
            </div>
            <div className="loginSignup">
              <div className="signUpPrompt">
                {this.props.messages.login_dont_have_account_question}
              </div>
              <div className="signUp">
                <Link to={'/registration'}>{this.props.messages.login_account_sign_up}</Link>
              </div>
              <div className="loginFooter">
                <Link to={'/testMyComputer'}>{this.props.messages.test_my_computer}</Link> | <Link to={'/setup'}>{this.props.messages.setup_configuration}</Link>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

LoginComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitLogin: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};

export default LoginComponent;
