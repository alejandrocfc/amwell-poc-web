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
import awsdk from 'awsdk';

import MyProfilePharmacyComponent from '../components/myprofile/pharmacy/MyProfilePharmacyComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { hasContextChanged } from '../components/Util';

class MyProfilePharmacyContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyProfilePharmacyContainer: props', props);
    this.findPharmacies = this.findPharmacies.bind(this);
    this.toggleAddPharmacy = this.toggleAddPharmacy.bind(this);
    this.setPreferred = this.setPreferred.bind(this);
    this.savePreferredPharmacy = this.savePreferredPharmacy.bind(this);
    this.selectPharmacy = this.selectPharmacy.bind(this);
    this.deletePharmacy = this.deletePharmacy.bind(this);
    this.addPharmacy = this.addPharmacy.bind(this);
    this.toggleAddressPicker = this.toggleAddressPicker.bind(this);
    this.saveMailOrderAddressAndPharmacy = this.saveMailOrderAddressAndPharmacy.bind(this);
    this.fetchShippingAddress = this.fetchShippingAddress.bind(this);
    this.isMultiCountry = this.props.sdk.getSystemConfiguration().isMultiCountry;
    this.state = {
      errors: [],
      modified: [],
      countries: [],
      city: '',
      zipCode: '',
      countryCode: '',
      stateCode: '',
      type: '',
      showAddPharmacy: false,
      showAddressPicker: false,
      pharmacies: null,
      selectedPharmacy: null,
      consumerPharmacies: null,
      preferredPharmacy: null,
      selectedConsumerPharmacy: null,
      shippingAddress: null,
      mailOrderAddress: {
        address1: '',
        address2: '',
        city: '',
        zipCode: '',
        stateCode: '',
        countryCode: '',
      },
    };
  }

  componentDidMount() {
    this.setupContainer();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.setupContainer();
    }
  }

  setupContainer() {
    this.props.enableSpinner();
    const getCountriesPromise = this.props.sdk.getCountries();
    Promise.all([getCountriesPromise, ...this.fetchPharmacyPromises(this.props.activeConsumer)])
      .then((values) => {
        this.setState({
          countries: values[0],
          consumerPharmacies: values[1],
          preferredPharmacy: values[2],
          selectedConsumerPharmacy: values[2],
        });
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  findPharmacies() {
    let state = null;
    if (this.state.stateCode) {
      const country = this.isMultiCountry ? this.state.countries.find(c => c.code === this.state.countryCode) : this.state.countries[0];
      state = country.states.find(s => s.code === this.state.stateCode);
    }

    this.props.enableSpinner();
    this.props.sdk.pharmacyService.getPharmacies(this.state.city, state, this.state.zipCode, this.state.type)
      .then((pharmacies) => {
        this.setState({ pharmacies });
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  setPreferred(e) {
    this.setState({ selectedConsumerPharmacy: this.state.consumerPharmacies.find(p => p.id.persistentId === e.target.value) });
  }

  addPharmacy(e, pharmacy) {
    if (e) e.preventDefault();
    if (pharmacy.type === 'MailOrder') {
      this.toggleAddressPicker();
      this.fetchShippingAddress();
    } else {
      this.savePreferredPharmacy(e, pharmacy);
    }
  }

  savePreferredPharmacy(e, pharmacy) {
    if (e) e.preventDefault();
    this.props.enableSpinner();

    this.props.sdk.pharmacyService.updatePreferredPharmacy(this.props.activeConsumer, pharmacy)
      .then(consumer => Promise.all(this.fetchPharmacyPromises(consumer)))
      .then((values) => {
        this.setState({
          consumerPharmacies: values[0],
          preferredPharmacy: values[1],
          selectedConsumerPharmacy: values[1],
          showAddPharmacy: false,
        });
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  deletePharmacy(e, pharmacy) {
    if (e) e.preventDefault();
    this.props.enableSpinner();

    this.props.sdk.pharmacyService.deletePharmacy(this.props.activeConsumer, pharmacy)
      .then(() => Promise.all(this.fetchPharmacyPromises(this.props.activeConsumer)))
      .then((values) => {
        this.setState({
          consumerPharmacies: values[0],
          preferredPharmacy: values[1],
          selectedConsumerPharmacy: values[1],
        });
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  selectPharmacy(pharmacy) {
    this.setState({ selectedPharmacy: pharmacy });
  }

  toggleAddPharmacy(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      city: '',
      zipCode: '',
      countryCode: '',
      stateCode: '',
      type: '',
      pharmacies: null,
      showAddPharmacy: !prevState.showAddPharmacy,
    }));
  }

  toggleAddressPicker() {
    this.setState(prevState => ({
      showAddressPicker: !prevState.showAddressPicker,
    }));
  }

  fetchShippingAddress() {
    this.props.enableSpinner();
    this.props.sdk.consumerService.getShippingAddress(this.props.activeConsumer)
      .then((shippingAddress) => {
        if (shippingAddress) {
          this.setState({
            shippingAddress,
            mailOrderAddress: {
              address1: shippingAddress.address1,
              address2: shippingAddress.address2,
              city: shippingAddress.city,
              zipCode: shippingAddress.zipCode,
              stateCode: shippingAddress.stateCode,
              countryCode: shippingAddress.countryCode,
            },
          });
        }
      })
      .catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.noShippingAddressFound) {
          // do nothing
        }
      })
      .finally(() => this.props.disableSpinner());
  }

  fetchPharmacyPromises(consumer) {
    const getPharmaciesPromise = this.props.sdk.pharmacyService.getPharmaciesForConsumer(consumer);
    const getPreferredPharmacyPromise = this.props.sdk.pharmacyService.getPreferredPharmacy(consumer)
      .catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.noPreferredPharmacyFound) {
          // do nothing
        }
      });
    return [getPharmaciesPromise, getPreferredPharmacyPromise];
  }

  saveMailOrderAddressAndPharmacy(address1, address2, city, state, zipCode) {
    const mailOrderAddress = this.props.sdk.consumerService.newAddressUpdate(address1, address2, city, state, zipCode);
    this.props.enableSpinner();
    this.props.sdk.consumerService.updateShippingAddress(this.props.activeConsumer, mailOrderAddress)
      .then(() => {
        this.savePreferredPharmacy(null, this.state.selectedPharmacy);
        this.toggleAddressPicker();
      })
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
        this.props.history.push('/sessionExpired');
      } else if (error.errorCode === awsdk.AWSDKErrorCode.illegalArgument && error.fieldName === 'zipCode') {
        errors.zipCode = this.props.messages.my_profile_pharmacy_zip_code_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.illegalArgument && error.fieldName === 'shippingAddress.zipCode') {
        errors.mailOrderAddress = {};
        errors.mailOrderAddress.zipCode = this.props.messages.my_profile_pharmacy_zip_code_invalid;
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  render() {
    const valueLinks = this.linkAll();

    const properties = {
      isMultiCountry: this.isMultiCountry,
      countries: this.state.countries,
      valueLinks,
      findPharmacies: this.findPharmacies,
      toggleAddPharmacy: this.toggleAddPharmacy,
      toggleAddressPicker: this.toggleAddressPicker,
      setPreferred: this.setPreferred,
      savePreferredPharmacy: this.savePreferredPharmacy,
      selectPharmacy: this.selectPharmacy,
      deletePharmacy: this.deletePharmacy,
      addPharmacy: this.addPharmacy,
      saveMailOrderAddressAndPharmacy: this.saveMailOrderAddressAndPharmacy,
      pharmacies: this.state.pharmacies,
      showAddPharmacy: this.state.showAddPharmacy,
      selectedPharmacy: this.state.selectedPharmacy,
      consumerPharmacies: this.state.consumerPharmacies,
      preferredPharmacy: this.state.preferredPharmacy,
      selectedConsumerPharmacy: this.state.selectedConsumerPharmacy,
      mailOrderAddress: this.linkAt('mailOrderAddress'),
      showAddressPicker: this.state.showAddressPicker,
      shippingAddress: this.state.shippingAddress,
    };

    return (
      <MyProfilePharmacyComponent key="myProfilePharmacyComponent" {...this.props} {...properties}/>
    );
  }
}

MyProfilePharmacyContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyProfilePharmacyContainer.defaultProps = {};
export default MyProfilePharmacyContainer;
