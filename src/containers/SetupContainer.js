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
import PropTypes from 'prop-types';
import awsdk from 'awsdk';

import SetupComponent from '../components/setup/SetupComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { isValidUrl } from '../components/Util';

class SetupContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.logger = props.logger;
    this.logger.debug('SetupContainer: props', props);
    this.messages = props.messages;
    this.configuration = props.configuration;
    this.savedConfiguration = JSON.parse(localStorage.getItem('configuration')) || window.awsdkconfig;
    this.mutualAuthEnabled = (localStorage.getItem('mutualAuthEnabled') === 'true');
    this.enableSpinner = props.enableSpinner;
    this.disableSpinner = props.disableSpinner;
    this.sdkInitialized = props.sdkInitialized;
    this.state = {
      errors: {},
      modified: {},
      sdkApiKey: this.savedConfiguration ? this.savedConfiguration.sdkApiKey : '',
      baseUrl: this.savedConfiguration ? this.savedConfiguration.baseUrl : '',
      mutualAuthEnabled: this.mutualAuthEnabled ? this.mutualAuthEnabled : false,
    };
  }

  submitSetup(e) {
    this.logger.debug('submitSetup');
    e.preventDefault();
    if (this.state.sdkApiKey === '' || !isValidUrl(this.state.baseUrl)) {
      const modified = {
        sdkApiKey: true,
        baseUrl: true,
      };
      this.setState({ modified });
      return;
    }
    this.enableSpinner();
    const configuration = {
      sdkApiKey: this.state.sdkApiKey,
      baseUrl: this.state.baseUrl,
      locale: this.props.locale,
      isIVRCallbackEnabled: true,
    };
    this.sdk.initialize(configuration)
      .then((initialized) => {
        this.disableSpinner();
        if (!initialized) {
          const errors = {};
          errors.sdkApiKey = this.messages.setup_error_initialization;
          this.setState({ errors });
        } else {
          this.logger.info('**********SDK INITIALIZED. ********');
          localStorage.setItem('configuration', JSON.stringify(configuration));
          localStorage.setItem('mutualAuthEnabled', this.state.mutualAuthEnabled);
          if (this.sdkInitialized()) {
            this.props.history.push('/');
          }
        }
      })
      .catch((error) => {
        this.disableSpinner();
        this.logger.error('**********SDK NOT INITIALIZED. ********', error);
        if (error instanceof awsdk.AWSDKError && error.errorCode === awsdk.AWSDKErrorCode.uninitialized) {
          const errors = {};
          errors.sdkApiKey = this.messages.setup_error_initialization;
          this.setState({ errors });
        } else if (error instanceof awsdk.AWSDKError && error.errorCode === awsdk.AWSDKErrorCode.versionIncompatible) {
          const errors = {};
          errors.baseUrl = this.messages.setup_error_version_incompatible;
          this.setState({ errors });
        } else {
          localStorage.removeItem('configuration');
          localStorage.removeItem('mutualAuthEnabled');
          this.props.showErrorModal();
        }
      });
  }

  render() {
    const valueLinks = this.linkAll(['sdkApiKey', 'baseUrl', 'mutualAuthEnabled']);
    valueLinks.sdkApiKey.check(x => !this.state.modified.sdkApiKey || x, this.props.messages.validation_required);
    valueLinks.baseUrl.check(x => !this.state.modified.baseUrl || isValidUrl(x), this.props.messages.validation_required);
    return (
      <div>
        <SetupComponent key='setupComponent' submitSetup={this.submitSetup.bind(this)} valueLinks={valueLinks} {...this.props} />
      </div>
    );
  }
}

SetupContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
SetupContainer.defaultProps = {};
export default SetupContainer;
