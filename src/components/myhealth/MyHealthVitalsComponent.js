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
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { NumberInput } from '../form/Inputs';
import './MyHealthComponent.css';

class MyHealthVitalsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthVitalsComponent: props', props);
  }

  render() {
    const temperatureLink = this.props.valueLinks.temperature;
    const systolicLink = this.props.valueLinks.systolic;
    const diastolicLink = this.props.valueLinks.diastolic;
    const weightMajorLink = this.props.valueLinks.weightMajor;
    const weightMinorLink = this.props.valueLinks.weightMinor;
    const heightMajorLink = this.props.valueLinks.heightMajor;
    const heightMinorLink = this.props.valueLinks.heightMinor;

    return (
      <div className="myHealthContent">
        <div className="myHealthContentTitle">{this.props.messages.vitals2}</div>
        <div className="myHealthContentDescription">{this.props.messages.current_vitals}</div>
        <div className="myHealthVitalsContent">
          <div className='myVistalsBloodPressure'>
            <div className="myVitalsLabel">{this.props.messages.blood_pressure}</div>
            <NumberInput tabIndex="1" className="myVitalsInput" id="myVitalsSystolic" name="myVitalsSystolic" integer='true' positive='true' valueLink={systolicLink} placeholder={this.props.messages.vitals_systolic} maxLength="3"/>
            <div className="myVitalsUnits">{this.props.messages.blood_pressure_units}</div>
            <NumberInput tabIndex="2" className="myVitalsInput" id="myVitalsDiastolic" name="myVitalsDiastolic" integer='true' positive='true' valueLink={diastolicLink} placeholder={this.props.messages.vitals_diastolic} maxLength="3"/>
            <div className="myVitalsUnits">{this.props.messages.blood_pressure_units}</div>
            { systolicLink.error && <div className="error">{systolicLink.error}</div> }
            { diastolicLink.error && <div className="error">{diastolicLink.error}</div> }
          </div>
          <div className='myVitalsTemperature'>
            <div className="myVitalsLabel">{this.props.messages.temperature}</div>
            <NumberInput tabIndex="3" className="myVitalsInput" id="myVitalsTemperature" name="myVitalsTemperature" positive='true' valueLink={temperatureLink} maxLength="3"/>
            <div className="myVitalsUnits">{this.props.messages.temperature_units}</div>
            { temperatureLink.error && <div className="error">{temperatureLink.error}</div> }
          </div>
          <div className='myVitalsWeight'>
            <div className="myVitalsLabel">{this.props.messages.weight}</div>
            <NumberInput tabIndex="4" className="myVitalsInput" id="myVitalsWeightMajor" name="myVitalsWeightMajor" integer='true' positive='true' valueLink={weightMajorLink} maxLength="4" />
            <div className="myVitalsUnits">{this.props.messages.weight_Major_units}</div>
            <NumberInput tabIndex="5" className="myVitalsInput" id="myVitalsWeightMinor" name="myVitalsWeightMinor" integer='true' positive='true' valueLink={weightMinorLink} maxLength="2" />
            <div className="myVitalsUnits">{this.props.messages.weight_Minor_units}</div>
            {weightMinorLink.error && weightMinorLink.error !== 'suppressed'  && <div className="error">{weightMinorLink.error}</div>}
            {weightMajorLink.error && <div className="error">{weightMajorLink.error}</div>}
          </div>
          <div className='myVitalsHeight'>
            <div className="myVitalsLabel">{this.props.messages.height}</div>
            <NumberInput tabIndex="6" className="myVitalsInput" id="myVitalsHeightMajor" name="myVitalsHeightMajor" integer='true' positive='true' valueLink={heightMajorLink} maxLength="2" />
            <div className="myVitalsUnits">{this.props.messages.height_Major_units}</div>
            <NumberInput tabIndex="7" className="myVitalsInput" id="myVitalsHeightMinor" name="myVitalsHeightMinor" integer='true' positive='true' valueLink={heightMinorLink} maxLength="2" />
            <div className="myVitalsUnits">{this.props.messages.height_Minor_units}</div>
            {heightMinorLink.error && heightMinorLink.error !== 'suppressed' && <div className="error">{heightMinorLink.error}</div>}
            {heightMajorLink.error && <div className="error">{heightMajorLink.error}</div>}
          </div>
          <div className='myVitalsFooter'>
            <Button tabIndex="8" className="myVitalsButton" id="saveVitalsButton" onClick={this.props.updateVitals} disabled={!this.props.modified.systolic && !this.props.modified.diastolic && !this.props.modified.temperature && !this.props.modified.weightMajor && !this.props.modified.weightMinor && !this.props.modified.heightMajor && !this.props.modified.heightMinor}>
              {this.props.messages.save}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

MyHealthVitalsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthVitalsComponent.defaultProps = {};
export default MyHealthVitalsComponent;