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
import { Label } from 'reactstrap';
import { FormattedDate, FormattedMessage } from 'react-intl';

import ProviderPhotoPlaceholder from '../provider/images/provider_photo_placeholder.png';
import AppointmentIcon from './images/icon-page-header-appt.png';
import './ConfirmAppointmentComponent.css';
import { Select, TextInput } from '../form/Inputs';
import PaymentChangeComponent from '../payment/PaymentChangeComponent';
import PaymentAddComponent from '../payment/PaymentAddComponent';
import PaymentMethodContainer from '../../containers/PaymentMethodContainer';

class ConfirmAppointmentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ConfirmAppointmentComponent: props', props);
    this.titleRef = null;
    this.setTitleRef = (element) => {
      this.titleRef = element;
    };
  }

  componentDidMount() {
    if (this.titleRef) {
      this.titleRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.titleRef && prevProps.showPaymentMethod !== this.props.showPaymentMethod) {
      this.titleRef.scrollIntoView({ behavior: 'smooth' });
    }
  }

  render() {
    const reminderOptions = this.props.sdk.appointmentService.reminderOptions.filter(option => option.minutes < Math.round((this.props.appointmentTime - new Date()) / 60000));
    return (
      <div className="confirmAppointmentComponent">
        <div className="banner">
          <img alt={this.props.messages.confirm_appointment} src={AppointmentIcon}/>
        </div>
        <div className="content">
          {this.props.showPaymentMethod ?
            <div>
              <div className="title" ref={this.setTitleRef}>{this.props.messages.confirm_appointment_payment_information}</div>
              <PaymentMethodContainer hidePaymentMethod={this.props.togglePaymentMethod} paymentUpdated={this.props.getPaymentMethod} {...this.props}/>
            </div>
            :
            <div>
              <div className="title" ref={this.setTitleRef}>{this.props.messages.confirm_appointment_your_appointment}</div>
              <div className="logoAndDetails">
                <div className="logo"><img alt={this.props.providerDetails.fullName} src={this.props.providerDetails.logoUrl || ProviderPhotoPlaceholder}/>
                </div>
                <div className="appointmentDetails">
                  {this.props.messages.confirm_appointment_your_appointment_is_on}
                  <div className="details">
                    <div>
                      <FormattedDate value={this.props.appointmentTime} weekday='long' month='long' day='2-digit' year="numeric"/>
                    </div>
                    <div>
                      <FormattedDate value={this.props.appointmentTime} hour='numeric' minute='2-digit' timeZoneName="short"/>
                    </div>
                    <div><FormattedMessage id="withProvider" defaultMessage={this.props.messages.with_provider} values={{ providerName: this.props.providerDetails.fullName }}/></div>
                    <div>{this.props.providerDetails.specialty.value}</div>
                  </div>
                </div>
              </div>
              {!this.props.reconnect &&
              <>
                <div className="section">
                  <Label>
                    <div className="label">{this.props.messages.confirm_appointment_phone_number}</div>
                    <div className="labelDescription">{this.props.messages.confirm_appointment_what_number}</div>
                    <TextInput type="text" placeholder={this.props.messages.confirm_appointment_phone_number_placeholder} valueLink={this.props.phoneNumberLink}/>
                  </Label>
                </div>
                <div className="section">
                  <Label>
                    <div className="label">{this.props.messages.confirm_appointment_email_reminder}</div>
                    <div className="labelDescription">{this.props.messages.confirm_appointment_email_me}</div>
                    <Select valueLink={this.props.reminderLink}>
                      {reminderOptions.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </Select>
                  </Label>
                </div>
              </>
              }
              {this.props.providerDetails.practice.paymentRequiredForScheduledVisits &&
              <div className="paymentSection">
                <div className="section">
                  <div className="label">{this.props.messages.confirm_appointment_payment_information}</div>
                  <div className="labelDescription">{this.props.providerDetails.practice.paymentRequiredForScheduledVisitsText}</div>
                </div>
                {this.props.paymentMethod ?
                  <PaymentChangeComponent paymentMethod={this.paymentMethod} handleChangeCreditCardClicked={this.props.togglePaymentMethod} {...this.props}/>
                  :
                  <PaymentAddComponent handleChangeCreditCardClicked={this.props.togglePaymentMethod} {...this.props}/>
                }
                {this.props.showPaymentRequiredError &&
                <div>
                  <span className='error'>{this.props.messages.payment_please_provide}</span>
                </div>}
              </div>}
              <div className="buttons">
                <button onClick={() => { this.props.handleCancelClick() }}>{this.props.messages.cancel}</button>
                <button
                  onClick={() => this.props.scheduleAppointment()}>{this.props.messages.confirm_appointment_schedule}</button>
              </div>
              <div className="byPhone">{this.props.messages.confirm_appointment_by_phone}</div>
            </div>}
        </div>
      </div>
    );
  }
}

ConfirmAppointmentComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  providerDetails: PropTypes.object.isRequired,
  appointmentTime: PropTypes.object.isRequired,
  togglePaymentMethod: PropTypes.func.isRequired,
  showPaymentMethod: PropTypes.bool.isRequired,
};
ConfirmAppointmentComponent.defaultProps = {};
export default ConfirmAppointmentComponent;
