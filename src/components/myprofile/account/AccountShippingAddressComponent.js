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
import AddressComponent from '../../form/AddressComponent';

const AccountShippingAddressComponent = (props) => {
  props.logger.debug('AccountShippingAddressComponent: props', props);

  const shippingAddressLinks = {
    address1: props.valueLinks.shippingAddress1,
    address2: props.valueLinks.shippingAddress2,
    city: props.valueLinks.shippingCity,
    zipCode: props.valueLinks.shippingZipCode,
    stateCode: props.valueLinks.shippingStateCode,
    countryCode: props.valueLinks.shippingCountryCode,
  };

  return (
    <div className="shippingAddress">
      <div className="myProfileContentSubheader">
        {props.messages.my_profile_shipping_address_caps}
        {!props.isDependent &&
        <span>
          <span className="myProfileSeparator">|</span>
          <span className="myProfileLink" onClick={() => props.toggleEditShippingAddress()}>{props.messages.edit}</span>
        </span>
        }
      </div>
      <div className="myProfileContentDescription">{props.messages.my_profile_shipping_address_description}</div>
      {props.isEditShippingAddress ? (
        <div className="editContainer">
          <div>
            <div className="myProfileInputContainer address">
              <AddressComponent idPrefix='ShippingAddress-' tabIndex="20" addressLinks={shippingAddressLinks} disabled={{}} {...props}/>
            </div>
          </div>
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="27" className="myProfileAccountBtn" onClick={() => { props.toggleEditShippingAddress(); props.setShippingAddressInputs(); }}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="28" className="myProfileAccountBtn" onClick={e => props.updateMyProfileAccount(e, 'shipping')} disabled={!props.canSubmitShippingAddress()}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_shipping_address}</div>:
              <div dangerouslySetInnerHTML={{ __html: props.existingShippingAddress && props.existingShippingAddress.formattedAddress.replace(/\n/g, '<br>') }} />
            </div>
          </div>
          <div className="myProfileValueContainer">
            <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_country}</div>
              <div>{props.existingShippingAddress && props.existingShippingAddress.countryName}</div>
            </div>
          </div>
        </div>)}
    </div>
  );
};

AccountShippingAddressComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountShippingAddressComponent.defaultProps = {};
export default AccountShippingAddressComponent;
