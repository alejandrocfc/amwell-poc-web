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
import '../MyProfileComponent.css';
import LegalResidence from '../../form/LegalResidenceComponent';

const AccountResidenceInfoComponent = (props) => {
  props.logger.debug('AccountResidenceInfoComponent: props', props);

  const legalResidenceLink = props.valueLinks.legalResidence;

  return (
    <div>
      <div className="myProfileContentSubheader">
        {props.messages.my_profile_current_location}
        {!props.isDependent &&
        <span>
          <span className="myProfileSeparator">|</span>
          <span className="myProfileLink" onClick={() => props.toggleEditLegalResidence()}>{props.messages.edit}</span>
        </span>
        }
      </div>
      <div className="myProfileContentDescription">
        {props.messages.my_profile_current_location_description}
      </div>
      {props.isEditResidence ? (
        <div className="editContainer">
          <div className="myProfileInputContainer">
            <LegalResidence tabIndex="26" countries={props.countries} messages={props.messages} legalResidenceLink={legalResidenceLink} {...props} />
          </div>
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="28" className="myProfileAccountBtn" onClick={() => props.toggleEditLegalResidence()}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="29" className="myProfileAccountBtn" onClick={e => props.updateMyProfileAccount(e, 'residence')}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div>
          {props.isMultiCountry &&
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_country}</div>
              <div>{props.currentConsumer.legalResidence.countryName}</div>
            </div>
          </div>}
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_state}</div>
              <div>{props.currentConsumer.legalResidence.name}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

AccountResidenceInfoComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountResidenceInfoComponent.defaultProps = {};
export default AccountResidenceInfoComponent;
