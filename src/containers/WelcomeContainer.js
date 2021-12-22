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
import { Modal, ModalBody, ModalFooter, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';

import Welcome from '../components/welcome/WelcomeComponent';

class WelcomeContainer extends React.Component {
  constructor(props) {
    super(props);
    this.sdk = props.sdk;
    this.logger = props.logger;
    this.messages = props.messages;
    this.sdkInitialized = props.sdkInitialized;
    this.history = props.history;
    this.showWelcome = !localStorage.getItem('welcome');
    this.configuration = localStorage.getItem('configuration') ? JSON.parse(localStorage.getItem('configuration')) : null;
    this.enableSpinner = props.enableSpinner;
    this.disableSpinner = props.disableSpinner;
    this.previousLocation = props.location.state ? props.location.state.from : null;
    this.forwardPaths = ['/passwordAssistance', '/guest'];
    this.state = {
      modal: false,
      message: null,
    };
  }

  updateConfiguration() {
    const configuration = JSON.parse(localStorage.getItem('configuration'));
    this.enableSpinner();
    this.sdk.initialize(configuration)
      .then((initialized) => {
        if (!initialized) {
          this.setState({ formError: this.messages.setup_error_initialization });
        } else {
          this.sdkInitialized();
          const nextLocation = this.previousLocation && this.forwardPaths.includes(this.previousLocation.pathname) ? this.previousLocation : '/';
          this.props.history.push(nextLocation);
        }
      })
      .catch((error) => {
        if (error instanceof awsdk.AWSDKError && error.errorCode === awsdk.AWSDKErrorCode.versionIncompatible) {
          this.setState({ message: this.messages.setup_error_version_incompatible, modal: true });
        } else {
          this.setState({ message: this.messages.modal_error_something_went_wrong, modal: true });
        }
      }).finally(() => this.disableSpinner());
  }

  UNSAFE_componentWillMount() {
    if (!this.showWelcome) {
      if (!this.sdk.initialized) {
        if (this.configuration) {
          this.logger.info('Sdk not initialized but a configuration exists. Updating.');
          this.updateConfiguration(this.configuration);
        } else {
          this.logger.info('Sdk not initialized and no configuration exists. Redirecting to setup.');
          this.props.history.replace('/setup');
        }
      } else {
        this.logger.info('Sdk is already initialized. Redirecting to login.');
        this.props.history.replace('/login');
      }
    }
  }

  // this callback is used by the error modal
  onErrorModalClose() {
    this.setState({ message: null, modal: false });
    this.history.replace('/setup');
  }

  // this callback is used by the WelcomeComponent in its happy path
  onClose() {
    localStorage.setItem('welcome', 'true');
    this.props.history.replace('/setup');
  }

  render() {
    const props = this.props;
    const properties = {
      formErrorMessage: this.state.formErrorMessage,
      onClose: this.onClose,
      showWelcomeText: this.showWelcome,
    };
    return (
      <div>
        <Modal isOpen={this.state.modal}>
          <ModalBody>
            {this.state.message}
          </ModalBody>
          <ModalFooter>
            <Button color="blue" onClick={this.onErrorModalClose.bind(this)}>{this.messages.close}</Button>
          </ModalFooter>
        </Modal>
        <Welcome key='welcomeComponent' {...properties} {...props} />
      </div>
    );
  }
}

WelcomeContainer.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};

export default WelcomeContainer;
