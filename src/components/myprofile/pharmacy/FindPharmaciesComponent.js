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
import { Button, Container, Table } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import '../MyProfileComponent.css';
import MultiCountryPharmacySearchComponent from './MultiCountryPharmacySearchComponent';
import PharmacySearchComponent from './PharmacySearchComponent';


const FindPharmaciesComponent = (props) => {
  props.logger.debug('FindPharmaciesComponent: props', props);
  const typeLink = props.valueLinks.type;
  const zipCodeLink = props.valueLinks.zipCode;
  const cityLink = props.valueLinks.city;
  const stateLink = props.valueLinks.stateCode;
  const results = props.pharmacies ? props.pharmacies.length : 0;
  const selectedPharmacyId = props.selectedPharmacy ? props.selectedPharmacy.id.encryptedId : null;
  return (
    <div className="findPharmacy">
      <Container className="searchSection">
        {props.isMultiCountry &&
        <MultiCountryPharmacySearchComponent {...props}/>}
        {!props.isMultiCountry &&
        <PharmacySearchComponent {...props}/>}
        <Button tabIndex="6" id="find" name="find" onClick={() => props.findPharmacies()} disabled={!(zipCodeLink.value || cityLink.value || stateLink.value || typeLink.value === 'MailOrder')}>{props.messages.my_profile_pharmacy_find}</Button>
      </Container>
      <div className="resultSection">
        <div className="pharmacyList">
          <hr/>
          { props.pharmacies &&
          <div>
            <span><FormattedMessage id="my_profile_pharmacy_results" values={{ results }}/></span>
            <Table hover>
              <tbody>
                {props.pharmacies.map((pharmacy) => {
                  const city = `${pharmacy.address.city}, ${pharmacy.address.stateCode} ${pharmacy.address.zipCode}`;
                  return (
                    <tr key={pharmacy.id.encryptedId} className={selectedPharmacyId === pharmacy.id.encryptedId ? 'selected' : ''} onClick={() => props.selectPharmacy(pharmacy)}>
                      <td className="nameColumn" title={pharmacy.name}>{pharmacy.name}</td>
                      <td className="addressColumn" title={pharmacy.address.address1}>{pharmacy.address.address1}</td>
                      <td className="cityColumn" title={city}>{city}</td>
                      <td className="typeColumn" title={pharmacy.type}>{pharmacy.type}</td>
                    </tr>);
                })}
              </tbody>
            </Table>
          </div>}
        </div>
        <div className="buttonSection">
          <Button tabIndex="7" id="cancel" name="cancel" onClick={e => props.toggleAddPharmacy(e)}>{props.messages.my_profile_pharmacy_cancel}</Button>
          <Button tabIndex="8" id="add" name="add" disabled={!props.selectedPharmacy} onClick={e => props.addPharmacy(e, props.selectedPharmacy)}>{ (props.selectedPharmacy && props.selectedPharmacy.type === 'MailOrder') ? props.messages.my_profile_pharmacy_next : props.messages.my_profile_pharmacy_add}</Button>
        </div>
      </div>
    </div>
  );
};

FindPharmaciesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
FindPharmaciesComponent.defaultProps = {};
export default FindPharmaciesComponent;
