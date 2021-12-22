/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2087 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import TestMyComputerStatusComponent from './TestMyComputerStatusComponent';
import './TestMyComputerComponents.css';

class TestMyComputerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('TestMyComputerComponent: props', props);
  }

  handleLaunchButton() {
    this.props.logger.debug('TestMyComputerComponent: launchTestMyComputer');
    this.props.launchTestMyComputer();
  }

  handleTestDone() {
    this.props.logger.debug('TestMyComputerComponent: testDone');
    this.props.history.replace('/');
  }

  render() {
    const properties = {
      handleLaunchButton: this.handleLaunchButton.bind(this),
      handleTestDone: this.handleTestDone.bind(this),
    };
    return (
      <div id="testMyComputer" className="testMyComputer">
        <div className="testMyComputerBanner"/>
        <div className="testMyComputerSection">
          <div id="testMyComputerHeader" className="testMyComputerHeader">{this.props.messages.test_my_computer_header}</div>
          <div id="testMyComputerLaunchSection" className="testMyComputerLaunchSection">
            {this.props.appointmentReadiness ?
              <TestMyComputerStatusComponent {...properties} {...this.props} />
              :
              <TechCheckDefaultComponent handler={this.handleLaunchButton.bind(this)} messages={this.props.messages} />
            }
          </div>
        </div>
      </div>
    );
  }
}

const TechCheckDefaultComponent = ({ handler, messages }) =>
  (
    <div>
      <div className="testMyComputerLaunchText">{messages.test_my_computer_text}</div>
      <Button id="launchTestMyComputer" className="launchButton" onClick={e => handler(e)}>{messages.test_my_computer_launch_button}</Button>
    </div>
  );

TestMyComputerComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  launchTestMyComputer: PropTypes.func.isRequired,
};
TestMyComputerComponent.defaultProps = {};
export default TestMyComputerComponent;
