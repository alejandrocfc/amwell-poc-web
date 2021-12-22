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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import React from 'react';
import ValueLinkedContainer from './ValueLinkedContainer';
import PaymentMethod from '../components/payment/PaymentMethodComponent';
import { areEqualStrings } from '../components/Util';

class PaymentMethodContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.props.logger.debug('PaymentMethodContainer: props', props);
    this.state = {
      countries: [],
      nameOnCard: '',
      cardNumber: '',
      cvv: '',
      expMonth: '',
      expYear: '',
      countryCode: '',
      address1: '',
      address2: '',
      city: '',
      stateCode: '',
      zipCode: '',
      useHomeAddress: false,
      modified: [],
      errors: [],
    };
  }

  componentDidMount() {
    this.props.enableSpinner();
    this.props.sdk.getCountries()
      .then(countries => this.setState({ countries }))
      .catch(error => this.mapError(error))
      .finally(() => this.props.disableSpinner());
  }

  componentDidUpdate(prevProps, prevState) {
    // Toggle home address on, sets the fields to whatever the home address is
    if (this.state.useHomeAddress && !prevState.useHomeAddress) {
      this.setOrResetAddressFields(this.props.activeConsumer.address);
    }

    // Inputs still match home address and toggle it off, clears the inputs
    if (this.addressMatchesHomeAddress() && !this.state.useHomeAddress && prevState.useHomeAddress) {
      this.setOrResetAddressFields();
    }

    // Inputs no longer match the home address, toggle off the checkbox
    if (!this.addressMatchesHomeAddress() && this.state.useHomeAddress && prevState.useHomeAddress) {
      this.setState({ useHomeAddress: false });
    }
  }

  setOrResetAddressFields(address) {
    this.setState({
      address1: address ? address.address1 : '',
      address2: address ? address.address2 : '',
      city: address ? address.city : '',
      stateCode: address ? address.stateCode : '',
      countryCode: address ? address.countryCode : '',
      zipCode: address ? address.zipCode : '',
    });
  }

  addressMatchesHomeAddress() {
    return (this.props.activeConsumer.address &&
      areEqualStrings(this.props.activeConsumer.address.address1, this.state.address1) &&
      areEqualStrings(this.props.activeConsumer.address.address2, this.state.address2) &&
      areEqualStrings(this.props.activeConsumer.address.city, this.state.city) &&
      areEqualStrings(this.props.activeConsumer.address.stateCode, this.state.stateCode) &&
      areEqualStrings(this.props.activeConsumer.address.countryCode, this.state.countryCode) &&
      areEqualStrings(this.props.activeConsumer.address.zipCode, this.state.zipCode)
    );
  }

  updatePaymentMethod(consumer, paymentRequest) {
    this.props.logger.info('updatePaymentMethod');
    this.props.logger.debug('updatePaymentMethod() with', consumer, paymentRequest);
    this.props.enableSpinner();
    this.props.sdk.consumerService.updatePaymentMethod(consumer, paymentRequest)
      .then(() => this.props.paymentUpdated())
      .catch((error) => {
        this.props.logger.info('Exception: ', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  submitPaymentMethod(e) {
    if (e) {
      e.preventDefault();
    }
    const paymentRequest = this.props.sdk.consumerService.newPaymentRequest();
    paymentRequest.nameOnCard = this.state.nameOnCard;
    paymentRequest.creditCardNumber = this.state.cardNumber;
    paymentRequest.creditCardSecCode = this.state.cvv;
    paymentRequest.creditCardMonth = this.state.expMonth;
    paymentRequest.creditCardYear = this.state.expYear;
    paymentRequest.address1 = this.state.address1;
    paymentRequest.address2 = this.state.address2;
    paymentRequest.city = this.state.city;
    paymentRequest.state = this.state.stateCode;
    paymentRequest.country = this.state.countryCode;
    paymentRequest.creditCardZip = this.state.zipCode;
    this.updatePaymentMethod(this.props.activeConsumer, paymentRequest);
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.validationErrors) {
        const fieldErrors = error.errors;
        this.props.logger.debug('map errors - validation errors', fieldErrors);
        fieldErrors.forEach((fieldError) => {
          if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
            if (fieldError.fieldName === 'nameOnCard' && fieldError.reason === 'field required') {
              errors.nameOnCard = this.props.messages.validation_credit_card_name_on_card_required;
            } else if (fieldError.fieldName === 'creditCardNumber' && fieldError.reason === 'field required') {
              errors.cardNumber = this.props.messages.validation_credit_card_number_required;
            } else if (fieldError.fieldName === 'creditCardNumber' && fieldError.reason === 'invalid format') {
              errors.cardNumber = this.props.messages.validation_credit_card_number_invalid;
            } else if (fieldError.fieldName === 'creditCardSecCode' && fieldError.reason === 'field required') {
              errors.cvv = this.props.messages.validation_credit_card_security_code_required;
            } else if (fieldError.fieldName === 'creditCardSecCode' && fieldError.reason === 'invalid format') {
              errors.cvv = this.props.messages.validation_credit_card_security_code_invalid;
            } else if (fieldError.fieldName === 'address1' && fieldError.reason === 'field required') {
              errors.address1 = this.props.messages.validation_billing_address_address1_required;
            } else if (fieldError.fieldName === 'address1' && fieldError.reason === 'invalid format') {
              errors.address1 = this.props.messages.validation_billing_address_address1_invalid;
            } else if (fieldError.fieldName === 'address2' && fieldError.reason === 'invalid format') {
              errors.address2 = this.props.messages.validation_billing_address_address2_invalid;
            } else if (fieldError.fieldName === 'city' && fieldError.reason === 'field required') {
              errors.city = this.props.messages.validation_billing_address_city_required;
            } else if (fieldError.fieldName === 'city' && fieldError.reason === 'invalid format') {
              errors.city = this.props.messages.validation_billing_address_city_invalid;
            } else if (fieldError.fieldName === 'addressStateCode' && fieldError.reason === 'field required') {
              errors.stateCode = this.props.messages.validation_billing_address_state_required;
            } else if (fieldError.fieldName === 'addressStateCode' && fieldError.reason === 'invalid format') {
              errors.stateCode = this.props.messages.validation_billing_address_state_invalid;
            } else if (fieldError.fieldName === 'addressCountryCode' && fieldError.reason === 'field required') {
              errors.countryCode = this.props.messages.validation_billing_address_country_required;
            } else if (fieldError.fieldName === 'addressCountryCode' && fieldError.reason === 'invalid format') {
              errors.countryCode = this.props.messages.validation_billing_address_country_invalid;
            } else if (fieldError.fieldName === 'creditCardZip' && fieldError.reason === 'field required') {
              errors.zipCode = this.props.messages.validation_credit_card_zip_code_required;
            } else if (fieldError.fieldName === 'creditCardZip' && fieldError.reason === 'invalid format') {
              errors.zipCode = this.props.messages.validation_credit_card_zip_code_invalid;
            } else if (fieldError.fieldName === 'creditCardMonth' && fieldError.reason === 'field required') {
              errors.expMonth = this.props.messages.validation_credit_card_expiration_month_required;
            } else if (fieldError.fieldName === 'creditCardMonth' && fieldError.reason === 'out of range field') {
              errors.expMonth = this.props.messages.validation_credit_card_expiration_month_out_of_range;
            } else if (fieldError.fieldName === 'creditCardYear' && fieldError.reason === 'field required') {
              errors.expYear = this.props.messages.validation_credit_card_expiration_year_required;
            } else if (fieldError.fieldName === 'creditCardYear' && fieldError.reason === 'out of range field') {
              errors.expYear = this.props.messages.validation_credit_card_expiration_year_out_of_range;
            } else if (fieldError.fieldName === 'creditCardYear' && fieldError.reason === 'invalid format') {
              errors.expYear = this.props.messages.validation_credit_card_expiration_year_invalid;
            }
          }
        });
      } else if (error.errorCode === awsdk.AWSDKErrorCode.creditCardInvalidZipCode) {
        errors.zipCode = this.props.messages.validation_credit_card_zip_code_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.creditCardInvalidCVV) {
        errors.cvv = this.props.messages.validation_credit_card_security_code_invalid;
      } else if (error.errorCode === awsdk.AWSDKErrorCode.creditCardValidationError) {
        this.props.showErrorModal(this.props.messages.visit_payment_method_error);
      } else if (error.errorCode === awsdk.AWSDKErrorCode.creditCardDeclinedError) {
        this.props.showErrorModal(this.props.messages.visit_payment_method_declined);
      } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidParameter) {
        this.props.showErrorModal(this.props.messages.validation_generic_field_invalid);
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  render() {
    this.props.logger.debug('render', this.state);
    const paymentMethodLinks = this.linkAll();
    paymentMethodLinks.nameOnCard.check(x => !this.state.modified.nameOnCard || x, this.props.messages.validation_credit_card_name_on_card_required);
    paymentMethodLinks.cardNumber.check(x => !this.state.modified.cardNumber || x, this.props.messages.validation_credit_card_number_required);
    paymentMethodLinks.cvv.check(x => !this.state.modified.cvv || x, this.props.messages.validation_credit_card_security_code_required);
    paymentMethodLinks.expMonth.check(x => !this.state.modified.expMonth || x, this.props.messages.validation_credit_card_expiration_month_required);
    paymentMethodLinks.expYear.check(x => !this.state.modified.expYear || x, this.props.messages.validation_credit_card_expiration_year_required);
    paymentMethodLinks.countryCode.check(x => this.state.useHomeAddress || !this.state.modified.countryCode || !this.props.isMultiCountry || x, this.props.messages.validation_billing_address_country_required);
    paymentMethodLinks.address1.check(x => this.state.useHomeAddress || !this.state.modified.address1 || x, this.props.messages.validation_billing_address_address1_required);
    paymentMethodLinks.city.check(x => this.state.useHomeAddress || !this.state.modified.city || x, this.props.messages.validation_billing_address_city_required);
    paymentMethodLinks.stateCode.check(x => this.state.useHomeAddress || !this.state.modified.stateCode || x, this.props.messages.validation_billing_address_state_required);
    paymentMethodLinks.zipCode.check(x => this.state.useHomeAddress || !this.state.modified.zipCode || x, this.props.messages.validation_credit_card_zip_code_required);

    const properties = {
      submitPaymentMethod: this.submitPaymentMethod.bind(this),
      valueLinks: paymentMethodLinks,
      countries: this.state.countries,
      isMultiCountry: this.props.sdk.getSystemConfiguration().isMultiCountry,
    };

    return (
      <PaymentMethod {...properties} {...this.props} />
    );
  }
}

PaymentMethodContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  enableSpinner: PropTypes.func.isRequired,
  disableSpinner: PropTypes.func.isRequired,
  hidePaymentMethod: PropTypes.func.isRequired,
  activeConsumer: PropTypes.object.isRequired,
  paymentUpdated: PropTypes.func.isRequired,
};
PaymentMethodContainer.defaultProps = {};
export default PaymentMethodContainer;
