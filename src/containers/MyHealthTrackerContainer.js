/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import MyHealthTrackerComponent from '../components/myhealth/MyHealthTrackerComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import { getCurrentDate, getCurrentTime, getPastDateTime, isValidInputDate, isValidInputTime, parseInputDateTime } from '../components/Util';

class MyHealthTrackerContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthTrackerContainer: props', props);
    this.trackerTemplate = (props.location.state && props.location.state.trackerTemplate) ? awsdk.AWSDKFactory.restoreTrackerTemplate(props.location.state.trackerTemplate) : null;
    const currentDate = getCurrentDate('MM/DD/YY');
    const currentTime = getCurrentTime('h:mm A');
    const startDate = getPastDateTime(90, 'days', 'MM/DD/YY');
    this.state = {
      errors: {},
      modified: [],
      trackerEntries: [],
      measurementDate: currentDate,
      measurementTime: currentTime,
      startDate,
      endDate: currentDate,
      isTrackerEntryAddedModalOpen: false,
      isTrackerDeleteModalOpen: false,
    };
    if (this.trackerTemplate) {
      this.trackerTemplate.components.forEach((component) => {
        this.state[component.uuid] = '';
      });
    }
  }

  componentDidMount() {
    this.fetchTrackers();
  }

  getHealthTrackerRequest() {
    const healthTrackerRequest = this.props.sdk.consumerService.getNewTrackerRequest();
    const dataPoints = [];
    this.trackerTemplate.components.forEach((component) => {
      const dataPoint = this.props.sdk.consumerService.getNewTrackerDataPointRequest();
      dataPoint.trackerComponent = component;
      dataPoint.value = this.state[component.uuid];
      dataPoints.push(dataPoint);
    });
    const trackerEntryRequest = this.props.sdk.consumerService.getNewTrackerEntryRequest();
    trackerEntryRequest.trackerTemplate = this.trackerTemplate;
    trackerEntryRequest.data = dataPoints;
    const trackerEntries = [trackerEntryRequest];
    healthTrackerRequest.entries = trackerEntries;
    healthTrackerRequest.measurementDateTime = parseInputDateTime(`${this.state.measurementDate} ${this.state.measurementTime.toUpperCase()}`, 'MM/DD/YY h:mm A');
    healthTrackerRequest.canonicalTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    return healthTrackerRequest;
  }

  fetchTrackers(event) {
    if (event) event.preventDefault();
    if (!isValidInputDate(this.state.startDate) || !isValidInputDate(this.state.endDate)) {
      return;
    }
    this.props.enableSpinner();
    const searchCriteria = this.props.sdk.consumerService.getNewTrackersSearchCriteria();
    searchCriteria.trackerTemplate = this.trackerTemplate;
    searchCriteria.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    searchCriteria.endDate = parseInputDateTime(`${this.state.endDate} 11:59 PM`, 'MM/DD/YY h:mm A');
    searchCriteria.startDate = parseInputDateTime(this.state.startDate, 'MM/DD/YY');
    this.props.logger.info('trackersSearchCriteria', searchCriteria);
    this.props.sdk.consumerService.searchTrackers(this.props.activeConsumer, searchCriteria)
      .then((trackerEntries) => {
        this.props.logger.info('Tracker Entries', trackerEntries);
        this.setState({ trackerEntries });
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      })
      .finally(() => this.props.disableSpinner());
  }

  addHealthTracker(event) {
    this.props.enableSpinner();
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    try {
      const healthTrackerRequest = this.getHealthTrackerRequest();
      this.props.logger.info('healthTrackerRequest', healthTrackerRequest);
      this.props.sdk.consumerService.addTracker(this.props.activeConsumer, healthTrackerRequest)
        .then(() => {
          this.resetAddTrackerInputs();
          this.toggleTrackerEntryAddedModal();
          this.fetchTrackers();
        })
        .catch((error) => {
          this.props.logger.info('Something went wrong:', error);
          this.mapError(error);
        })
        .finally(() => this.props.disableSpinner());
    } catch (error) {
      this.props.logger.info('Something went wrong:', error);
      this.mapError(error);
    } finally {
      this.props.disableSpinner();
    }
  }

  deleteHealthTrackerData(event) {
    this.props.enableSpinner();
    if (event) event.preventDefault();
    const searchCriteria = this.props.sdk.consumerService.getNewTrackersSearchCriteria();
    searchCriteria.trackerTemplate = this.trackerTemplate;
    searchCriteria.timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
    searchCriteria.startDate = parseInputDateTime(this.state.startDate, 'MM/DD/YY');
    searchCriteria.endDate = parseInputDateTime(`${this.state.endDate} 11:59 PM`, 'MM/DD/YY h:mm A');
    this.props.logger.info('trackersSearchCriteria', searchCriteria);
    this.props.sdk.consumerService.deleteTrackers(this.props.activeConsumer, searchCriteria)
      .then(() => {
        this.fetchTrackers();
      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      }).finally(() => {
        this.toggleDeleteTrackerEntriesModal();
        this.props.disableSpinner();
      });
  }

  getTrackerComponent(title) {
    const matches = this.trackerTemplate.components
      .filter(component => component.title === title);
    return (matches.length > 0) ? matches[0] : null;
  }

  resetAddTrackerInputs() {
    this.trackerTemplate.components.forEach((component) => {
      this.state[component.uuid] = '';
    });
    this.setState({ measurementDate: getCurrentDate('MM/DD/YY'), measurementTime: getCurrentTime('h:mm A') });
  }

  toggleTrackerEntryAddedModal(event) {
    if (event) event.preventDefault();
    this.setState(prevState => ({
      isTrackerEntryAddedModalOpen: !prevState.isTrackerEntryAddedModalOpen,
    }));
  }

  toggleDeleteTrackerEntriesModal(event) {
    if (event) event.preventDefault();
    this.setState(prevState => ({
      isTrackerDeleteModalOpen: !prevState.isTrackerDeleteModalOpen,
    }));
  }

  setLocaleErrorMessage(errors, fieldName) {
    switch (fieldName) {
      case 'endDate':
        errors.endDate = this.props.messages.tracker_entries_filter_date_invalid;
        break;
      case 'startDate':
        errors.startDate = this.props.messages.tracker_entries_filter_date_invalid;
        break;
      case 'measurementDateTime':
        errors.measurementDate = this.props.messages.tracker_entry_date_invalid;
        break;
      default:
        this.props.showErrorModal();
    }
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      switch (error.errorCode) {
        case awsdk.AWSDKErrorCode.illegalArgument:
          this.setLocaleErrorMessage(errors, error.fieldName);
          break;
        case awsdk.AWSDKErrorCode.validationErrors:
          {
            const fieldErrors = error.errors;
            this.props.logger.debug('map errors - validation errors', fieldErrors);
            fieldErrors.forEach((fieldError) => {
              if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
                if (['out of range field'].includes(fieldError.reason)) {
                  const trackerComponent = this.getTrackerComponent(fieldError.fieldName);
                  if (trackerComponent) {
                    errors[trackerComponent.uuid] = this.context.intl.formatMessage({ id: 'tracker_entry_between_range' },
                      { title: fieldError.fieldName, minimum: trackerComponent.minimum, maximum: trackerComponent.maximum, shortUOMDescription: trackerComponent.unitOfMeasureShortDescription });
                  }
                }
              }
            });
          }
          break;
        default:
          this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  setupFilterEventHandlers(valueLinks) {
    valueLinks.startDate.setValue = (x, e) => {
      this.setState({ startDate: e.target.value, errors: {} },
        () => { this.fetchTrackers(); });
    };

    valueLinks.endDate.setValue = (x, e) => {
      this.setState({ endDate: e.target.value, errors: {} },
        () => { this.fetchTrackers(); });
    };
  }

  canAddHealthTracker() {
    return (
      (this.state.measurementDate !== '' && isValidInputDate(this.state.measurementDate))
      && (this.state.measurementTime !== '' && isValidInputTime(this.state.measurementTime))
      && (this.trackerTemplate.components && this.trackerTemplate.components.every(component => (this.state[component.uuid] !== ''))));
  }

  render() {
    const valueLinks = this.linkAll();
    this.setupFilterEventHandlers(valueLinks);
    const properties = {
      modified: this.state.modified,
      valueLinks,
      trackerTemplate: this.trackerTemplate,
      trackerEntries: this.state.trackerEntries,
      isTrackerEntryAddedModalOpen: this.state.isTrackerEntryAddedModalOpen,
      isTrackerDeleteModalOpen: this.state.isTrackerDeleteModalOpen,
      canAddHealthTracker: this.canAddHealthTracker.bind(this),
      addHealthTracker: this.addHealthTracker.bind(this),
      deleteHealthTrackerData: this.deleteHealthTrackerData.bind(this),
      toggleTrackerEntryAddedModal: this.toggleTrackerEntryAddedModal.bind(this),
      toggleDeleteTrackerEntriesModal: this.toggleDeleteTrackerEntriesModal.bind(this),
    };

    return (
      <div className="App">
        <div className="myHealthComponent">
          <div className="myHealthHeader"/>
          <div className="myHealthBody">
            <div className="myHealthTitle">{this.props.messages.my_health}</div>
            <div className="myHealthContainer">
              <MyHealthTrackerComponent key="myHealthTracker" {...this.props} {...properties}/>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

MyHealthTrackerContainer.contextTypes = {
  intl: PropTypes.object,
};
MyHealthTrackerContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthTrackerContainer.defaultProps = {};
export default MyHealthTrackerContainer;
