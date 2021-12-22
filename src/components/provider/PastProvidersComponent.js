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

import './PastProviderComponent.css';
import ProviderGridComponent from './providergrid/ProviderGridComponent';
import CallRequestedComponent from './CallRequestedComponent';


const PastProvidersComponent = (props) => {
  props.logger.debug('PastProvidersComponent: props', props);

  return (
    <div className="App">
      <div className="pastProviderComponent">
        <div className="pastProviderHeader"></div>
        <div className="pastProviderBody">
          <div className="pastProviderGrid">
            <span className="pastProviderTitle">{props.messages.practice_my_providers}</span>
            {
              (props.providers && props.providers.length > 0 && <ProviderGridComponent {...props}/>)
            ||
              <div className="noVisitsWithProvider">{props.messages.past_providers_no_visits}</div>
            }
          </div>
          <CallRequestedComponent {...props}/>
        </div>
      </div>
    </div>
  );
};

PastProvidersComponent.propTypes = {
  history: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  providers: PropTypes.array.isRequired,
  logger: PropTypes.object.isRequired,
};
PastProvidersComponent.defaultProps = {};
export default PastProvidersComponent;
