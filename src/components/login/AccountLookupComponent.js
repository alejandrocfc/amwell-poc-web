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
import PropTypes from 'prop-types';
import { DateInput, TextInput } from '../form/Inputs';
import './Login.css';
import LoginAssistanceCompleteComponent from './LoginAssistanceCompleteComponent';


class AccountLookupComponent extends Component {
  render() {
    const dobLink = this.props.valueLinks.dob;
    const lastNameLink = this.props.valueLinks.lastName;
    const emailLink = this.props.valueLinks.email;
    const isPasswordFlow = emailLink != null;
    const lookupMessage = this.props.isPassword ? this.props.messages.login_assistance_password_lookup_subtext : this.props.messages.login_assistance_username_lookup_subtext;
    return (
      <div>
        {!this.props.hasSubmitted ? (
          <Form className="formGroupContent">
            <div className="loginAssistanceText">{this.props.messages.login_assistance_username_lookup_text}</div>
            <div className="loginAssistanceSubtext">{lookupMessage}</div>
            <TextInput id="lastName" name="lastName" valueLink={lastNameLink} placeholder={this.props.messages.name_last_name} />
            <div className="dobLabel">{this.props.messages.registration_date_of_birth}</div>
            <DateInput id="dob" name="dob" className="loginDate" valueLink={dobLink} placeholder={this.props.messages.registration_date_of_birth} {...this.props} />
            {isPasswordFlow &&
            <TextInput id="email" name="email" valueLink={emailLink} placeholder={this.props.messages.my_profile_email} />
            }
            <div className="continueButton">
              <Button color="success" id="continue" onClick={this.props.submitLookup} disabled={!this.props.canSubmit}>
                {this.props.messages.submit}
              </Button>
            </div>
          </Form>
        ) : (
          <LoginAssistanceCompleteComponent {...this.props} isPasswordFlow={isPasswordFlow}/>
        )
        }
      </div>
    );
  }
}

AccountLookupComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  submitLookup: PropTypes.func.isRequired,
  valueLinks: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  isPassword: PropTypes.bool.isRequired,
};

export default AccountLookupComponent;
