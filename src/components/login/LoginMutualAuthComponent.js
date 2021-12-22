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

import React, { Component } from 'react';
import { Form, Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

import { TextInput } from '../form/Inputs';

import './Login.css';

class LoginMutualAuthComponent extends Component {
  render() {
    const tokenLink = this.props.valueLinks.token;

    return (
      <div id="login">
        <div className='loginForm'>
          <Form className="formGroupContent">
            <TextInput id="token" name="token" valueLink={tokenLink} placeholder={this.props.messages.login_token_prompt} />
            <div className="loginButton">
              <Button color="success" id="submit" onClick={this.props.submitMutualAuth}>
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
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

LoginMutualAuthComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitMutualAuth: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};

export default LoginMutualAuthComponent;
