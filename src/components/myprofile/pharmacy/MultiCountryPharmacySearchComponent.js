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
import { Col, Row } from 'reactstrap';
import '../MyProfileComponent.css';
import { TextInput, Select } from '../../form/Inputs';


const MultiCountryPharmacySearchComponent = (props) => {
  props.logger.debug('MultiCountryPharmacySearchComponent: props', props);
  const typeLink = props.valueLinks.type;
  const zipCodeLink = props.valueLinks.zipCode;
  const cityLink = props.valueLinks.city;
  const countryLink = props.valueLinks.countryCode;
  const stateLink = props.valueLinks.stateCode;
  const selectedCountry = props.countries.length > 1 ? props.countries.find(c => c.code === countryLink.value) : props.countries[0];
  const states = selectedCountry ? selectedCountry.states : [];
  return (
    <Row className="multiCountry">
      <Col>
        <Select className="leftColumnInput" tabIndex="1" id="country" name="country" valueLink={countryLink}>
          <option value=''>{props.messages.my_profile_pharmacy_country}</option>
          {props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
        </Select>
        {selectedCountry &&
        <div>
          <Select disabled={zipCodeLink.value} className="leftColumnInput" tabIndex="2" id="state" name="state" valueLink={stateLink}>
            <option value=''>{props.messages.my_profile_pharmacy_state}</option>
            {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
          </Select>
          {stateLink.value &&
          <TextInput className="leftColumnInput" tabIndex="3" type="text" id="city" name="city" valueLink={cityLink} placeholder={props.messages.my_profile_pharmacy_city}/>}
        </div>}
      </Col>
      <Col>
        <Select className="pharmacyType" tabIndex="4" id="type" name="type" valueLink={typeLink}>
          <option value=''>{props.messages.my_profile_pharmacy_type}</option>
          <option value='Retail'>{props.messages.my_profile_pharmacy_retail}</option>
          <option value='MailOrder'>{props.messages.my_profile_pharmacy_mail_order}</option>
        </Select>
        {selectedCountry &&
        <div className="zipSection">
          <span>{props.messages.my_profile_pharmacy_or}</span>
          <TextInput disabled={stateLink.value} tabIndex="5" type="text" id="zipCode" name="zipCode" valueLink={zipCodeLink} placeholder={props.messages.my_profile_pharmacy_zip_code}/>
        </div>}
      </Col>
    </Row>
  );
};

MultiCountryPharmacySearchComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MultiCountryPharmacySearchComponent.defaultProps = {};
export default MultiCountryPharmacySearchComponent;
