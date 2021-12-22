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
import PropTypes from 'prop-types';
import { Row, Col } from 'reactstrap';
import './MyHealthComponent.css';

class MyHealthMeasurementsComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyHealthMeasurementsComponent: props', props);
  }

  getGrid(array, maxColNumber) {
    const grid = [];
    let rowIndex = 0;
    let columns = [];
    array.forEach((item, colIndex) => {
      columns.push(
        <Col key={colIndex} onClick={e => this.props.onTrackerTemplateClicked(e, item) }>
          <span className="myHealthLink">{item.title}</span>
        </Col>);
      if (((colIndex + 1) % maxColNumber) === 0) {
        rowIndex += 1;
        grid.push(<Row key={rowIndex} className="tracker-template-grid-row">{columns}</Row>);
        columns = [];
      }
    });
    return grid;
  }

  render() {
    const trackerTemplateGrid = this.getGrid(this.props.trackerTemplates, 3);
    return (
      <div className="myHealthContent">
        <div className="myHealthContentTitle">{this.props.messages.my_health_measurements_header}</div>
        <div className="myHealthContentDescription">{this.props.messages.my_health_measurements_description}</div>
        <div className="myHealthMeasurementsContent">
          <div className='measurementTrackers'>
            <div>{this.props.messages.my_health_measurements_trackers}</div>
            <div>{trackerTemplateGrid}</div>
          </div>
        </div>
      </div>
    );
  }
}

MyHealthMeasurementsComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  trackerTemplates: PropTypes.array.isRequired,
  onTrackerTemplateClicked: PropTypes.func.isRequired,
};
MyHealthMeasurementsComponent.defaultProps = {};
export default MyHealthMeasurementsComponent;
