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
import { Button } from 'reactstrap';

import './MyHealthComponent.css';

class MyHealthMedicationsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthMedicationsComponent: props', props);
    this.dataListController = null;
    this.state = {
      medicationName: '',
    };
  }

  onOptionSelected(option) {
    if (option.length >= 3) {
      this.props.searchMedications(option);
    }
    this.setState({ medicationName: option });
  }

  onChange(e) {
    if (e.target.value.length >= 3) {
      this.props.searchMedications(e.target.value);
    }
    this.setState({ medicationName: e.target.value });
  }

  getMedication(medList, medicationName) {
    let medication = null;
    if (medList) {
      medication = medList.find(med => med.displayName === medicationName);
    }
    return medication;
  }

  addMedication(medication) {
    this.props.addMedication(medication);
    this.setState({ medicationName: '' });

    // no two way binding on 'medicationName' for this dataList component, need to manually clear it.
    this.dataListController.setFilter('');
  }

  deleteMedication(medName) {
    this.props.deleteMedication(medName);
  }

  render() {
    const medication = this.getMedication(this.props.suggestions, this.state.medicationName);

    const medSuggestions = [];
    if (this.props.suggestions) {
      this.props.suggestions.forEach((med) => {
        medSuggestions.push(med.displayName);
      });
    }

    /* const dataList = <ReactDatalist
      className="myMedicationsInput"
      onOptionSelected={option => this.onOptionSelected(option)}
      list="medSuggestions"
      options={medSuggestions}
      onInputChange={e => this.onChange(e)}
      getController={(c) => { this.dataListController = c; }}/>; */

    const meds = [];
    if (this.props.medications) {
      this.props.medications.forEach((med) => {
        meds.push(<div key={med.displayName} className="myMedicationsListEntry">{med.displayName}<div className="myDeleteIcon" onClick={this.deleteMedication.bind(this, med.displayName)}/></div>);
      });
    }

    return (
      <div className="myHealthContent">
        <div className="myHealthContentTitle">{this.props.messages.medications2}</div>
        <div className="myHealthContentDescription">{this.props.messages.taking_any_medications}</div>
        <div className="myHealthMedicationsContent">
          <div className="medicationLookup">
            <div className="searchArea">
              <label>
                Choose a browser from this list:
                <input list="browsers" name="myBrowser" />
              </label>
              <datalist id="browsers">
                {medSuggestions.map((item, key) => (
                    <option key={key} value={item} />
                ))}
              </datalist>
            </div>
            <div className="addArea">
              <Button className="myMedicationsButton"id="addMedicationButton" onClick={this.addMedication.bind(this, medication)} disabled={!medication}>
                {this.props.messages.add2}
              </Button>
            </div>
          </div>
          <div className="myMedicationsList">
            {meds}
          </div>
        </div>
      </div>
    );
  }
}

MyHealthMedicationsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthMedicationsComponent.defaultProps = {};
export default MyHealthMedicationsComponent;
