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

import awsdk from 'awsdk';
import React from 'react';
import PropTypes from 'prop-types';

import AddressComponent from '../form/AddressComponent';
import { DateInput, GenderInput, TextInput, PhoneNumberInput } from '../form/Inputs';
import ValueLinkedContainer from '../../containers/ValueLinkedContainer';

import './CartModePatientComponent.css';


class CartModePatientComponent extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.middleNameHandling = props.sdk.getSystemConfiguration().consumerMiddleNameHandling;
    this.isMultiCountry = props.sdk.getSystemConfiguration().isMultiCountry;
    this.state = {
      middleInitialCollected: this.middleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.INITIAL,
      middleNameCollected: this.middleNameHandling === awsdk.AWSDKConsumerMiddleNameHandling.FULLNAME,
      errors: {},
      modified: {},
      mrnId: '',
      firstName: '',
      middleNameOrInitial: '',
      lastName: '',
      gender: '',
      genderIdentity: '',
      email: '',
      phoneNumber: '',
      address1: '',
      address2: '',
      city: '',
      zipCode: '',
      countryCode: '',
      stateCode: '',
      dob: {
        year: '',
        month: '',
        day: '',
      },
    };
    this.populateOverrideDetailsFromExisting(this.state, props.consumerOverrideDetails);
  }

  populateOverrideDetailsFromExisting(state, overrideDetails) {
    if (overrideDetails) {
      state.mrnId = overrideDetails.mrnId;
      state.firstName = overrideDetails.firstName;
      state.middleNameOrInitial = overrideDetails.middleNameOrInitial;
      state.lastName = overrideDetails.lastName;
      state.gender = overrideDetails.gender;

      state.genderIdentity = overrideDetails.genderIdentityKey;
      state.email = overrideDetails.email;
      state.phoneNumber = overrideDetails.phone;
      state.address1 = overrideDetails.address1;
      state.address2 = overrideDetails.address2;
      state.city = overrideDetails.city;
      state.zipCode = overrideDetails.zipCode;
      if (overrideDetails.state) {
        state.stateCode = overrideDetails.state.code;
        state.countryCode = overrideDetails.state.countryCode;
      }
      if (overrideDetails.dob) {
        state.dob = {
          year: overrideDetails.dob.getFullYear(),
          month: overrideDetails.dob.getMonth() + 1,
          day: overrideDetails.dob.getDate(),
        };
      }
    }
  }

  nextClickHandler(e, skip) {
    if (e) e.preventDefault();

    if (!skip) {
      const consumerOverrideDetails = this.buildConsumerOverrideDetails();
      const errors = this.props.sdk.visitService.validateConsumerOverrideDetails(consumerOverrideDetails);

      if (errors.length) {
        this.mapErrors(errors);
        return;
      }
      this.props.nextClickHandler(consumerOverrideDetails);
    }

    const state = { practice: this.props.practice.toString() };
    if (this.props.provider) state.provider = this.props.provider.toString();
    this.props.history.push('/cartmode/topics', state);
  }

  canClickNext() {
    let dataPresent = false;

    const consumerOverrideDetails = this.buildConsumerOverrideDetails();
    Object.keys(consumerOverrideDetails).forEach((k) => {
      if (consumerOverrideDetails[k]) {
        dataPresent = true;
      }
    });

    return dataPresent;
  }

  mapRequiredFieldError(error, errorMessages) {
    switch (error.fieldName) {
      case 'firstName':
        errorMessages.firstName = this.props.messages.validation_first_name_required;
        break;
      case 'lastName':
        errorMessages.lastName = this.props.messages.validation_last_name_required;
        break;
      default:
        // do nothing
    }
  }

  mapInvalidFieldError(error, errorMessages) {
    switch (error.fieldName) {
      case 'firstName':
        errorMessages.firstName = this.props.messages.validation_first_name_invalid;
        break;
      case 'middleNameOrInitial':
        if (this.state.middleNameCollected) {
          errorMessages.middleNameOrInitial = this.props.messages.validation_middle_name_invalid;
        } else if (this.state.middleInitialCollected) {
          errorMessages.middleNameOrInitial = this.props.messages.validation_middle_initial_invalid;
        }
        break;
      case 'lastName':
        errorMessages.lastName = this.props.messages.validation_last_name_invalid;
        break;
      case 'email':
        errorMessages.email = this.props.messages.validation_email_invalid;
        break;
      case 'dob':
        errorMessages.dob = this.props.messages.validation_dob_invalid;
        break;
      case 'phone':
        errorMessages.phoneNumber = this.props.messages.validation_phone_number_invalid;
        break;
      case 'address1':
        errorMessages.address1 = this.props.messages.validation_primary_address_address1_invalid;
        break;
      case 'address2':
        errorMessages.address2 = this.props.messages.validation_primary_address_address2_invalid;
        break;
      case 'city':
        errorMessages.city = this.props.messages.validation_primary_address_city_invalid;
        break;
      case 'zipCode':
        errorMessages.zipCode = this.props.messages.validation_primary_address_zip_code_invalid;
        break;
      default:
        // do nothing
    }
  }

  mapErrors(errors) {
    const errorMessages = {};
    errors.forEach((error) => {
      this.mapInvalidFieldError(error, errorMessages);
      this.mapRequiredFieldError(error, errorMessages);
    });
    this.setState({ errors: errorMessages });
  }

  buildConsumerOverrideDetails() {
    const consumerOverrideDetails = this.props.sdk.visitService.newConsumerOverrideDetails();
    consumerOverrideDetails.mrnId = this.state.mrnId;
    consumerOverrideDetails.firstName = this.state.firstName;
    consumerOverrideDetails.middleNameOrInitial = this.state.middleNameOrInitial;
    consumerOverrideDetails.lastName = this.state.lastName;
    if (this.state.gender === 'F') consumerOverrideDetails.gender = awsdk.AWSDKGender.FEMALE;
    if (this.state.gender === 'M') consumerOverrideDetails.gender = awsdk.AWSDKGender.MALE;
    if (this.props.genderSupportEnabled) {
      if (this.state.gender === 'U') {
        consumerOverrideDetails.gender = awsdk.AWSDKGender.UNKNOWN;
      }
      consumerOverrideDetails.genderIdentityKey = this.state.genderIdentity;
    }
    consumerOverrideDetails.email = this.state.email;
    consumerOverrideDetails.phone = this.state.phoneNumber;
    consumerOverrideDetails.address1 = this.state.address1;
    consumerOverrideDetails.address2 = this.state.address2;
    consumerOverrideDetails.city = this.state.city;
    consumerOverrideDetails.zipCode = this.state.zipCode;
    if (this.state.stateCode) {
      consumerOverrideDetails.state = this.props.countries
        .find(c => c.code === this.state.countryCode || this.props.countries[0].code).states
        .find(s => s.code === this.state.stateCode);
    }
    if (this.state.dob.year && this.state.dob.month && this.state.dob.day) {
      consumerOverrideDetails.dob = new Date(Date.UTC(this.state.dob.year, this.state.dob.month - 1, this.state.dob.day));
    }
    return consumerOverrideDetails;
  }

  render() {
    const valueLinks = this.linkAll();

    return (
      <div className="cartModePatientComponent">
        <div className="cartModePatientHeader">
          <span>{this.props.messages.cart_mode_patient_header}</span>
          {this.props.messages.cart_mode_patient_description}
        </div>
        <div className="cartModePatientInputs">
          <TextInput valueLink={valueLinks.mrnId} placeholder={this.props.messages.cart_mode_patient_mrnid}/>

          {this.state.middleInitialCollected &&
          <div className="firstNameAndInitial">
            <TextInput valueLink={valueLinks.firstName} placeholder={this.props.messages.name_first_name}/>
            <TextInput valueLink={valueLinks.middleNameOrInitial} placeholder={this.props.messages.name_middle_initial} maxLength={1}/>
          </div>}

          {!this.state.middleInitialCollected &&
          <TextInput valueLink={valueLinks.firstName} placeholder={this.props.messages.name_first_name}/>}

          {this.state.middleNameCollected &&
          <TextInput valueLink={valueLinks.middleNameOrInitial} placeholder={this.props.messages.name_middle_name}/>}

          <TextInput valueLink={valueLinks.lastName} placeholder={this.props.messages.name_last_name}/>

          <GenderInput className="cartModePatientGender" genderLink={valueLinks.gender} genderIdentityLink={valueLinks.genderIdentity} messages={this.props.messages} {...this.props} />

          <span className="cartModePatientDobTitle">{this.props.messages.registration_date_of_birth}</span>
          <DateInput className="cartModePatientDob" id="cartModeDob" valueLink={valueLinks.dob} messages={this.props.messages}/>
          <TextInput valueLink={valueLinks.email} placeholder={this.props.messages.registration_email}/>
          <PhoneNumberInput locale={this.props.locale}  valueLink={valueLinks.phoneNumber} placeholder={this.props.messages.registration_phone_number}/>
          <AddressComponent
            messages={this.props.messages}
            addressLinks={valueLinks}
            disabled={{}}
            countries={this.props.countries}
            isMultiCountry={this.isMultiCountry}/>

          <div className="cartModePatientButtons">
            <button disabled={!this.canClickNext()} onClick={e => this.nextClickHandler(e, false)}>{this.props.messages.next}</button>
            <button className="link-like" onClick={e => this.nextClickHandler(e, true)}>{this.props.messages.skip}</button>
          </div>
        </div>
      </div>
    );
  }
}

CartModePatientComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  sdk: PropTypes.object.isRequired,
  nextClickHandler: PropTypes.func.isRequired,
};
export default CartModePatientComponent;
