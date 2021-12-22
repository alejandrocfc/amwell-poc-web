/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2018 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { Select, TextInput } from './Inputs';

const AddressComponent = (props) => {
  const countryCodeLink = props.addressLinks.countryCode;
  const stateCodeLink = props.addressLinks.stateCode;
  const address1Link = props.addressLinks.address1;
  const address2Link = props.addressLinks.address2;
  const cityLink = props.addressLinks.city;
  const zipCodeLink = props.addressLinks.zipCode;

  const selectedCountry = props.countries.length > 1 ? props.countries.find(country => country.code === countryCodeLink.value) : props.countries[0];
  const states = selectedCountry ? selectedCountry.states.filter(state => state.legalAddress) : [];

  const countryTabIndex = props.tabIndex;
  const address1TabIndex = Number(countryTabIndex) + 1;
  const address2TabIndex = address1TabIndex + 1;
  const cityTabIndex = address2TabIndex + 1;
  const stateTabIndex = cityTabIndex + 1;
  const zipCodeTabIndex = stateTabIndex + 1;
  const idPrefix = props.idPrefix || '';
  const zipCodeClassNames = classNames('zipCode', { 'no-same-line-sibling': !selectedCountry });

  return (
    <div>
      {props.isMultiCountry &&
        <Select id={`${idPrefix}country`} valueLink={countryCodeLink} requiredClass='errorInput' disabled={props.disabled.country} tabIndex={countryTabIndex}>
          <option value='' disabled hidden>{props.messages.registration_country}</option>
          {props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
        </Select>
      }
      {props.isMultiCountry && countryCodeLink.error &&
        <div className='error'>{countryCodeLink.error}</div>
      }
      <TextInput id={`${idPrefix}address1`} disabled={props.disabled.address1} tabIndex={address1TabIndex} placeholder={props.messages.registration_address1} valueLink={address1Link} />
      <TextInput id={`${idPrefix}address2`} disabled={props.disabled.address2} tabIndex={address2TabIndex} placeholder={props.messages.registration_address2} valueLink={address2Link} />
      <TextInput id={`${idPrefix}city`} disabled={props.disabled.city} tabIndex={cityTabIndex} placeholder={props.messages.registration_city} valueLink={cityLink} />
      <div className="stateAndZipContainer">
        {selectedCountry &&
          <Select id={`${idPrefix}state`} className="state" valueLink={stateCodeLink} requiredClass='errorInput' disabled={props.disabled.state} tabIndex={stateTabIndex}>
            <option value='' disabled hidden>{props.messages.registration_state}</option>
            {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
          </Select>
        }
        {stateCodeLink.error &&
          <div className='error'>{stateCodeLink.error}</div>
        }
        <TextInput id={`${idPrefix}zipCode`} className={zipCodeClassNames} disabled={props.disabled.zipCode} tabIndex={zipCodeTabIndex} placeholder={props.messages.registration_zip_code} valueLink={zipCodeLink} />
      </div>
    </div>
  );
};

AddressComponent.propTypes = {
  countries: PropTypes.arrayOf(PropTypes.object).isRequired,
  messages: PropTypes.any.isRequired,
  addressLinks: PropTypes.object.isRequired,
  disabled: PropTypes.object.isRequired,
  tabIndex: PropTypes.string,
  isMultiCountry: PropTypes.bool,
};
export default AddressComponent;
