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
import { FormGroup } from 'reactstrap';
import ValueLink from 'valuelink';

import { Select } from './Inputs';

class LegalResidenceComponent extends React.Component {
  render() {
    this.props.logger.debug('Properties: ', this.props);
    const countryCodeLink = this.props.legalResidenceLink.at('countryCode');
    countryCodeLink.error = this.props.legalResidenceLink.error;
    const stateCodeLink = this.props.legalResidenceLink.at('stateCode');
    stateCodeLink.error = this.props.legalResidenceLink.error;
    const countries = this.props.countries;
    const selectedCountry = countries.length > 1 ? this.props.countries.find(country => country.code === countryCodeLink.value) : countries[0];
    const states = selectedCountry ? selectedCountry.states.filter(state => state.legalResidence) : [];
    const countryTabIndex = this.props.tabIndex;
    const stateTabIndex = Number(this.props.tabIndex) + 1;

    return (
      <FormGroup key="legalResidence">
        <div className="legalResidenceTitle" id="legalResidenceTitle">{this.props.messages.registration_current_location_title}</div>
        {this.props.isMultiCountry &&
          <Select id="legalResidenceCountry" name="countryCode" valueLink={countryCodeLink} requiredClass='errorInput' disabled={this.props.disabled} tabIndex={countryTabIndex}>
            <option value='' disabled hidden>{this.props.messages.registration_country}</option>
            {this.props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
          </Select>
        }
        {selectedCountry &&
          <Select id="legalResidenceState" name="stateCode" valueLink={stateCodeLink} requiredClass='errorInput' disabled={this.props.disabled} tabIndex={stateTabIndex}>
            <option value='' disabled hidden>{this.props.messages.registration_state}</option>
            {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
          </Select>
        }
        { this.props.legalResidenceLink.error &&
          <div className='error'>{this.props.legalResidenceLink.error}</div>
        }
      </FormGroup>
    );
  }
}

LegalResidenceComponent.propTypes = {
  isMultiCountry: PropTypes.bool,
  countries: PropTypes.arrayOf(PropTypes.object),
  legalResidenceLink: PropTypes.instanceOf(ValueLink).isRequired,
  tabIndex: PropTypes.string.isRequired,
  messages: PropTypes.any.isRequired,
};

export default LegalResidenceComponent;
