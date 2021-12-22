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
import '../MyProfileComponent.css';
import FindPharmacies from './FindPharmaciesComponent';
import ConsumerPharmacies from './ConsumerPharmaciesComponent';
import PharmacyAddressPickerComponent from './PharmacyAddressPickerComponent';


const MyProfilePharmacyComponent = (props) => {
  props.logger.debug('MyProfilePharmacyComponent: props', props);
  return (
    <div className="myProfileContent">
      <div>
        <span className="myProfileContentTitle">{props.messages.pharmacy2}</span>
        <span className="myProfileContentTitle titleDivider"> | </span>
        {!props.showAddPharmacy &&
        <span className="myProfileContentTitle addPharmacyLink"><button className="link-like" onClick={e => props.toggleAddPharmacy(e)}>{props.messages.my_profile_pharmacy_add_a_pharmacy}</button></span>}
        {props.showAddPharmacy &&
        <span className="myProfileContentTitle grayedOutLink">{props.messages.my_profile_pharmacy_add_a_pharmacy}</span>}
      </div>
      <div><span className="myProfileContextDescription">{props.messages.my_profile_pharmacy_description}</span></div>
      <div className="myProfilePharmacyContent">
        <PharmacyAddressPickerComponent {...props}/>
        {props.showAddPharmacy &&
        <FindPharmacies {...props}/>}
        {!props.showAddPharmacy && props.consumerPharmacies && props.consumerPharmacies.length > 0 &&
        <ConsumerPharmacies {...props}/>}
      </div>
    </div>
  );
};

MyProfilePharmacyComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfilePharmacyComponent.defaultProps = {};
export default MyProfilePharmacyComponent;
