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
import classNames from 'classnames';
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { EmailInput } from '../../form/Inputs';
import { truncateForDisplay, concatNames } from '../../Util';
import '../MyProfileComponent.css';
import Name from '../../form/NameComponent';

const AccountIdentificationComponent = (props) => {
  props.logger.debug('AccountIdentificationComponent: props', props);

  const emailLink = props.valueLinks.email;

  const nameLinks = {
    firstNameLink: props.valueLinks.firstName,
    middleNameOrInitialLink: props.valueLinks.middleNameOrInitial,
    lastNameLink: props.valueLinks.lastName,
  };

  const disabledNameFields = {
    firstNameDisabled: props.isFieldProtected('firstName'),
    middleNameDisabled: props.isFieldProtected('middleName'),
    middleInitialDisabled: props.isFieldProtected('middleInitial'),
    lastNameDisabled: props.isFieldProtected('lastName'),
  };

  const emailClass = classNames({
    myProfileValueContainer: true,
    isDependentCantEdit: props.isDependent,
  });
  const separator = ' ';
  const displayFullName = truncateForDisplay(concatNames(props.currentConsumer.firstName, props.currentConsumer.lastName, nameLinks.middleNameOrInitialLink.value, separator, props.direction), 60);
  return (
    <div>
      <div className="myProfileContentSubheader">
        {props.messages.my_profile_identification}
        <span key="1" className="myProfileSeparator">|</span>
        <span key="2" className="myProfileLink" onClick={() => props.toggleEditIdContainer()}>{props.messages.edit}</span>
      </div>
      <div className="myProfileContentDescription">{props.messages.my_profile_identification_description}</div>
      {props.isEditIdentification ? (
        <div className="editContainer">
          <div className="myProfileInputContainer" >
            <Name tabIndex="6" prefix="myAccount" {...nameLinks} {...disabledNameFields} {...props}/>
          </div>
          {!props.isDependent &&
          <div className="myProfileInputContainer">
            <EmailInput tabIndex="8" id="consumerEmail" className="emailInput" name="email" placeholder={props.messages.registration_email} valueLink={emailLink} disabled={props.isFieldProtected('email')}/>
          </div>
          }
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="9" className="myProfileAccountBtn" onClick={() => props.toggleEditIdContainer()}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="10" className="myProfileAccountBtn" onClick={e => props.updateMyProfileAccount(e, 'identification')}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_name}</div>
              <div>{displayFullName}</div>
            </div>
          </div>
          {!props.isDependent &&
          <div className={emailClass}>
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_email}</div>
              <div>{props.currentConsumer.email}</div>
            </div>
          </div>}
        </div>
      )}
    </div>
  );
};

AccountIdentificationComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountIdentificationComponent.defaultProps = {};
export default AccountIdentificationComponent;
