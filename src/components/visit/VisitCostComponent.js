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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import { Button, Form, FormGroup, Input } from 'reactstrap';
import { FormattedNumber, FormattedMessage } from 'react-intl';

import './VisitComponents.css';
import PaymentAddComponent from '../payment/PaymentAddComponent';
import PaymentChangeComponent from '../payment/PaymentChangeComponent';

class VisitCostComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.info('VisitCostComponent: props', props);
    this.state = {
      missingPaymentMethodError: false,
      mustApplyCouponError: false,
      couponInput: this.props.couponCode,
    };
  }

  componentDidUpdate(prevProps) {
    if (this.props.couponCode && this.props.couponCode !== prevProps.couponCode) {
      this.setState({ couponInput: this.props.couponCode });
    }
  }

  handleChange(e) {
    const state = {};
    const name = e.target.name;
    const value = e.target.value;
    const type = e.target.type;
    this.props.logger.info(`Found type: ${type}, name: ${name}, and value: ${value}`);
    if (type === 'text') {
      if (name === 'coupon') {
        state.couponInput = value;
        state.mustApplyCouponError = false;
      }
    }
    this.setState(state);
  }

  validateNonEmptyField(field) {
    return field != null && field.trim().length > 0;
  }

  handleApplyCouponClick(e) {
    e.preventDefault();
    const couponVal = this.state.couponInput;
    this.props.logger.info('sending coupon code', couponVal);
    if (couponVal && couponVal.trim() !== '') {
      this.props.applyCoupon(this.state.couponInput);
    }
  }

  handleChangeCreditCardClicked(e) {
    e.preventDefault();
    this.props.logger.info('handleChangeCreditCardClicked');
    this.props.changePaymentMethod();
  }

  submit() {
    if (this.validateNonEmptyField(this.state.couponInput) && !this.props.couponApplied) {
      this.setState({ mustApplyCouponError: true });
    } else if (this.props.paymentMethod || this.props.visit.cost.totalCostWaived || this.props.visit.cost.zeroCostVisit) {
      this.props.proceedBehavior(this.props.visit);
    } else {
      this.setState({ missingPaymentMethodError: true });
    }
  }

  render() {
    const isSuppressChargeTimeout = (
      this.props.subscription &&
      this.props.subscription.healthPlan.payerInfo.isSuppressCharge &&
      this.props.visit.cost &&
      !this.props.visit.cost.zeroCostVisit &&
      this.props.visit.cost.eligibilityRequestError === 'CONNECTION_TIMEOUT' &&
      this.props.visit.cost.costCalculationStatus === 'FINISHED');

    const isDeferredBilling = (
      this.props.visit.cost &&
      this.props.visit.cost.deferredBillingInEffect);
    const isDependent = this.props.visit.consumer.isDependent && this.props.isDependent;
    let visitBodyIntro = '';
    if (this.props.speedPassActive) {
      visitBodyIntro = this.props.messages.speedpass_not_charged;
    }
    let visitButtonDisabled = true;
    let cost = this.props.messages.visit_cost_calculating;
    let costValue;
    const currency = this.props.currency || 'USD';
    let ediMessage = null;
    if (this.props.visit.cost) {
      if (this.props.visit.cost.costCalculationStatus === 'FINISHED') {
        visitButtonDisabled = false;
        costValue = this.props.visit.cost.zeroCostVisit ? 0 : this.props.visit.cost.baseCost;

        cost = <FormattedNumber
          value={costValue}
          // eslint-disable-next-line
          style='currency'
          currency={currency}
          minimumFractionDigits={2}
          maximumFractionDigits={2}/>;
        if ((this.props.visit.cost.eligibilityRequestStatus === awsdk.AWSDKEligibilityRequestStatus.FAILED ||
            this.props.visit.cost.eligibilityRequestStatus === awsdk.AWSDKEligibilityRequestStatus.CANCELLED) &&
          !isSuppressChargeTimeout) {
          if (isDependent) {
            ediMessage = this.props.messages.edicost_error_message_dependent_unable;
          } else {
            ediMessage = this.props.messages.edicost_error_message_unable;
          }
        } else if (this.props.visit.cost.eligibilityRequestStatus === awsdk.AWSDKEligibilityRequestStatus.REQUEST_VALIDATION_RESPONSE) {
          if (this.props.visit.cost.eligibilityRequestError === 'INACCURATE_PRIMARY_SUBSCRIBER_INFO' ||
              this.props.visit.cost.eligibilityRequestError === 'INACCURATE_DEPENDENT_SUBSCRIBER_INFO') {
            if (isDependent) {
              ediMessage = this.props.messages.edicost_error_message_dependent_error;
            } else {
              ediMessage = this.props.messages.edicost_error_message_error;
            }
          } else if (isDependent) {
            ediMessage = this.props.messages.edicost_error_message_dependent_unable;
          } else {
            ediMessage = this.props.messages.edicost_error_message_unable;
          }
        }
      }
    }
    return (
      <div className="visitForm">
        <div id="visitBodyText" className="visitBodyIntro">{visitBodyIntro}</div>
        <Form id="visitCostForm" onSubmit={e => this.handleApplyCouponClick(e)}>
          <div className="visitCostHeader">
            {isDeferredBilling &&
              <div id="deferredBillingMessages" className="visitCostMessage">{this.props.visit.cost.deferredBillingText}</div>
            }
            {isSuppressChargeTimeout &&
              <div id="paymentSuppressedMessage" className="visitCostMessage">{this.props.messages.visit_cost_payment_suppressed}</div>
            }
            {!isDeferredBilling &&
            <div>
              <div id="visitCost" className="visitCost">{cost}</div>
              <div className="visitCostSeparator"><hr /></div>
              {(this.props.couponApplied || isSuppressChargeTimeout) &&
              <div id="visitCostDescription" className="visitCostDescription">
                {this.props.couponApplied &&
                <span className='couponAppliedMessage'>{this.props.messages.visit_coupon_applied}</span>}
                {isSuppressChargeTimeout &&
                  <span id="suppressedMaxMessage" className="visitCostMessage">
                    <FormattedMessage id="paymentSuppressedMaxMessage"
                      defaultMessage={ this.props.messages.visit_cost_payment_suppressed_max } values={{ cost: null }}/>
                  </span>
                }
              </div>
              }
            </div>}
          </div>
          {ediMessage !== null &&
            <div className='visitCostEDIMessage'>{ediMessage}</div>
          }
          <div className={this.props.visit.cost && this.props.visit.cost.zeroCostVisit ? 'hidden' : 'visitCostPaymentMethodBody'}>
            <div id="visitCostPaymentMethodTitle" className="visitCostPaymentMethodTitle">{this.props.messages.visit_payment_information}</div>
            {this.props.paymentMethod ?
              <PaymentChangeComponent paymentMethod={this.props.paymentMethod} handleChangeCreditCardClicked={this.handleChangeCreditCardClicked.bind(this)} {...this.props}/>
              :
              <PaymentAddComponent handleChangeCreditCardClicked={this.handleChangeCreditCardClicked.bind(this)} {...this.props}/>
            }
            {this.state.missingPaymentMethodError &&
            <div>
              <span className='error'>{this.props.messages.payment_please_provide}</span>
            </div>}
          </div>
          {this.props.visit.cost &&
            this.props.visit.cost.canApplyCouponCode &&
            !this.props.visit.cost.zeroCostVisit &&
            !isSuppressChargeTimeout &&
            <div className='visitCoupon'>
              <div id="visitCostCouponTitle" className="visitCostCouponTitle">{this.props.messages.visit_do_you_have_coupon_code}</div>
              <div className="visitCostCouponBody">
                <FormGroup>
                  <Input type="text" className={this.props.invalidCoupon || this.state.mustApplyCouponError ? 'couponInput inputError' : 'couponInput'} id="coupon" disabled={this.props.couponApplied} name="coupon" onChange={e => this.handleChange(e)} placeholder={this.props.messages.visit_enter_coupon_code} value={this.state.couponInput ? this.state.couponInput : ''}/>
                  <Button id="applyCouponButton" className="applyButton" onClick={e => this.handleApplyCouponClick(e)} disabled={this.props.couponApplied}>{this.props.messages.visit_apply}</Button>
                  <span className={this.props.invalidCoupon ? 'error' : 'hidden'}>{this.props.messages.visit_coupon_code_invalid}</span>
                  <span className={this.state.mustApplyCouponError ? 'error' : 'hidden'}>{this.props.messages.visit_coupon_code_not_applied}</span>
                </FormGroup>
              </div>
            </div>}
          <div id="visitCostSubmit" className="visitSubmit">
            <Button id="submit" className='visitButton' disabled={visitButtonDisabled} onClick={e => this.submit(e)}>{this.props.messages.visit_cost_next}</Button>
          </div>
        </Form>
      </div>
    );
  }
}

VisitCostComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  visit: PropTypes.object.isRequired,
  proceedBehavior: PropTypes.func.isRequired,
  changePaymentMethod: PropTypes.func.isRequired,
  applyCoupon: PropTypes.func.isRequired,
};
VisitCostComponent.defaultProps = {};
export default VisitCostComponent;
