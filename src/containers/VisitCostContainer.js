/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import React from 'react';

import VisitCost from '../components/visit/VisitCostComponent';
import VisitHeader from '../components/visit/VisitHeaderComponent';
import PaymentMethodContainer from './PaymentMethodContainer';
import { shouldUseWebRTC } from '../components/Util';


class VisitCostContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('VisitCostContainer: props', props);
    this.showPaymentMethod = this.showPaymentMethod.bind(this);
    this.hidePaymentMethod = this.hidePaymentMethod.bind(this);
    this.setPaymentMethod = this.setPaymentMethod.bind(this);
    this.applyCoupon = this.applyCoupon.bind(this);
    this.paymentUpdated = this.paymentUpdated.bind(this);

    const visit = this.props.location.state && this.props.location.state.visit ? awsdk.AWSDKFactory.restoreVisit(this.props.location.state.visit) : null;
    const proposedCouponCode = (visit && visit.cost) ? visit.cost.proposedCouponCode : '';
    this.state = {
      visit,
      invalidCoupon: false,
      couponCode: proposedCouponCode,
      couponApplied: !!proposedCouponCode,
      showPaymentMethod: false,
    };
  }

  componentDidMount() {
    if (this.state.visit != null) {
      this.props.enableSpinner();
      const paymentMethodPromise = this.props.sdk.consumerService.getPaymentMethod(this.props.activeConsumer)
        .then((paymentMethod) => {
          this.props.logger.debug('Payment Method: ', paymentMethod);
          this.setState({ paymentMethod });
        }).catch((error) => {
          if (error.errorCode === awsdk.AWSDKErrorCode.noPaymentInformationFound) {
            // no payment method on file
          } else {
            throw error;
          }
        });
      const subscriptionPromise = this.props.sdk.consumerService.getInsuranceSubscription(this.props.activeConsumer)
        .then((subscription) => {
          this.props.logger.debug('Insurance Subscription: ', subscription);
          this.setState({ subscription });
        });

      Promise.all([paymentMethodPromise, subscriptionPromise])
        .catch((error) => {
          if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
            this.props.history.push('/sessionExpired');
          } else {
            this.props.logger.info('Something went wrong:', error);
            this.props.showErrorModal();
          }
        })
        .finally(() => this.props.disableSpinner());
    } else {
      this.props.showErrorModal();
    }
  }

  startVisit() {
    let startedVisit = null;
    this.props.enableSpinner();
    this.props.sdk.visitService.startVisit(this.state.visit)
      .then((visit) => {
        this.props.logger.info('Start visit complete', visit);
        startedVisit = visit;
        if (!shouldUseWebRTC(startedVisit) && startedVisit.modality.modalityType !== awsdk.AWSDKVisitModalityType.PHONE) {
          this.props.logger.info('Launching TelehealthVideo');
          return this.props.sdk.visitService.launchTelehealthVideo(visit);
        }
        return Promise.resolve(visit);
      })
      .then((telehealthVideoLaunched) => {
        this.props.logger.info('LaunchTelehealthVideo=', telehealthVideoLaunched);
        this.props.disableSpinner();
        if (startedVisit.modality.modalityType === awsdk.AWSDKVisitModalityType.PHONE) {
          this.props.history.replace('/visit/phone/waitingRoom', { visit: startedVisit.toString() });
        } else {
          this.props.history.replace('/visit/waitingRoom', { visit: startedVisit.toString(), telehealthVideoLaunched });
        }
      })
      .catch((reason) => {
        this.props.disableSpinner();
        this.props.logger.error('Something went wrong:', reason);
        if (reason.errorCode === awsdk.AWSDKErrorCode.requiredHeightAndWeightMeasurementsMissing){
          this.props.showErrorModal(this.props.messages.validation_required_height_and_weight_vitals_missing);
        } else if (reason.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
          this.props.showErrorModal(this.props.messages.validation_required_address_missing);
        } else if (reason.errorCode === awsdk.AWSDKErrorCode.visitConsumerCallbackInvalid) {
          this.props.showErrorModal(this.props.messages.validation_phone_number_invalid);
        } else if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else if (reason.errorCode === awsdk.AWSDKErrorCode.creditCardDeclinedError) { 
          this.props.showErrorModal(this.props.messages.visit_payment_method_declined);
        } else {
          this.props.showErrorModal();
        }
      });
  }

  cancelVisit(visit) {
    this.props.sdk.visitService.cancelVisit(visit)
      .then(() => {
        this.props.history.goBack();
      });
  }

  applyCoupon(couponCode) {
    this.props.logger.info('applying coupon ', couponCode);
    this.props.enableSpinner();
    this.props.sdk.visitService.applyCouponCode(this.state.visit, couponCode)
      .then((visitCost) => {
        this.props.logger.info('Updated visit cost: ', visitCost);
        this.props.disableSpinner();
        const visit = this.state.visit;
        visit.cost = visitCost;
        this.setState({ visit, couponApplied: true, invalidCoupon: false, couponCode });
      }).catch((err) => {
        this.props.disableSpinner();
        this.props.logger.info('Got exception: ', err);
        if (err.errorCode === awsdk.AWSDKErrorCode.invalidCouponError) {
          this.props.logger.info('Invalid coupon');
          this.setState({ invalidCoupon: true, couponCode });
        } else {
          this.props.logger.info('Something went wrong:', err);
          this.props.showErrorModal();
        }
      });
  }

  paymentUpdated() {
    this.props.logger.info('Payment update successful');
    this.props.enableSpinner();
    this.props.sdk.consumerService.getPaymentMethod(this.props.activeConsumer)
      .then((paymentMethod) => {
        this.props.logger.info('getPaymentMethod successful');
        this.props.logger.debug('Payment Method: ', paymentMethod);
        this.setPaymentMethod(paymentMethod);
        this.hidePaymentMethod();
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.props.showErrorModal();
      })
      .finally(() => this.props.disableSpinner());
  }

  showPaymentMethod() {
    this.props.logger.info('showPaymentMethod');
    this.setState({ showPaymentMethod: true });
  }

  hidePaymentMethod(e) {
    if (e) e.preventDefault();
    this.setState({ showPaymentMethod: false });
  }

  setPaymentMethod(paymentMethod) {
    this.setState({ paymentMethod });
  }

  findFirstAvailable() {
    this.props.history.push('/visit/firstAvailable', { visit: this.state.visit.toString() });
  }

  render() {
    const props = this.props;
    const needsFirstAvailableSearch = this.state.visit.onDemandSpecialtyId != null && this.state.visit.firstAvailableData == null;
    const properties = {
      visit: this.state.visit,
      subscription: this.state.subscription,
      paymentMethod: this.state.paymentMethod,
      invalidCoupon: this.state.invalidCoupon,
      couponApplied: this.state.couponApplied,
      couponCode: this.state.couponCode,
      currency: this.props.sdk.getSystemConfiguration().currencyCode,
      speedPassActive: this.props.location.state.speedPassActive,
      proceedBehavior: needsFirstAvailableSearch ? this.findFirstAvailable.bind(this) : this.startVisit.bind(this),
    };

    return (
      <div>
        {this.state.visit && this.state.showPaymentMethod &&
          <VisitHeader id="visitCost" icon='paymentMethod' title={this.props.messages.visit_payment_method}>
            <PaymentMethodContainer key="visitPaymentMethodBody" paymentUpdated={this.paymentUpdated} hidePaymentMethod={this.hidePaymentMethod} setPaymentMethod={this.setPaymentMethod} {...properties} {...props} />
          </VisitHeader>
        }
        {this.state.visit && !this.state.showPaymentMethod &&
          <VisitHeader id="visitCost" icon='cost' title={this.props.messages.visit_cost}>
            <VisitCost key="visitCostBody" proceedBehavior={this.proceedBehavior} changePaymentMethod={this.showPaymentMethod} applyCoupon={this.applyCoupon} {...properties} {...props} />
          </VisitHeader>
        }
      </div>);
  }
}

VisitCostContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
VisitCostContainer.defaultProps = {};
export default VisitCostContainer;
