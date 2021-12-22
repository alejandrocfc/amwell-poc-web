/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup } from 'reactstrap';
import { TextInput, Select, Checkbox } from '../form/Inputs';

import './PaymentMethodComponent.css';


class PaymentMethodComponent extends React.Component {
  render() {
    const nameOnCardLink = this.props.valueLinks.nameOnCard;
    const cardNumberLink = this.props.valueLinks.cardNumber;
    const cardSecNumberLink = this.props.valueLinks.cvv;
    const cardExpMonthLink = this.props.valueLinks.expMonth;
    const cardExpYearLink = this.props.valueLinks.expYear;
    const useHomeAddressLink = this.props.valueLinks.useHomeAddress;
    const countryCodeLink = this.props.valueLinks.countryCode;
    const address1Link = this.props.valueLinks.address1;
    const address2Link = this.props.valueLinks.address2;
    const cityLink = this.props.valueLinks.city;
    const stateCodeLink = this.props.valueLinks.stateCode;
    const zipCodeLink = this.props.valueLinks.zipCode;
    const countries = this.props.countries;
    const selectedCountry = countries.length > 1 ? this.props.countries.find(country => country.code === countryCodeLink.value) : countries[0];
    const states = selectedCountry ? selectedCountry.states.filter(state => state.legalAddress) : [];
    const year = new Date().getFullYear();
    const expirationYears = [];
    for (let i = year; i < year + 5; i += 1) {
      expirationYears.push(<option key={i} value={i}>{i}</option>);
    }

    return (
      <div className="paymentMethodComponent">
        <Form>
          <FormGroup>
            <div className="title">{this.props.messages.visit_payment_card_info}</div>
            <div className="paymentCardIcons"/>
            <TextInput tabIndex="1" placeholder={this.props.messages.visit_payment_name_on_card} valueLink={nameOnCardLink} />
            <div className="inline-inputs">
              <div className="cardNumber">
                <TextInput tabIndex="2" className="paymentInput creditCardNumber" id="creditCardNumber" name="creditCardNumber" invalidClass="inputError" valueLink={cardNumberLink} placeholder={this.props.messages.visit_payment_card_number} maxLength="16"/>
              </div>
              <div className="securityCode">
                <TextInput tabIndex="3" className="paymentInput creditCardSecCode" id="creditCardSecCode" name="creditCardSecCode" invalidClass="inputError" valueLink={cardSecNumberLink} placeholder={this.props.messages.visit_payment_card_cvv} maxLength="4" />
              </div>
            </div>
            <div className="inline-inputs">
              <div className="month">
                <Select tabIndex="4" valueLink={cardExpMonthLink} >
                  <option value='0'>{this.props.messages.visit_payment_card_expiration_month}</option>
                  <option value='01'>{this.props.messages.month_01}</option>
                  <option value='02'>{this.props.messages.month_02}</option>
                  <option value='03'>{this.props.messages.month_03}</option>
                  <option value='04'>{this.props.messages.month_04}</option>
                  <option value='05'>{this.props.messages.month_05}</option>
                  <option value='06'>{this.props.messages.month_06}</option>
                  <option value='07'>{this.props.messages.month_07}</option>
                  <option value='08'>{this.props.messages.month_08}</option>
                  <option value='09'>{this.props.messages.month_09}</option>
                  <option value='10'>{this.props.messages.month_10}</option>
                  <option value='11'>{this.props.messages.month_11}</option>
                  <option value='12'>{this.props.messages.month_12}</option>
                </Select>
                { cardExpMonthLink.error &&
                <div className='error'>{cardExpMonthLink.error}</div>
                }
              </div>
              <div className="year">
                <Select tabIndex="5" valueLink={cardExpYearLink}>
                  <option value='0'>{this.props.messages.visit_payment_card_expiration_year}</option>
                  {expirationYears}
                </Select>
                { cardExpYearLink.error &&
                <div className='error'>{cardExpYearLink.error}</div>
                }
              </div>
            </div>
          </FormGroup>
          <div className="title">{this.props.messages.visit_payment_card_billing_address}</div>
          <div className="useHomeAddressCheckbox">
            <Checkbox tabIndex="6" disabled={!this.props.activeConsumer.address} checkedLink={useHomeAddressLink}/>
            <span>{this.props.messages.visit_payment_card_billing_same_as_home}</span>
          </div>
          <div>
            <div>
              {this.props.isMultiCountry &&
                <Select tabIndex="7" valueLink={countryCodeLink}>
                  <option value=''>{this.props.messages.visit_payment_card_billing_country}</option>
                  {this.props.countries.map(country => <option key={country.code} value={country.code}>{country.name}</option>)}
                </Select>}
            </div>
            <TextInput tabIndex="8" placeholder={this.props.messages.visit_payment_card_billing_address_1} valueLink={address1Link}/>
            <TextInput tabIndex="9" placeholder={this.props.messages.visit_payment_card_billing_address_2} valueLink={address2Link}/>
            <TextInput tabIndex="10" placeholder={this.props.messages.visit_payment_card_billing_city} valueLink={cityLink}/>
            <div className="inline-inputs">
              {selectedCountry &&
              <div className="state">
                <Select tabIndex="11" valueLink={stateCodeLink}>
                  <option value=''>{this.props.messages.visit_payment_card_billing_state}</option>
                  {states.map(state => <option key={state.code} value={state.code}>{state.name}</option>)}
                </Select>
                { stateCodeLink.error &&
                <div className='error'>{stateCodeLink.error}</div>
                }
              </div>
              }
              <div className="zip">
                <TextInput tabIndex="12" placeholder={this.props.messages.visit_payment_card_billing_zipcode} valueLink={zipCodeLink}/>
              </div>
            </div>
          </div>
          <div className="buttons">
            <Button tabIndex="13" onClick={e => this.props.submitPaymentMethod(e)}>{this.props.messages.submit}</Button>
            <div>
              <button className="link-like" tabIndex="14" onClick={e => this.props.hidePaymentMethod(e)}>{this.props.messages.visit_payment_method_cancel}</button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

PaymentMethodComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  hidePaymentMethod: PropTypes.func.isRequired,
  submitPaymentMethod: PropTypes.func.isRequired,
  valueLinks: PropTypes.any.isRequired,
};
PaymentMethodComponent.defaultProps = {};
export default PaymentMethodComponent;
