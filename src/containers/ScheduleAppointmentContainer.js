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

import ScheduleAppointmentComponent from '../components/practice/scheduleAppointment/ScheduleAppointmentComponent';
import { Availability } from '../components/practice/scheduleAppointment/AvailabilityPickerComponent';


class ScheduleAppointmentContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ScheduleAppointmentContainer: props', props);
    this.getPracticeFutureAvailability = this.getPracticeFutureAvailability.bind(this);
    this.getProvidersWithAvailability = this.getProvidersWithAvailability.bind(this);
    this.getProviderDetails = this.getProviderDetails.bind(this);
    this.toggleProviderDetailsModal = this.toggleProviderDetailsModal.bind(this);
    this.handleError = this.handleError.bind(this);
    this.confirmAppointment = this.confirmAppointment.bind(this);
    this.state = {
      calendar: [],
      providersAvailability: null,
      providerDetails: null,
      showProviderDetails: false,
    };
  }

  componentDidMount() {
    const thisMonth = new Date();
    const nextMonth = new Date(thisMonth.getFullYear(), thisMonth.getMonth() + 1);
    this.getPracticeFutureAvailability(thisMonth);
    this.getPracticeFutureAvailability(nextMonth);
  }

  getPracticeFutureAvailability(date) {
    this.props.enableSpinner();

    const criteria = this.props.sdk.practiceService.getNewPracticeFutureAvailabilitySearchCriteria();
    criteria.practiceOrSubCategory = this.props.practice;
    criteria.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    criteria.appointmentDate = date;
    if (this.props.providerName) {
      criteria.searchTerm = this.props.providerName;
    }

    this.props.sdk.practiceService.practiceFutureAvailabilitySearch(this.props.activeConsumer, criteria)
      .then((availabilityList) => {
        this.props.logger.debug('AvailabilityList: ', availabilityList);
        this.setState(prevState => ({
          calendar: [new Availability(date, availabilityList.availability), ...prevState.calendar].sort((a, b) => a.date.getTime() - b.date.getTime()),
        }));
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  getProvidersWithAvailability(date) {
    this.props.enableSpinner();

    const criteria = this.props.sdk.providerService.getNewProviderFutureAvailabilitySearchCriteria();
    criteria.practiceOrSubCategory = this.props.practice;
    criteria.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    criteria.appointmentDate = date;
    if (this.props.providerName) {
      criteria.searchTerm = this.props.providerName;
    }
    this.props.sdk.providerService.providerFutureAvailabilitySearch(this.props.activeConsumer, criteria)
      .then((providersAvailability) => {
        this.props.logger.debug('ProvidersAvailability: ', providersAvailability);
        this.setState({ providersAvailability });
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  getProviderDetails(provider) {
    this.props.enableSpinner();
    this.props.sdk.providerService.getProviderDetails(provider, this.props.activeConsumer)
      .then((providerDetails) => {
        this.props.logger.debug('ProviderDetails: ', providerDetails);
        this.setState({ providerDetails, showProviderDetails: true });
      })
      .catch((error) => {
        this.handleError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  handleError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal(error.message);
    }
  }

  toggleProviderDetailsModal() {
    this.setState(prevState => ({
      showProviderDetails: !prevState.showProviderDetails,
    }));
  }

  confirmAppointment(timeSlot, provider) {
    this.props.history.push('/confirmAppointment', { provider: provider.toString(), appointmentTime: timeSlot, practice: this.props.practice.toString(), reconnect: this.props.reconnect, reportDetails: this.props.visitReportDetail });
  }

  render() {
    const properties = {
      calendar: this.state.calendar,
      providersAvailability: this.state.providersAvailability,
      toggleProviderDetailsModal: this.toggleProviderDetailsModal,
      getPracticeFutureAvailability: this.getPracticeFutureAvailability,
      getProvidersWithAvailability: this.getProvidersWithAvailability,
      viewProfileHandler: this.getProviderDetails,
      showProviderDetails: this.state.showProviderDetails,
      providerDetails: this.state.providerDetails,
      timeSlot: this.state.timeSlot,
      confirmAppointment: this.confirmAppointment,
    };

    return (
      <ScheduleAppointmentComponent {...properties} {...this.props}/>
    );
  }
}

ScheduleAppointmentContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
ScheduleAppointmentContainer.defaultProps = {};
export default ScheduleAppointmentContainer;
