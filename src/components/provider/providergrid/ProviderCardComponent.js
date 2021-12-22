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
import { Col } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import awsdk from 'awsdk';

import './ProviderCardComponent.css';
import ProviderPhotoPlaceholder from '../images/provider_photo_placeholder.png';

const ProviderCardComponent = (props) => {
  props.logger.debug('ProviderCardComponent: props', props);

  let status = '';
  let statusMessage = '';
  const isAvailable = [awsdk.AWSDKProviderVisibility.WEB_AVAILABLE, awsdk.AWSDKProviderVisibility.PHONE_AVAILABLE].includes(props.provider.visibility) && props.provider.waitingRoomCount === 0;
  if (props.provider.visibility === awsdk.AWSDKProviderVisibility.OFFLINE) {
    status = 'offline';
    statusMessage = props.messages.provider_availability_offline;
  } else if (isAvailable) {
    status = 'available';
    statusMessage = props.messages.provider_availability_available;
  } else {
    status = 'waiting';
    statusMessage = <FormattedMessage id="statusMessage" defaultMessage={ props.messages.provider_patients_waiting } values={{ count: Math.max(1, props.provider.waitingRoomCount) }}/>;
  }

  const providerImage = props.provider.hasImage ? props.provider.logoUrl : ProviderPhotoPlaceholder;

  return (
    <Col id={props.provider.sourceId} className={`providerCard ${status}`} onClick={e => props.handleProviderClick(e, props.provider)}>
      <div className={`providerLogo ${status}`}><img alt={props.provider.fullName} src={providerImage}/></div>
      <div className="providerFullName">{props.provider.fullName}</div>
      <div className="providerSpecialty">{props.provider.specialty.value}</div>
      <div className="providerRating">{'\u2605'.repeat(props.provider.rating)}</div>
      <div className={`providerAvailability ${status}`}>{statusMessage}</div>
    </Col>
  );
};

ProviderCardComponent.propTypes = {
  provider: PropTypes.object.isRequired,
  handleProviderClick: PropTypes.func.isRequired,
};
export default ProviderCardComponent;
