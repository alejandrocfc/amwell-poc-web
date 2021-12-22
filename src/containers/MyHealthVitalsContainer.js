/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import MyHealthVitalsComponent from '../components/myhealth/MyHealthVitalsComponent';
import ValueLinkedContainer from './ValueLinkedContainer';

class MyHealthVitalsContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthVitalsContainer: props', props);
    this.updateVitals = this.updateVitals.bind(this);
    this.state = {
      errors: [],
      modified: [],
      systolic: '',
      diastolic: '',
      temperature: '',
      weightMajor: '',
      weightMinor: '',
      heightMajor: '',
      heightMinor: '',
    };
  }


  componentDidMount() {
    this.props.sdk.consumerService.getVitals(this.props.activeConsumer)
      .then((vitals) => {
        this.props.logger.info('Vitals', vitals);

        this.setState({
          vitals,
        });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
  }

  updateVitals() {
    this.props.enableSpinner();
    const vitals = this.state.vitals;
    vitals.systolic = this.state.systolic;
    vitals.diastolic = this.state.diastolic;
    vitals.temperature = this.state.temperature;
    vitals.weight = this.state.weightMajor;
    vitals.weightMajor = this.state.weightMajor;
    vitals.weightMinor = this.state.weightMinor;
    vitals.heightMajor = this.state.heightMajor;
    vitals.heightMinor = this.state.heightMinor;

    //clear previous errors
    const errors = {};
    this.setState({ errors });

    this.props.sdk.consumerService.updateVitals(this.props.activeConsumer, vitals)
      .then(() => {
        this.props.logger.info('Vitals', vitals);

        const modified = [];

        this.setState({
          modified,
          vitals,
        });

      })
      .catch((error) => {
        this.props.logger.info('Something went wrong:', error);
        this.mapError(error);
      }).finally(() => {
        this.props.disableSpinner();
      });
  }

  mapError(error) {
    const errors = {};
    if (error != null) {
      this.props.logger.debug('map error', error);
      if (error.errorCode === awsdk.AWSDKErrorCode.validationErrors) {
        const fieldErrors = error.errors;
        this.props.logger.debug('map errors - validation errors', fieldErrors);
        fieldErrors.forEach((fieldError) => {
          if (fieldError.errorCode === awsdk.AWSDKErrorCode.fieldValidationError) {
            if (fieldError.fieldName === 'temperature') {
              errors.temperature = this.props.messages.my_health_vitals_temperature_between_range;
            } else if (fieldError.fieldName === 'systolic' && ['out of range field', 'invalid format'].includes(fieldError.reason)) {
              errors.systolic = this.props.messages.my_health_vitals_systolic_between_range;
            } else if (fieldError.fieldName === 'systolic' && fieldError.reason === 'field part of set') {
              errors.systolic = this.props.messages.my_health_vitals_systolic_diastolic_provided_together;
            } else if (fieldError.fieldName === 'diastolic' && ['out of range field', 'invalid format'].includes(fieldError.reason)) {
              errors.diastolic = this.props.messages.my_health_vitals_diastolic_between_range;
            } else if (fieldError.fieldName === 'diastolic' && fieldError.reason === 'field part of set') {
              errors.diastolic = this.props.messages.my_health_vitals_systolic_diastolic_provided_together;
            } else if (fieldError.fieldName === 'diastolic' && fieldError.reason === 'diastolic not less than systolic') {
              errors.diastolic = this.props.messages.my_health_vitals_diastolic_lower_than_systolic;
            }
            else if (fieldError.fieldName === 'weightMajor' && ['out of range for combined fields', 'invalid format'].includes(fieldError.reason)) {
              errors.weightMajor = this.props.messages.my_health_vitals_weight_out_of_range;
            }
            else if (fieldError.fieldName === 'weightMinor' && ['out of range field', 'invalid format', 'out of range for combined fields'].includes(fieldError.reason)) {
              if (fieldError.reason === 'out of range for combined fields' && !errors.weightMinor) {
                errors.weightMinor = 'suppressed';
              }
              else {
                errors.weightMinor = this.props.messages.my_health_vitals_ounce_out_of_range;
              }
            }
            else if (fieldError.fieldName === 'heightMajor' && ['out of range for combined fields', 'invalid format'].includes(fieldError.reason)) {
              errors.heightMajor = this.props.messages.my_health_vitals_height_out_of_range;
            }
            else if (fieldError.fieldName === 'heightMinor' && ['out of range field', 'invalid format', 'out of range for combined fields'].includes(fieldError.reason)) {
              if (fieldError.reason === 'out of range for combined fields' && !errors.heightMinor) {
                errors.heightMinor = 'suppressed';
              }
              else {
                errors.heightMinor = this.props.messages.my_health_vitals_inch_out_of_range;
              }
            }

          }
        });
      } else {
        this.props.showErrorModal();
      }
    }
    this.props.logger.debug('map error - set state', errors);
    this.setState({ errors });
  }

  render() {
    const properties = {
      updateVitals: this.updateVitals,
      modified: this.state.modified,
      valueLinks: this.linkAll(),
    };

    return (
      <MyHealthVitalsComponent key="myHealthVitalsComponent" {...this.props} {...properties} />
    );
  }
}

MyHealthVitalsContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthVitalsContainer.defaultProps = {};
export default MyHealthVitalsContainer;