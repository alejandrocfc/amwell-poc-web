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
import { Button } from 'reactstrap';
import { FormattedDate, FormattedTime, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import ProviderPhotoPlaceholder from './images/provider_photo_placeholder.png';

import './AppointmentDetailsComponent.css';


const AppointmentDetailsComponent = (props) => {
  let welcomeMessage = null;
  let startVisitButton = null;

  // set welcome message and button
  if (props.appointment.checkInStatus === awsdk.AWSDKCheckInStatus.ON_TIME) {
    welcomeMessage = <FormattedMessage id='appointments_welcome_ontime' values={ { firstname: props.appointment.consumer.firstName } } />;
    startVisitButton =
      <Button className='appointmentDetailsStartVisitButton' onClick={props.startVisit}>
        {props.messages.appointments_start_visit}
      </Button>;
  } else if (props.appointment.checkInStatus === awsdk.AWSDKCheckInStatus.EARLY) {
    welcomeMessage = <FormattedMessage id='appointments_welcome_early' values={ { firstname: props.appointment.consumer.firstName } } />;
    startVisitButton =
      <Button className='appointmentDetailsStartVisitButton disabled' disabled onClick={props.startVisit}>
        {props.messages.appointments_start_visit}
      </Button>;
  } else {
    welcomeMessage = <b><FormattedMessage id='appointments_welcome_late' values={ { firstname: props.appointment.consumer.firstName } } /></b>;
    startVisitButton = props.messages.appointments_email;
  }

  const isLate = props.appointment.checkInStatus === awsdk.AWSDKCheckInStatus.LATE;
  const isPhoneAppointment = props.appointment.modality.modalityType === awsdk.AWSDKVisitModalityType.PHONE;

  const practiceName = props.direction !== 'rtl' ? `${props.appointment.practiceName} ${props.appointment.specialty.value}` : `${props.appointment.specialty.value} ${props.appointment.practiceName}`;
  const providerImage = props.appointment.assignedProvider && props.appointment.assignedProvider.hasImage ? props.appointment.assignedProvider.logoUrl : ProviderPhotoPlaceholder;
  const providerFullName = props.appointment.assignedProvider ? props.appointment.assignedProvider.fullName : practiceName;
  const appointmentDate = new Date(props.appointment.schedule.scheduledStartTime);
  const appointmentOnMessage = isPhoneAppointment ? props.messages.appointments_your_appointment_phone_on : props.messages.appointments_your_appointment_on;
  const showCancel = props.appointment.assignedProvider && !props.appointment.assignedProvider.practice.hideCancelAppointmentLink;
  return (
    <div className="appointmentDetailsComponent">
      <div className="appointmentHeader">
        <div className={`appointmentDetailsIcon ${isLate ? 'late' : ''}`} />
        <div className="appointmentDetailsTitle">{props.messages.appointments_your_appointment}</div>
      </div>
      <div className="appointmentDetailsBody">
        <div className="appointmentDetailsWelcome">{welcomeMessage}</div>

        <div className="appointmentDetailsProvider">
          <img alt={providerFullName} src={providerImage}/>
        </div>

        <div className="appointmentDetailsOn">{!isLate ? appointmentOnMessage : props.messages.appointments_your_appointment_was_scheduled}</div>

        <div className="appointmentDetailsWhen">
          <FormattedDate value={appointmentDate} weekday='long' year='numeric' month='long' day='numeric'/>{' '}
          <FormattedTime value={appointmentDate} timeZoneName='short'/>
        </div>

        <div className="appointmentDetailsWho">
          <FormattedMessage id="appointments_with_whom" values={ { provider_fullname: providerFullName } } />
        </div>

        {!isPhoneAppointment ?
          <div>
            <div>
              <div className="appointmentDetailsInstruction">{!isLate ? props.messages.appointments_instructions : props.messages.appointments_reschedule}</div>
              <div className="appointmentDetailsButtonArea">{startVisitButton}</div>
            </div>

            {!isLate &&
            <div>
              {showCancel &&
              <div className="appointmentDetailsCancel">
                <button className="link-like" onClick={props.toggleCancelModal}>{props.messages.appointments_cancel2}</button>
              </div>}
              <div className="appointmentDetailsTestComputer">
                <FormattedMessage id="appointmentDetailsTestComputer" values={props.messages.appointments_test_computer} />
              </div>
            </div>}

            <div className="appointmentDetailsAssistance">{props.messages.appointments_need_assistance}</div>
          </div>
          :
          <div>
            {!isLate &&
            <div>
              <div className="appointmentDetailsPhoneSection">
                <FormattedMessage
                  tagName="div"
                  id="appointments_will_call"
                  values={ { phoneNumber: <span>{props.appointment.formattedInitiatorOverridePhoneNumber}</span> } }/>
                <button className="link-like" onClick={props.togglePhoneNumberModal}>{props.messages.change}</button>
              </div>
              {showCancel &&
              <div className="appointmentDetailsCancel">
                <button className="link-like" onClick={props.toggleCancelModal}>{props.messages.appointments_cancel2}</button>
              </div>}
            </div>}
          </div>}
      </div>
    </div>
  );
};

AppointmentDetailsComponent.propTypes = {
  history: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  startVisit: PropTypes.func.isRequired,
  appointment: PropTypes.object.isRequired,
};
AppointmentDetailsComponent.defaultProps = {};
export default AppointmentDetailsComponent;
