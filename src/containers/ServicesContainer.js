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

import awsdk from 'awsdk';
import React from 'react';
import PropTypes from 'prop-types';

import ServicesComponent from '../components/services/ServicesComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { hasContextChanged } from '../components/Util';

class ServicesContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('ServicesContainer: props', props);
    this.state = {
      errors: {},
      practices: [],
      newServiceKey: '',
      showAddServiceKeyModal: false,
    };
  }

  addServiceKey() {
    this.props.enableSpinner();
    this.props.logger.debug('Adding service key: ', this.state.newServiceKey);
    this.props.sdk.consumerService.addServiceKey(this.props.activeConsumer, this.state.newServiceKey)
      .then(() => {
        this.props.logger.debug('Successfully added service key: ', this.state.newServiceKey);
        this.getPractices();
        this.setState({ showAddServiceKeyModal: false });
      })
      .catch((error) => {
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  handlePracticeClick(e, practice) {
    e.preventDefault();
    this.props.logger.debug('Practice Click:', practice.name, practice);
    sessionStorage.setItem('selectedPractice', practice.toString());
    this.props.history.push('/practice/providers', { practice: practice.toString() });
  }

  toggleServiceKeyModal() {
    this.setState(prevState => ({
      showAddServiceKeyModal: !prevState.showAddServiceKeyModal,
      newServiceKey: '',
      errors: {},
    }));
  }

  componentDidMount() {
    this.getPractices();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.getPractices();
    }
  }

  getPractices() {
    this.props.enableSpinner();
    this.props.sdk.practiceService.getPractices(this.props.activeConsumer)
      .then((practiceList) => {
        this.props.logger.debug('Practices: ', practiceList.practices);
        this.setState({ practices: practiceList.practices });
      })
      .catch((error) => {
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  mapError(error) {
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.invalidServiceKeyError) {
      this.setState({ errors: { newServiceKey: this.props.messages.services_add_a_service_key_invalid } });
    } else {
      this.props.logger.error('Something went wrong:', error);
      this.props.showErrorModal();
    }
  }

  render() {
    const props = this.props;
    const properties = {
      practices: this.state.practices,
      addServiceKey: this.addServiceKey.bind(this),
      handlePracticeClick: this.handlePracticeClick.bind(this),
      showAddServiceKeyModal: this.state.showAddServiceKeyModal,
      toggleServiceKeyModal: this.toggleServiceKeyModal.bind(this),
    };
    return (
      <ServicesComponent key='servicesComponent' {...props} {...properties} valueLinks={this.linkAll()} />
    );
  }
}

ServicesContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  consumer: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
ServicesContainer.defaultProps = {};
export default ServicesContainer;
