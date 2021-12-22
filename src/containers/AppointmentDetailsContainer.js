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
import queryString from 'query-string';
import PropTypes from 'prop-types';

import AppointmentDetailsComponent from '../components/appointments/AppointmentDetailsComponent';
import YesNoModal from '../components/popups/info/YesNoModal';
import ChangePhoneNumberModal from '../components/appointments/ChangePhoneNumberModal';

class AppointmentDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('AppointmentDetailsContainer: props', props);
    this.startVisit = this.startVisit.bind(this);
    this.togglePhoneNumberModal = this.togglePhoneNumberModal.bind(this);
    this.toggleCancelModal = this.toggleCancelModal.bind(this);
    this.changePhoneNumber = this.changePhoneNumber.bind(this);
    this.state = {
      errors: [],
      phoneNumber: '',
      phoneNumberError: '',
      showCancelModal: false,
      showPhoneNumberModal: false,
      appointment: (this.props.location.state && this.props.location.state.appointment) ? awsdk.AWSDKFactory.restoreAppointment(this.props.location.state.appointment) : null,
      engagementId: queryString.parse(props.location.search).engagementId,
    };
  }

  componentDidMount() {
    this.props.enableSpinner();

    let appointmentPromise = Promise.resolve(null);
    if (this.state.appointment) {
      appointmentPromise = this.props.sdk.appointmentService.getAppointment(this.state.appointment);
    } else if (this.state.engagementId) {
      appointmentPromise = this.props.sdk.appointmentService.findAppointment(this.props.activeConsumer, this.state.engagementId);
    }

    appointmentPromise
      .then((appointment) => {
        this.props.logger.debug('Appointment: ', appointment);
        this.setState({ appointment, phoneNumber: appointment.initiatorOverridePhoneNumber || '' });
      })
      .catch(error => this.handleError(error))
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  startVisit(e) {
    e.preventDefault();
    this.props.logger.debug('Start Visit with appointment: ', this.state.appointment);
    this.props.hideAppointmentsOnBell();
    this.props.history.push('/visit/intake/start', {
      provider: this.state.appointment.assignedProvider.toString(),
      appointment: this.state.appointment.toString()
    });
  }

  cancelAppointment() {
    this.props.enableSpinner();
    this.props.logger.debug('Cancel Appointment: ', this.state.appointment);
    this.props.sdk.appointmentService.cancelAppointment(this.state.appointment)
      .then(() => {
        this.props.logger.debug('Appointment cancelled: ');
        this.props.history.push('/appointments');
      })
      .catch(error => this.handleError(error))
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  changePhoneNumber() {
    this.props.enableSpinner();
    const appointmentUpdateRequest = this.props.sdk.appointmentService.getNewAppointmentUpdateRequest(this.state.appointment);
    appointmentUpdateRequest.initiatorOverridePhoneNumber = this.state.phoneNumber;
    this.props.sdk.appointmentService.updateAppointment(appointmentUpdateRequest)
      .then(() => {
        this.setState({ showPhoneNumberModal: false });
        return this.props.sdk.appointmentService.getAppointment(this.state.appointment);
      })
      .then(appointment => this.setState({ appointment }))
      .catch((error) => {
        if (error.errorCode === awsdk.AWSDKErrorCode.validationError) {
          this.setState({ phoneNumberError: this.props.messages.validation_phone_number_invalid });
        } else {
          this.handleError(error);
        }
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  confirmCancel(e) {
    e.preventDefault();
    this.cancelAppointment(this.state.appointment);
  }

  toggleCancelModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      showCancelModal: !prevState.showCancelModal,
    }));
  }

  togglePhoneNumberModal(e) {
    if (e) e.preventDefault();
    // reset phone number and error on every toggle
    this.setState(prevState => ({
      showPhoneNumberModal: !prevState.showPhoneNumberModal,
      phoneNumber: this.state.appointment.initiatorOverridePhoneNumber || '',
      phoneNumberError: '',
    }));
  }

  setPhoneNumber(phoneNumber) {
    this.setState({ phoneNumber, phoneNumberError: '' });
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.requiredAddressMissing) {
      this.props.showErrorModal(this.props.messages.validation_required_address_missing);
    } else {
      this.props.logger.error('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  render() {
    const props = this.props;
    const properties = {
      appointment: this.state.appointment,
      startVisit: this.startVisit,
      togglePhoneNumberModal: this.togglePhoneNumberModal,
      toggleCancelModal: this.toggleCancelModal,
    };

    return (
      <div>
        <YesNoModal
          message={this.props.messages.appointments_cancel_are_you_sure}
          header={this.props.messages.appointments_cancel}
          isOpen={this.state.showCancelModal}
          toggle={this.toggleCancelModal.bind(this)}
          messages={this.props.messages}
          yesClickHandler={this.confirmCancel.bind(this)}/>
        <ChangePhoneNumberModal
          phoneNumber={this.state.phoneNumber}
          errorMessage={this.state.phoneNumberError}
          isOpen={this.state.showPhoneNumberModal}
          toggle={this.togglePhoneNumberModal}
          messages={this.props.messages}
          setPhoneNumber={this.setPhoneNumber.bind(this)}
          saveClickHandler={this.changePhoneNumber}
        />
        {this.state.appointment &&
        <AppointmentDetailsComponent key='appointmentDetailsComponent' {...props} {...properties} />}
      </div>
    );
  }
}

AppointmentDetailsContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
AppointmentDetailsContainer.defaultProps = {};
export default AppointmentDetailsContainer;
