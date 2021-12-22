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

import ProviderNameAndPhotoComponent from '../../provider/ProviderNameAndPhotoComponent';
import ProviderInformationComponent from '../../provider/ProviderInformationComponent';
import './ProviderAvailabilityDetailsComponent.css';

const ProviderAvailabilityDetailsComponent = (props) => {
  props.logger.debug('ProviderAvailabilityDetailsComponent: props', props);

  return (
    <div className="providerAvailabilityDetailsComponent">
      <div className="banner"/>
      <ProviderNameAndPhotoComponent {...props}/>
      <div className="details">
        <div className="providerGreeting">{props.providerDetails.textGreeting}</div>
        <ProviderInformationComponent {...props}/>
      </div>
    </div>
  );
};

ProviderAvailabilityDetailsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  providerDetails: PropTypes.object.isRequired,
};
ProviderAvailabilityDetailsComponent.defaultProps = {};
export default ProviderAvailabilityDetailsComponent;
