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
import { FormattedDate } from 'react-intl';
import '../MyProfileComponent.css';
import { DateInput, GenderInput, PhoneNumberInput } from '../../form/Inputs';
import AddressComponent from '../../form/AddressComponent';

const AccountPersonalInfoComponent = (props) => {
  props.logger.debug('AccountPersonalInfoComponent: props', props);

  const dobLink = props.valueLinks.dob;
  const genderLink = props.valueLinks.gender;
  const genderIdentityLink = props.valueLinks.genderIdentity;
  const phoneLink = props.valueLinks.phone;
  const homeAddressLinks = {
    address1: props.valueLinks.homeAddress1,
    address2: props.valueLinks.homeAddress2,
    city: props.valueLinks.homeCity,
    zipCode: props.valueLinks.homeZipCode,
    stateCode: props.valueLinks.homeStateCode,
    countryCode: props.valueLinks.homeCountryCode,
  };

  const homeAddressDisabledFields = {
    address1: props.isFieldProtected('address1'),
    address2: props.isFieldProtected('address2'),
    city: props.isFieldProtected('city'),
    zipCode: props.isFieldProtected('zipCode'),
    state: props.isFieldProtected('state'),
  };

  const disabledIfDependentClass = classNames({
    myProfileValueContainer: true,
    isDependentCantEdit: props.isDependent,
  });

  return (
    <div className="personalInfo">
      <div className="myProfileContentSubheader">
        {props.messages.my_profile_personal_information}
        <span className="myProfileSeparator">|</span>
        <span className="myProfileLink" onClick={() => props.toggleEditPersonalInfo()}>{props.messages.edit}</span>
      </div>
      <div className="myProfileContentDescription">{props.messages.my_profile_personal_information_description}</div>
      {props.isEditPersonalInfo ? (
        <div className="editContainer">
          <div className="myProfileInputContainer">
            <DateInput tabIndex="11" id="myAccountDob" className="myAccountDob" valueLink={dobLink} disabled={props.isFieldProtected('dob')} {...props} />
          </div>
          <div className="myProfileInputContainer">
            <GenderInput tabIndex="14" className="myAccountGender" genderIdentityLink={genderIdentityLink} genderLink={genderLink} disabled={props.isFieldProtected('gender')} {...props} />
          </div>
          {!props.isDependent &&
          <div>
            <div className="myProfileInputContainer">
              <PhoneNumberInput locale={props.locale} tabIndex="15" id="myAccountPhone" className="myAccountPhoneNumber" name="phone" placeholder={props.messages.visit_summary_phone} valueLink={phoneLink} disabled={props.isFieldProtected('phone')}/>
            </div>
            <div className="myProfileContentSubheader">{props.messages.my_profile_home_address}</div>
            <div className="myProfileInputContainer address">
              <AddressComponent idPrefix='PersonalInfo-' tabIndex="16" addressLinks={homeAddressLinks} disabled={homeAddressDisabledFields} {...props}/>
            </div>
          </div>
          }
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="27" className="myProfileAccountBtn" onClick={() => props.toggleEditPersonalInfo()}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="28" className="myProfileAccountBtn" onClick={e => props.updateMyProfileAccount(e, 'personal')} disabled={!props.canSubmitPersonalInfo()}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_dob}</div>
              <div><FormattedDate value={props.dobForDisplay} year='numeric' month='long' day='numeric' timeZone='UTC' /></div>
            </div>
          </div>
          {props.genderSupportEnabled &&
            <div className="myProfileValueContainer">
              <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_gender}</div>
              <div>{props.currentConsumer.genderIdentity ? props.currentConsumer.genderIdentity.genderText : ''}</div>
            </div>
          </div>
          }
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.genderSupportEnabled ? props.messages.my_profile_biologicalSex : props.messages.my_profile_gender}</div>
              <div>{props.currentConsumer.localizedGender}</div>
            </div>
          </div>
          <div className={disabledIfDependentClass}>
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_home_address}</div>
              <div dangerouslySetInnerHTML={{ __html: props.currentConsumer.address && props.currentConsumer.address.formattedAddress && props.currentConsumer.address.formattedAddress.replace(/\n/g, '<br>') }} />
            </div>
          </div>
          <div className={disabledIfDependentClass}>
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_country}</div>
              <div>{props.currentConsumer.address && props.currentConsumer.address.countryName}</div>
            </div>
          </div>
          <div className={disabledIfDependentClass}>
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_phone}</div>
              <div className="myAccountPhoneNumber">{props.currentConsumer.phone}</div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

AccountPersonalInfoComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountPersonalInfoComponent.defaultProps = {};
export default AccountPersonalInfoComponent;
