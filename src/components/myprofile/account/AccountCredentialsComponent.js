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
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { EmailInput } from '../../form/Inputs';
import Password from '../../form/PasswordComponent';
import '../MyProfileComponent.css';

const AccountCredentialsComponent = (props) => {
  props.logger.debug('AccountCredentialsComponent: props', props);

  const emailLink = props.valueLinks.email;
  const passwordLink = props.valueLinks.password;
  const confirmPasswordLink = props.valueLinks.confirmPassword;

  return (
    <div>
      <div className="myProfileContentSubheader loginCredentials">
        {props.messages.my_profile_login_credentials}
        {!props.isDependent &&
        <span>
          <span className="myProfileSeparator">|</span>
          <span className="myProfileLink" onClick={() => props.toggleEditCredentials()}>{props.messages.edit}</span>
        </span>
        }
      </div>
      {props.isEditCredentials ? (
        <div className="editContainer">
          <div className="myProfileInputContainer">
            <EmailInput tabIndex="1" id="consumerEmail" className="emailInput" name="email" placeholder={props.messages.login_username_prompt} valueLink={emailLink} />
          </div>
          <div className="myProfileInputContainer">
            <Password tabIndex="2" id="myProfilePassword" name="password" passwordLink={passwordLink} placeholder={props.messages.registration_password} {...props} />
            <Password tabIndex="3" id="myProfileConfirmPassword" name="confirmPassword" passwordLink={confirmPasswordLink} placeholder={props.messages.registration_confirm_password} {...props} />
          </div>
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="4" className="myProfileAccountBtn" onClick={() => props.toggleEditCredentials()}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="5" className="myProfileAccountBtn" disabled={!emailLink.value} onClick={e => props.updateMyProfileAccount(e, 'credentials')}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{`${props.messages.login_username_prompt}:`}</div><div>{props.currentConsumer.email}</div></div>
          </div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{`${props.messages.registration_password}:`}</div><div>******</div></div>
          </div>
        </div>
      )}
    </div>
  );
};

AccountCredentialsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountCredentialsComponent.defaultProps = {};
export default AccountCredentialsComponent;
