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
import { Button } from 'reactstrap';
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';

import YesNoModal from '../popups/info/YesNoModal';


import './AppointmentsComponent.css';
import VideoIcon from './images/icon-video-visit.png';
import PhoneIcon from './images/icon-phone-call.png';

class AppointmentsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('AppointmentsComponent: props', props);
    this.state = {
      appointment: null,
    };
  }

  startVisit(e, appointment) {
    if (e) e.preventDefault();
    this.props.startVisit(appointment);
  }

  cancelAppointment(e, appointment) {
    e.preventDefault();
    this.setState({ appointment });
    this.props.toggleCancelModal();
  }

  confirmCancel() {
    this.props.cancelAppointment(this.state.appointment);
    this.props.toggleCancelModal();
    this.setState({ appointment: null });
  }

  appointmentDetails(e, appointment) {
    e.preventDefault();
    this.props.appointmentDetails(appointment);
  }

  render() {
    const appointmentsGrid = [];
    let appointmentsActions = null;

    const appts = {};
    this.props.appointments.forEach((appointment) => {
      if (!appts[appointment.consumer.fullName]) {
        appts[appointment.consumer.fullName] = [];
      }
      appts[appointment.consumer.fullName].push(appointment);
    });

    Object.keys(appts).forEach((fullname) => {
      if (Object.keys(appts).length > 1) {
        appointmentsGrid.push(<div key={fullname} className="appointmentsSection">{fullname}</div>);
      }

      appts[fullname].forEach((appointment) => {
        const showCancel = appointment.assignedProvider && !appointment.assignedProvider.practice.hideCancelAppointmentLink;
        const date = new Date(appointment.schedule.scheduledStartTime);
        if (appointment.checkInStatus === awsdk.AWSDKCheckInStatus.EARLY) {
          appointmentsActions =
            <div key="actions" className="appointmentsActions">
              <a href="/appointment/details" onClick={e => this.appointmentDetails(e, appointment)}>{this.props.messages.details}</a>
              {showCancel &&
              <span>
                | <a href="/appointment/cancel" onClick={e => this.cancelAppointment(e, appointment)}>{this.props.messages.cancel2}</a>
              </span>}
            </div>;
        } else {
          appointmentsActions =
          <div key="actions" className="appointmentsActions">
            <Button key="actions" className="appointmentsStartVisitButton" id="startVisitButton" onClick={e => this.startVisit(e, appointment)} >
              {this.props.messages.appointments_start_visit}
            </Button>
          </div>;
        }
        const appointmentDateTime =
          <div className="appointmentsDateTime">
            <span className="appointmentsDate"><FormattedDate value={date} year='numeric' month='numeric' day='numeric'/></span>
            <span className="appointmentSeperator"> | </span>
            <span className="appointmentsTime"><FormattedTime value={date} timeZoneName='short'/></span>
          </div>;

        const appointmentDetail =
          <div className="appointmentsDetail">
            {appointment.assignedProvider && <FormattedMessage id="appointments_visit_with" values={ { provider_fullname: appointment.assignedProvider.fullName, provider_specialty: appointment.assignedProvider.specialty.value } } />}
            {!appointment.assignedProvider && <FormattedMessage id="appointments_visit_with" values={ { provider_fullname: appointment.practiceName, provider_specialty: appointment.specialty.value } } />}
          </div>;

        const appointmentModalityIcon =
          <div className="appointmentsModalityIcon">
            {appointment.modality.modalityType === awsdk.AWSDKVisitModalityType.VIDEO ?
              <img alt={appointment.modality.localizedDisplayName} src={VideoIcon}/>
              :
              <img alt={appointment.modality.localizedDisplayName} src={PhoneIcon}/>
            }
          </div>;

        appointmentsGrid.push(
          <div key={appointment.id.persistentId} className="appointmentsRow">
            <div className="appointmentTimeAndType">
              { appointmentDateTime }
              { appointmentModalityIcon }
            </div>
            { appointmentDetail }
            { appointmentsActions }
          </div>);
      });
    });

    if (this.props.appointments.length === 0) {
      appointmentsGrid.push(<div key="none" className="appointmentsNone">{this.props.messages.appointments_none_scheduled}</div>);
    }

    return (
      <div className="App">
        {this.state.appointment &&
         <CancelAppointmentModal
           isOpen={this.props.cancelAppointmentModalOpen}
           toggle={this.props.toggleCancelModal}
           confirmCancel={this.confirmCancel.bind(this)}
           appointment={this.state.appointment}
           messages={this.props.messages}
           direction={this.props.direction} />
        }
        <div className="appointmentsComponent">
          <div className="appointmentsHeader"></div>
          <div className="appointmentsBody">
            <div className="appointmentsGrid">
              <div className="appointmentsTitle">{this.props.messages.appointments}</div>
              <div className="appointmentsList">
                {appointmentsGrid}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const CancelAppointmentModal = (props) => {
  const startDate = new Date(props.appointment.schedule.scheduledStartTime);
  const practiceName = props.direction !== 'rtl' ? `${props.appointment.practiceName} ${props.appointment.specialty.value}` : `${props.appointment.specialty.value} ${props.appointment.practiceName}`;
  const providerOrPracticeName = (props.appointment.assignedProvider && props.appointment.assignedProvider.fullName) || practiceName;
  return (<YesNoModal
    showClose={true}
    isOpen={props.isOpen}
    toggle={props.toggle}
    header={props.messages.appointments_cancel}
    message={
      <div className="appointmentsCancelBody">
        <div>
          {props.messages.appointments_cancel_are_you_sure}
        </div>
        <div className="appointmentsDateTime">
          <span className="appointmentsDate"><FormattedDate value={startDate} year='numeric' month='numeric' day='numeric' timeZone='utc'/></span>
          <span className="appointmentSeparator"> | </span>
          <span className="appointmentsTime"><FormattedTime value={startDate} timeZoneName='short'/></span>
        </div>
        <div className="appointmentsDetail">
          <FormattedMessage id="appointments_visit_with" values={ { provider_fullname: providerOrPracticeName, provider_specialty: props.appointment.specialty.value } } />
        </div>
      </div>
    }
    messages={props.messages}
    yesClickHandler={props.confirmCancel}/>);
};

AppointmentsComponent.propTypes = {
  history: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  appointments: PropTypes.array.isRequired,
  logger: PropTypes.object.isRequired,
  startVisit: PropTypes.func.isRequired,
  cancelAppointment: PropTypes.func.isRequired,
  appointmentDetails: PropTypes.func.isRequired,
};
AppointmentsComponent.defaultProps = {};
export default AppointmentsComponent;
