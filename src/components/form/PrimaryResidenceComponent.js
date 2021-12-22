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
import { FormGroup } from 'reactstrap';

import { Select, TextInput } from './Inputs';

class PrimaryResidenceComponent extends React.Component {
  render() {
    this.props.logger.debug('Properties: ', this.props);
    const countryCodeLink = this.props.valueLinks.addressCountryCode;
    const stateCodeLink = this.props.valueLinks.addressStateCode;
    const address1Link = this.props.valueLinks.address1;
    const address2Link = this.props.valueLinks.address2;
    const cityLink = this.props.valueLinks.city;
    const zipCodeLink = this.props.valueLinks.zipCode;
    const countries = this.props.countries;
    const selectedCountry = countries.length > 1 ? this.props.countries.find(country => country.code === countryCodeLink.value) : countries[0];
    const states = selectedCountry ? selectedCountry.states.filter(state => state.legalAddress) : [];
    const countryTabIndex = this.props.tabIndex;
    const address1TabIndex = Number(countryTabIndex) + 1;
    const address2TabIndex = address1TabIndex + 1;
    const cityTabIndex = address2TabIndex + 1;
    const stateTabIndex = cityTabIndex + 1;
    const zipCodeTabIndex = stateTabIndex + 1;

    return (
      <FormGroup key="primaryResidence">
        <div className="primaryResidenceTitle" id="primaryResidenceTitle">{this.props.messages.registration_primary_residence_title}</div>
        {this.props.isMultiCountry &&
          <Select id="primaryResidenceCountry" name="primaryResidenceCountryCode" valueLink={countryCodeLink} requiredClass='errorInput' disabled={this.props.disabled} tabIndex={countryTabIndex}>
            <option value='' disabled hidden>{this.props.messages.registration_country}</option>
            {this.props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
          </Select>
        }
        {this.props.isMultiCountry && countryCodeLink.error &&
          <div className='error'>{countryCodeLink.error}</div>
        }
        <TextInput tabIndex={address1TabIndex} id="registrationAddress1" name="address1" placeholder={this.props.messages.registration_address1} valueLink={address1Link} />
        <TextInput tabIndex={address2TabIndex} id="registrationAddress2" name="address2" placeholder={this.props.messages.registration_address2} valueLink={address2Link} />
        <TextInput tabIndex={cityTabIndex} id="registrationCity" name="city" placeholder={this.props.messages.registration_city} valueLink={cityLink} />
        <div className="registrationPrimaryResidenceStateAndZip" id="registrationPrimaryResidenceStateAndZip">
          <div id="primaryResidenceStateWrapper" className="primaryResidenceWrapper">
            {selectedCountry &&
              <div>
                <Select id="primaryResidenceState" name="primaryResidenceStateCode" valueLink={stateCodeLink} requiredClass='errorInput' disabled={this.props.disabled} tabIndex={stateTabIndex}>
                  <option value='' disabled hidden>{this.props.messages.registration_state}</option>
                  {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
                </Select>
              </div>
            }
            { stateCodeLink.error &&
              <div className='error'>{stateCodeLink.error}</div>
            }
          </div>
          <div id="primaryResidenceZipCodeWrapper" className="primaryResidenceWrapper">
            <TextInput tabIndex={zipCodeTabIndex} id="registrationZipCode" name="zipCode" placeholder={this.props.messages.registration_zip_code} valueLink={zipCodeLink} />
          </div>
        </div>
      </FormGroup>
    );
  }
}
PrimaryResidenceComponent.propTypes = {
  isMultiCountry: PropTypes.bool,
  countries: PropTypes.arrayOf(PropTypes.object),
  tabIndex: PropTypes.string.isRequired,
  messages: PropTypes.any.isRequired,
};
export default PrimaryResidenceComponent;
