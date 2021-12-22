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
import { Container, Row, Col } from 'reactstrap';

import './ProviderAvailabilityCardComponent.css';
import ProviderAvailabilityTimeSlotsComponent from './ProviderAvailabilityTimeSlotsComponent';
import ProviderPhotoPlaceholder from '../../provider/images/provider_photo_placeholder.png';

const ProviderAvailabilityCardComponent = (props) => {
  props.logger.debug('ProviderAvailabilityCardComponent: props', props);

  const providerImage = props.providerAvailability.provider.hasImage ? props.providerAvailability.provider.logoUrl : ProviderPhotoPlaceholder;

  return (
    <div key={props.providerAvailability.provider.id.persistentId} className="providerAvailabilityCard">
      <Container>
        <Row>
          <Col className="image">
            <img alt={props.providerAvailability.provider.fullName} src={providerImage}/>
          </Col>
          <Col className="nameAndSpecialty">
            <div className="name">{props.providerAvailability.provider.fullName}</div>
            <div className="specialty">{props.providerAvailability.provider.specialty.value}</div>
            <div className="profileLink">
              <button className="link-like" onClick={(e) => { e.preventDefault(); props.viewProfileHandler(props.providerAvailability.provider); }}>{props.messages.appointments_availability_provider_view_profile}</button>
            </div>
          </Col>
          <Col className="timeSlots">
            <ProviderAvailabilityTimeSlotsComponent handleTimeSlotClick={timeSlot => props.confirmAppointment(timeSlot, props.providerAvailability.provider)} timeSlots={props.providerAvailability.availableAppointmentTimeSlots} {...props}/>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

ProviderAvailabilityCardComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  providerAvailability: PropTypes.object.isRequired,
  viewProfileHandler: PropTypes.func.isRequired,
  confirmAppointment: PropTypes.func.isRequired,
};
ProviderAvailabilityCardComponent.defaultProps = {};
export default ProviderAvailabilityCardComponent;
