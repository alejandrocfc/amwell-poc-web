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
import MyHealthMedicationsComponent from '../components/myhealth/MyHealthMedicationsComponent';
import { hasContextChanged } from '../components/Util';

class MyHealthMedicationsContainer extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthMedicationsContainer: props', props);
    this.searchMedications = this.searchMedications.bind(this);
    this.addMedication = this.addMedication.bind(this);
    this.deleteMedication = this.deleteMedication.bind(this);
    this.state = {
      medications: [],
      suggestions: [],
    };
  }

  componentDidMount() {
    this.getMedications();
  }

  getMedications() {
    this.props.sdk.consumerService.getMedications(this.props.activeConsumer)
      .then((response) => {
        this.props.logger.info('Medications', response.medications);
        this.setState({ medications: response.medications });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      });
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.getMedications();
    }
  }
  reduceSuggestionList(suggestions, medications) {
    if (medications.length === 0) {
      return suggestions;
    }
    let newSuggestions = suggestions;
    medications.forEach((medication) => {
      newSuggestions = newSuggestions.filter(sug => sug.displayName !== medication.displayName);
    });
    return newSuggestions;
  }

  searchMedications(medicationSearchText) {
    this.props.enableSpinner();
    this.props.sdk.consumerService.searchMedications(this.props.activeConsumer, medicationSearchText)
      .then((response) => {
        const suggestions = this.reduceSuggestionList(response.medications, this.state.medications);
        this.props.logger.info('Medication Suggestions', suggestions);
        this.setState({ suggestions });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      }).finally(() => {
        this.props.disableSpinner();
      });
  }

  addMedication(medication) {
    this.props.enableSpinner();
    const medications = this.state.medications;
    medications.push(medication);
    this.props.sdk.consumerService.updateMedications(this.props.activeConsumer, medications)
      .then(() => {
        this.props.logger.info('Medications', medications);
        this.setState({ medications });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      }).finally(() => {
        this.props.disableSpinner();
      });
  }

  deleteMedication(medicationName) {
    this.props.enableSpinner();
    let medications = this.state.medications;
    medications = medications.filter(med => med.displayName !== medicationName);
    this.props.sdk.consumerService.updateMedications(this.props.activeConsumer, medications)
      .then(() => {
        this.props.logger.info('Medications', medications);
        this.setState({ medications });
      })
      .catch((reason) => {
        this.props.logger.info('Something went wrong:', reason);
        this.props.showErrorModal();
      }).finally(() => {
        this.props.disableSpinner();
      });
  }

  render() {
    const properties = {
      medications: this.state.medications,
      suggestions: this.state.suggestions,
      searchMedications: this.searchMedications,
      addMedication: this.addMedication,
      deleteMedication: this.deleteMedication,
    };

    return (
      <MyHealthMedicationsComponent key="myHealthMedicationsComponent" {...this.props} {...properties} />
    );
  }
}

MyHealthMedicationsContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthMedicationsContainer.defaultProps = {};
export default MyHealthMedicationsContainer;
