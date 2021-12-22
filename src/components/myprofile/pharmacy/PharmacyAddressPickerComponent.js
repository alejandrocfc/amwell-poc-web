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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from 'reactstrap';
import '../MyProfileComponent.css';
import { Select, TextInput } from '../../form/Inputs';

class PharmacyAddressPickerComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('PharmacyAddressPickerComponent: props', props);
    this.saveMailOrderAddress = this.saveMailOrderAddress.bind(this);
    this.homeAddressExists = !!props.activeConsumer.address;
    this.state = {
      useHomeAddress: this.homeAddressExists,
    };
  }

  saveMailOrderAddress(e) {
    if (e) e.preventDefault();
    const address = this.props.mailOrderAddress.value;
    const address1 = this.state.useHomeAddress ? null : address.address1;
    const address2 = this.state.useHomeAddress ? null : address.address2;
    const city = this.state.useHomeAddress ? null : address.city;
    const zipCode = this.state.useHomeAddress ? null : address.zipCode;
    const countryCode = this.props.isMultiCountry ? address.countryCode : this.props.countries[0].code;
    const state = this.state.useHomeAddress ? null : this.props.countries
      .find(c => c.code === countryCode).states
      .find(s => s.code === address.stateCode);

    this.props.saveMailOrderAddressAndPharmacy(address1, address2, city, state, zipCode);
  }

  canSubmit() {
    const address = this.props.mailOrderAddress.value;
    return address.address1 && address.city && address.zipCode && address.stateCode;
  }

  render() {
    return (
      <Modal dir={this.props.direction} className="pharmacyAddressPicker" isOpen={this.props.showAddressPicker} toggle={this.props.toggleAddressPicker}>
        <ModalHeader className="header">
          {this.props.messages.my_profile_pharmacy_your_shipping_address}
        </ModalHeader>
        <ModalBody>
          <div className="description">
            {this.props.messages.my_profile_pharmacy_send_prescriptions_to}
          </div>
          {this.homeAddressExists &&
          <div>
            <label className="radioLabel">
              <input className="radio" checked={this.state.useHomeAddress} value="useHomeAddress" onChange={() => this.setState({ useHomeAddress: true })} type="radio"/>{this.props.messages.my_profile_pharmacy_home_address}
            </label>
            <label className="radioLabel">
              <input className="radio" checked={!this.state.useHomeAddress} value="useShippingAddress" onChange={() => this.setState({ useHomeAddress: false })} type="radio"/>{this.props.messages.my_profile_pharmacy_alternate_address}
            </label>
          </div>}
          {this.state.useHomeAddress ?
            <HomeAddress {...this.props}/>
            :
            <AddressInputs {...this.props}/>
          }
        </ModalBody>
        <ModalFooter className="footer">
          <Button className='pharmacyPickerButton' onClick={this.props.toggleAddressPicker}>
            {this.props.messages.my_profile_pharmacy_back}
          </Button>
          <Button className='pharmacyPickerButton' onClick={e => this.saveMailOrderAddress(e)} disabled={!this.state.useHomeAddress && !this.canSubmit()}>{this.props.messages.my_profile_pharmacy_add}</Button>
        </ModalFooter>
      </Modal>
    );
  }
}

function AddressInputs(props) {
  const countryLink = props.mailOrderAddress.at('countryCode');
  const stateLink = props.mailOrderAddress.at('stateCode');
  const address1Link = props.mailOrderAddress.at('address1');
  const address2Link = props.mailOrderAddress.at('address2');
  const cityLink = props.mailOrderAddress.at('city');
  const zipCodeLink = props.mailOrderAddress.at('zipCode');
  zipCodeLink.error = props.mailOrderAddress.error && props.mailOrderAddress.error[zipCodeLink.key];

  const selectedCountry = props.countries.length > 1 ? props.countries.find(c => c.code === countryLink.value) : props.countries[0];
  const states = selectedCountry ? selectedCountry.states : [];
  return (
    <div className="addressInput">
      {props.isMultiCountry &&
      <Select valueLink={countryLink}>
        <option value='' disabled hidden>{props.messages.my_profile_pharmacy_country}</option>
        {props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
      </Select>}
      <TextInput placeholder={props.messages.my_profile_pharmacy_address1} valueLink={address1Link} />
      <TextInput placeholder={props.messages.my_profile_pharmacy_address2} valueLink={address2Link} />
      <TextInput placeholder={props.messages.my_profile_pharmacy_city} valueLink={cityLink} />
      <div className='zipAndStateWrapper'>
        <Select className="state" valueLink={stateLink}>
          <option value='' disabled hidden>{props.messages.my_profile_pharmacy_state}</option>
          {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
        </Select>
        <div className="zipWrapper">
          <TextInput className="zip" placeholder={props.messages.my_profile_pharmacy_zip_code} valueLink={zipCodeLink} />
        </div>
      </div>
    </div>
  );
}

function HomeAddress(props) {
  let middleNameOrInitial = null;
  if (props.sdk.getSystemConfiguration().consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL) {
    middleNameOrInitial = props.activeConsumer.middleInitial ? `${props.activateConsumer.middleInitial}.` : null;
  } else if (props.sdk.getSystemConfiguration().consumerMiddleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME) {
    middleNameOrInitial = props.activeConsumer.middleName;
  }

  const address = props.activeConsumer.address;
  return (
    <div className="homeAddress">
      <div className="name">{props.activeConsumer.firstName} {middleNameOrInitial} {props.activeConsumer.lastName}</div>
      <div>{address.address1}</div>
      <div>{address.address2}</div>
      <div>{address.city}, {address.stateCode} {address.zipCode}</div>
      <div>{address.countryName}</div>
    </div>
  );
}

PharmacyAddressPickerComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
PharmacyAddressPickerComponent.defaultProps = {};
export default PharmacyAddressPickerComponent;
