/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

class LogoutComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('logout consumer, ', props.consumer);
  }

  UNSAFE_componentWillMount() {
    const consumer = this.props.consumer;
    new Promise((resolve, reject) => {
      const res = this.props.consumerLogoutCallback();
      if (res) {
        resolve(true);
      } else {
        reject(false);
      }
    })
      .then(() => this.props.sdk.authenticationService.clearAuthentication(consumer))
      .catch(err => this.props.logger.error('Found error', err));
  }

  render() {
    return (<Redirect to="/"/>);
  }
}

LogoutComponent.propTypes = {
  match: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  consumer: PropTypes.object.isRequired,
  consumerLogoutCallback: PropTypes.func.isRequired,
};
export default LogoutComponent;
