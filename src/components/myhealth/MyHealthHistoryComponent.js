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

class MyHealthHistoryComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthHistoryComponent: props', props);
  }

  render() {
    const conditionsMarkup = [];
    let halfCount = Math.trunc(this.props.conditions.length / 2);
    if (this.props.conditions.length % 2 !== 0) {
      halfCount += 1;
    }
    for (let idx = 0; idx < halfCount; idx += 1) {
      const idA = `conditions${idx}`;
      const idB = `conditions${idx + halfCount}`;
      conditionsMarkup.push(
        <div key={idx} className="myHealthHistoryRow">
          <div className="myHealthHistoryCol">
            <label>
              <input type="checkbox" id={idA} name={idA} onChange={this.props.updateConditions} defaultChecked={this.props.conditions[idx].isCurrent}/>
              <BoldingLabel displayText={this.props.conditions[idx].displayName} isBold={this.props.conditions[idx].isCurrent}/>
            </label>
          </div>
          {((idx + halfCount + 1) <= this.props.conditions.length) &&
            <div className="myHealthHistoryCol">
              <label>
                <input type="checkbox" id={idB} name={idB} onChange={this.props.updateConditions} defaultChecked={this.props.conditions[idx + halfCount].isCurrent}/>
                <BoldingLabel displayText={this.props.conditions[idx + halfCount].displayName} isBold={this.props.conditions[idx + halfCount].isCurrent}/>
              </label>
            </div>
          }
        </div>);
    }

    return (
      <div className="myHealthContent">
        <div className="myHealthContentTitle">{this.props.messages.medical_history2}</div>
        <div className="myHealthContentDescription">{this.props.messages.have_been_diagnosed}</div>
        <div className="myHealthHistoryContent">
          {conditionsMarkup}
        </div>
      </div>
    );
  }
}

MyHealthHistoryComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyHealthHistoryComponent.defaultProps = {};
export default MyHealthHistoryComponent;
