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
import { Button } from 'reactstrap';
import '../MyProfileComponent.css';

const ConsumerPharmaciesComponent = (props) => {
  props.logger.debug('ConsumerPharmaciesComponent: props', props);

  const selectedId = props.selectedConsumerPharmacy ? props.selectedConsumerPharmacy.id.persistentId : null;
  const preferredId = props.preferredPharmacy ? props.preferredPharmacy.id.persistentId : null;
  const consumerPharmacies = props.consumerPharmacies.sort((p1, p2) => ![p1.id.persistentId, p2.id.persistentId].includes(preferredId) && p1.name > p2.name).map((p) => {
    const isPreferred = preferredId === p.id.persistentId;
    const isSelected = selectedId === p.id.persistentId;

    return (
      <div key={p.id.encryptedId}>
        <input className="consumerPharmacyRadio" type="radio" value={p.id.persistentId} checked={isSelected} onChange={props.setPreferred}/>
        <div className="consumerPharmacyMultiple">
          <Pharmacy pharmacy={p} preferred={isPreferred} {...props}/>
        </div>
      </div>);
  });

  return (
    <div className="consumerPharmacies">
      <div className="consumerPharmaciesTitle">{props.messages.my_profile_pharmacy_consumer_description}</div>
      {props.consumerPharmacies.length === 1 &&
      <div className="consumerPharmacySingle">
        <Pharmacy pharmacy={props.consumerPharmacies[0]} {...props}/>
      </div>}
      {props.consumerPharmacies.length > 1 &&
      <div>
        {consumerPharmacies}
        <Button id="save" name="save" disabled={ preferredId === selectedId } onClick={e => props.savePreferredPharmacy(e, props.selectedConsumerPharmacy)}>{props.messages.save}</Button>
      </div>}
    </div>
  );
};

function Pharmacy(props) {
  return (
    <div className="consumerPharmacy">
      <div className="pharmacyName">{props.pharmacy.name} {props.preferred && <span className="preferred">{props.messages.my_profile_pharmacy_consumer_primary}</span>}</div>
      <div>{props.pharmacy.address.address1}</div>
      {props.pharmacy.address.address2 && <div>{props.pharmacy.address.address2}</div>}
      <div>{props.pharmacy.address.city}, {props.pharmacy.address.stateCode} {props.pharmacy.address.zipCode}</div>
      {props.pharmacy.type === 'Retail' && <div>{props.pharmacy.phone}</div>}
      {props.pharmacy.type === 'MailOrder' &&
      <div>
        <div>{props.messages.my_profile_pharmacy_consumer_phone}: {props.pharmacy.phone}</div>
        <div>{props.messages.my_profile_pharmacy_consumer_fax}: {props.pharmacy.fax}</div>
        <div>{props.messages.my_profile_pharmacy_consumer_email}: {props.pharmacy.email}</div>
      </div>
      }
      <div className="pharmacyLinks">
        <button className="link-like" onClick={e => props.deletePharmacy(e, props.pharmacy)}>{props.messages.my_profile_pharmacy_consumer_remove}</button>
        {props.pharmacy.type === 'MailOrder' &&
        <span> | <a href='/myprofile/account'>{props.messages.my_profile_pharmacy_edit_shipping}</a></span>}
      </div>
    </div>);
}

ConsumerPharmaciesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
ConsumerPharmaciesComponent.defaultProps = {};
export default ConsumerPharmaciesComponent;
