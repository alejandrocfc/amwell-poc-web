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
import { hasContextChanged } from '../components/Util';

import AppointmentsComponent from '../components/appointments/AppointmentsComponent';

class AppointmentsContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('AppointmentsContainer: props', props);
    this.state = {
      errors: [],
      appointments: [],
      cancelAppointmentModalOpen: false,
    };
  }

  componentDidMount() {
    this.getAppointments();
  }

  getAppointments() {
    this.props.enableSpinner();
    this.props.sdk.appointmentService.getAppointments(this.props.activeConsumer)
      .then((appointments) => {
        this.props.logger.debug('Appointments: ', appointments);
        this.setState({ appointments });
      })
      .catch((reason) => {
        if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else {
          this.props.logger.error('Something went wrong:', reason);
          this.props.showErrorModal();
        }
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.getAppointments();
    }
  }

  startVisit(appointment) {
    this.props.logger.debug('Start Visit: ', appointment);
    this.props.history.push('/visit/intake/start', {
      provider: appointment.assignedProvider.toString(),
      appointment: appointment.toString()
    });
  }

  cancelAppointment(appointment) {
    this.props.enableSpinner();
    this.props.logger.debug('Cancel Appointment: ', appointment);
    this.props.sdk.appointmentService.cancelAppointment(appointment)
      .then(() => {
        this.props.logger.debug('Appointment cancelled: ');
        this.getAppointments();
      })
      .catch((reason) => {
        if (reason.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
          this.props.history.push('/sessionExpired');
        } else {
          this.props.logger.error('Something went wrong:', reason);
          this.props.showErrorModal();
        }
      })
      .finally(() => {
        this.props.disableSpinner();
      });
  }

  appointmentDetails(appointment) {
    this.props.logger.debug('Appointment Details: ', appointment);
    this.props.history.push('/appointment/details', { appointment: appointment.toString() });
  }

  toggleCancelModal() {
    this.setState(prevState => ({
      cancelAppointmentModalOpen: !prevState.cancelAppointmentModalOpen,
    }));
  }

  render() {
    const properties = {
      appointments: this.state.appointments,
      startVisit: this.startVisit.bind(this),
      cancelAppointment: this.cancelAppointment.bind(this),
      appointmentDetails: this.appointmentDetails.bind(this),
      toggleCancelModal: this.toggleCancelModal.bind(this),
      cancelAppointmentModalOpen: this.state.cancelAppointmentModalOpen,
    };

    return (
      <AppointmentsComponent key='appointmentsComponent' {...this.props} {...properties} />
    );
  }
}

AppointmentsContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
AppointmentsContainer.defaultProps = {};
export default AppointmentsContainer;
