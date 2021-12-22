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

import ProviderPhotoPlaceholder from './images/provider_photo_placeholder.png';
import './ProviderNameAndPhotoComponent.css';


const ProviderNameAndPhotoComponent = (props) => {
  props.logger.debug('ProviderNameAndPhotoComponent: props', props);

  return (
    <div className="providerNameAndPhotoComponent">
      <div className={`providerLogo ${props.className}`}><img alt={props.providerDetails.fullName} src={props.providerDetails.logoUrl || ProviderPhotoPlaceholder}/></div>
      <div className="providerFullName">{props.providerDetails.fullName}</div>
      <div className="providerSpecialty">{props.providerDetails.specialty.value}</div>
      <div className="providerRating">{'\u2605'.repeat(props.providerDetails.rating)}</div>
    </div>);
};


ProviderNameAndPhotoComponent.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  providerDetails: PropTypes.object.isRequired,
};
ProviderNameAndPhotoComponent.defaultProps = {};
export default ProviderNameAndPhotoComponent;
