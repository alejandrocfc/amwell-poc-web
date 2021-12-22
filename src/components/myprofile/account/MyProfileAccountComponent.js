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
import classNames from 'classnames';

import AccountCredentialsComponent from './AccountCredentialsComponent';
import AccountIdentificationComponent from './AccountIdentificationComponent';
import AccountPersonalInfoComponent from './AccountPersonalInfoComponent';
import AccountResidenceInfoComponent from './AccountResidenceComponent';
import AccountRemindersInfoComponent from './AccountRemindersComponent';
import AccountShippingAddressComponent from './AccountShippingAddressComponent';
import AccountSystemPreferencesComponent from './AccountSystemPreferencesComponent';

import './MyProfileAccountComponent.css';

const MyProfileAccountComponent = (props) => {
  props.logger.debug('MyProfileAccountComponent: props', props);

  const profileClass = classNames({
    myProfileAccountContent: true,
    isDependentCantEdit: props.isDependent,
  });

  return (
    <div className="myProfileContent">
      <div><span className="myProfileContentTitle">{props.messages.account}</span></div>
      <div><span className="myProfileContentDescription">{props.messages.my_profile_account_description}</span></div>
      <div>
        {!props.isDependent &&
        <div className="myProfileAccountContent">
          <AccountCredentialsComponent toggleEditCredentials={() => props.toggleSection('isEditCredentials')} {...props}/>
          <hr />
        </div>}
        <div className="myProfileAccountContent">
          <AccountIdentificationComponent toggleEditIdContainer={() => props.toggleSection('isEditIdentification')} {...props}/>
        </div>
        <div className="myProfileAccountContent">
          <hr />
          <AccountPersonalInfoComponent toggleEditPersonalInfo={() => props.toggleSection('isEditPersonalInfo')} {...props}/>
        </div>
        <div className={profileClass}>
          <hr />
          <AccountShippingAddressComponent toggleEditShippingAddress={() => props.toggleSection('isEditShippingAddress')} {...props}/>
        </div>
        <div className={profileClass}>
          <hr />
          <AccountResidenceInfoComponent toggleEditLegalResidence={() => props.toggleSection('isEditResidence')} {...props}/>
        </div>
        <div className={profileClass}>
          <hr />
          <AccountRemindersInfoComponent toggleEditReminders={() => props.toggleSection('isEditReminders')} {...props}/>
        </div>
        <div className={profileClass}>
          <hr />
          <AccountSystemPreferencesComponent toggleEditSystemPreferences={() => props.toggleSection('isEditSystemPreferences')} {...props}/>
        </div>
      </div>
    </div>
  );
};

MyProfileAccountComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfileAccountComponent.defaultProps = {};
export default MyProfileAccountComponent;
