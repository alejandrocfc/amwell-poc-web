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
import { Button, Modal } from 'reactstrap';
import awsdk from 'awsdk';
import { FormattedMessage } from 'react-intl';
import ValueLinkedContainer from './ValueLinkedContainer';
import ConfirmAppointmentComponent from '../components/appointments/ConfirmAppointmentComponent';
import { isValidPhoneNumber } from '../components/Util';
import InformationModal from '../components/popups/info/InformationModal';
import '../components/appointments/AppointmentScheduledModal.css';

class ConfirmAppointmentContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.props.logger.debug('ConfirmAppointmentContainer: props', props);
    this.handleError = this.handleError.bind(this);
    this.getPaymentMethod = this.getPaymentMethod.bind(this);
    this.togglePaymentMethod = this.togglePaymentMethod.bind(this);
    this.scheduleAppointment = this.scheduleAppointment.bind(this);
    this.getPaymentMethod = this.getPaymentMethod.bind(this);
    this.navigateToScheduleAppointmentTab = this.navigateToScheduleAppointmentTab.bind(this);
    this.confirm = this.confirm.bind(this);
    this.handleCancelClick = this.handleCancelClick.bind(this);
    this.toggleErrorModal = this.toggleErrorModal.bind(this);
    this.state = {
      modified: [],
      errors: [],
      providerDetails: this.props.location.state ? awsdk.AWSDKFactory.restoreProviderDetails(this.props.location.state.provider) : null,
      appointmentTime: this.props.location.state ? new Date(this.props.location.state.appointmentTime) : null,
      phoneNumber: this.props.activeConsumer.phone || null,
      reminder: this.props.sdk.appointmentService.reminderOptions[0].value,
      paymentMethod: null,
      showPaymentMethod: false,
      showPaymentRequiredError: false,
      showAppointmentScheduledModal: false,
      appointments: [],
      error: false,
      reconnect: !!(this.props.location.state && this.props.location.state.reconnect),
      reportDetails: this.props.location.state ? this.props.location.state.reportDetails : null,
    };
  }

  componentDidMount() {
    if (!this.state.providerDetails || !this.state.appointmentTime) {
      this.props.history.replace('/');
    } else {
      this.fetchAppointmentsAndPayment();
    }
  }

  scheduleAppointment() {
    if (this.state.providerDetails.practice.paymentRequiredForScheduledVisits && !this.state.paymentMethod) {
      this.setState({ showPaymentRequiredError: true });
      return;
    }

    const reminder = this.state.reminder && this.props.sdk.appointmentService.reminderOptions.find(r => r.value === this.state.reminder);
    this.props.enableSpinner();
    const options = { provider: this.state.providerDetails, appointmentDate: this.state.appointmentTime, phoneNumber: this.state.phoneNumber, consumerReminder: reminder };
    if (this.state.reconnect && this.state.reportDetails) {
      options.reconnectFromVisit = this.state.reportDetails;
    }
    this.props.sdk.appointmentService.schedule(this.props.activeConsumer, options)
      .then((providerDetails) => {
        this.props.logger.debug('ProviderDetails: ', providerDetails);
        this.setState({ showAppointmentScheduledModal: true });
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  fetchAppointmentsAndPayment() {
    this.props.enableSpinner();
    const appointmentsPromise = this.props.sdk.appointmentService.getAppointments(this.props.activeConsumer);
    const paymentPromise = this.getPaymentMethod(this.props.activeConsumer);
    Promise.all([paymentPromise, appointmentsPromise])
      .then((results) => {
        this.setState({ paymentMethod: results[0], appointments: results[1], showPaymentMethod: false });
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  getPaymentMethod() {
    return this.props.sdk.consumerService.getPaymentMethod(this.props.activeConsumer)
      .catch((error) => {
        this.handleError(error);
      });
  }

  processScheduledAppointmentFailed() {
    const errorMessage = this.sameTimeAppointmentExist() ? this.props.messages.confirm_appointment_time_already_scheduled : this.props.messages.confirm_appointment_unavailable;
    this.setState({ errorMessage, error: true });
  }

  sameTimeAppointmentExist() {
    const existingAppointments = this.state.appointments;
    return existingAppointments.length > 0 &&
    existingAppointments.find(appointment => appointment.schedule && appointment.schedule.isScheduled && appointment.schedule.scheduledStartTime === this.state.appointmentTime.getTime());
  }

  handleError(error) {
    this.props.logger.error(error);
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.noPaymentInformationFound) {
      // do nothing
    } else if (error.errorCode === awsdk.AWSDKErrorCode.validationError) {
      this.setState({ errors: { phoneNumber: this.props.messages.validation_phone_number_invalid } });
    } else if (error.errorCode === awsdk.AWSDKErrorCode.scheduleAppointmentFailed) {
      this.processScheduledAppointmentFailed();
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal(error.message);
    }
  }

  togglePaymentMethod(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      showPaymentMethod: !prevState.showPaymentMethod,
      showPaymentRequiredError: false,
    }));
  }

  toggleErrorModal(e) {
    if (e) e.preventDefault();
    this.setState(prevState => ({
      error: !prevState.error,
    }), () => this.navigateToScheduleAppointmentTab());
  }

  confirm() {
    this.setState(prevState => ({ showAppointmentScheduledModal: !prevState.showAppointmentScheduledModal }));
    if (this.state.reconnect) {
      return this.goToAppointmentPage();
    }
    return this.navigateToScheduleAppointmentTab();
  }

  handleCancelClick() {
    if (this.state.reconnect) {
      return this.props.history.goBack();
    }
    return this.navigateToScheduleAppointmentTab();
  }

  goToAppointmentPage() {
    return this.props.history.replace('/appointments');
  }

  navigateToScheduleAppointmentTab() {
    this.props.history.push('/practice/appointment', { practice: this.props.location.state.practice });
  }

  render() {
    const phoneNumberLink = this.linkAt('phoneNumber');
    const reminderLink = this.linkAt('reminder');

    phoneNumberLink.check(x => !x || isValidPhoneNumber(x), this.props.messages.validation_phone_number_invalid);
    const email = this.state.reconnect && this.state.reportDetail ? this.state.reportDetail.consumer.email : this.props.activeConsumer.email;
    const properties = {
      phoneNumberLink,
      reminderLink,
      providerDetails: this.state.providerDetails,
      appointmentTime: this.state.appointmentTime,
      scheduleAppointment: this.scheduleAppointment,
      paymentMethod: this.state.paymentMethod,
      togglePaymentMethod: this.togglePaymentMethod,
      showPaymentMethod: this.state.showPaymentMethod,
      getPaymentMethod: this.getPaymentMethod,
      showPaymentRequiredError: this.state.showPaymentRequiredError,
      handleCancelClick: this.handleCancelClick,
      reconnect: this.state.reconnect,
    };

    return (
      <div>
        <ConfirmAppointmentComponent {...properties} {...this.props}/>
        <Modal className={`${this.props.direction} appointmentScheduledModal`} isOpen={this.state.showAppointmentScheduledModal} dir={this.props.direction}>
          <div className="scheduledHeader">
            {this.props.messages.confirm_appointment_scheduled}
          </div>
          <div className="scheduledBody">
            <FormattedMessage
              id='confirm_appointment_success'
              defaultMessage="Your appointment has been scheduled."
              values={{ consumer_email: email }} />
          </div>
          <Button onClick={() => { this.confirm() }}>{this.props.messages.ok}</Button>
        </Modal>
        <InformationModal
          className="errorModal"
          isOpen={this.state.error}
          toggle={this.toggleErrorModal}
          message={this.state.errorMessage || this.props.messages.modal_error_something_went_wrong}
          header={this.state.errorHeader || this.props.messages.modal_error_generic_header}
          messages={this.props.messages}/>
      </div>
    );
  }
}

ConfirmAppointmentContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
ConfirmAppointmentContainer.defaultProps = {};
export default ConfirmAppointmentContainer;
