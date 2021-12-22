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
import './MyHealthComponent.css';
import BoldingLabel from './BoldingLabelComponent';

class MyHealthAllergiesComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthAllergiesComponent: props', props);
  }

  render() {
    const allergiesMarkup = [];
    let halfCount = Math.trunc(this.props.allergies.length / 2);
    if (this.props.allergies.length % 2 !== 0) {
      halfCount += 1;
    }
    for (let idx = 0; idx < halfCount; idx += 1) {
      const idA = `allergies${idx}`;
      const idB = `allergies${idx + halfCount}`;
      allergiesMarkup.push(
        <div key={idx} className="myHealthAllergiesRow">
          <div className="myHealthAllergiesCol">
            <label>
              <input type="checkbox" id={idA} name={idA} onChange={this.props.updateAllergies} defaultChecked={this.props.allergies[idx].isCurrent}/>
              <BoldingLabel displayText={this.props.allergies[idx].name} isBold={this.props.allergies[idx].isCurrent}/>
            </label>
          </div>
          {((idx + halfCount + 1) <= this.props.allergies.length) &&
            <div className="myHealthAllergiesCol">
              <label>
                <input type="checkbox" id={idB} name={idB} onChange={this.props.updateAllergies} defaultChecked={this.props.allergies[idx + halfCount].isCurrent}/>
                <BoldingLabel displayText={this.props.allergies[idx + halfCount].name} isBold={this.props.allergies[idx + halfCount].isCurrent}/>
              </label>
            </div>
          }
        </div>);
    }

    return (
      <div className="myHealthContent">
        <div className="myHealthContentTitle">{this.props.messages.allergies2}</div>
        <div className="myHealthContentDescription">{this.props.messages.are_you_allergic}</div>
        <div className="myHealthAllergiesContent">
          {allergiesMarkup}
        </div>
      </div>
    );
  }
}

MyHealthAllergiesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthAllergiesComponent.defaultProps = {};
export default MyHealthAllergiesComponent;
