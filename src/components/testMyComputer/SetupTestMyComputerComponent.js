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
import { Button } from 'reactstrap';
import FontAwesome from 'react-fontawesome';

import './TestMyComputerComponents.css';

class SetupTestMyComputerComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('StartTestMyComputerComponent: props', props);
    this.state = {
      installHideDetails: true,
      launchHideDetails: true,
    };
  }

  handleLaunchButton() {
    this.props.logger.debug('StartTestMyComputerComponent: launchTestMyComputer');
    this.props.launchTestMyComputer();
  }

  toggleInstallDetails(e) {
    e.preventDefault();
    this.setState(prevState => ({
      installHideDetails: !prevState.installHideDetails,
    }));
  }

  toggleLaunchDetails(e) {
    e.preventDefault();
    this.setState(prevState => ({
      launchHideDetails: !prevState.launchHideDetails,
    }));
  }

  render() {
    const installInstructions = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? this.props.messages.visit_setup_video_step2_instruction_mac : this.props.messages.visit_setup_video_step2_instruction_win;
    const setupVideoInstallImage = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? 'setupVideoInstallImageMac' : 'setupVideoInstallImageWin';

    let installDetails = null;
    if (this.state.installHideDetails) {
      installDetails = <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleInstallDetails(e)}>{this.props.messages.show_details}</button> <FontAwesome name="chevron-down" className="videoDetails" /></div>;
    } else {
      installDetails =
        <div>
          <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleInstallDetails(e)}>{this.props.messages.hide_details}</button> <FontAwesome name="chevron-up" className="videoDetails" /></div>
          <div className={setupVideoInstallImage}></div>
        </div>;
    }

    let launchDetails = null;
    if (this.state.launchHideDetails) {
      launchDetails = <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleLaunchDetails(e)}>{this.props.messages.show_details}</button><FontAwesome name="chevron-down" className="videoDetails" /></div>;
    } else {
      launchDetails =
        <div>
          <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleLaunchDetails(e)}>{this.props.messages.hide_details}</button> <FontAwesome name="chevron-up" className="videoDetails" /></div>
          <div className='setupVideoLaunchImage'></div>
          <div className='setupTestMyComputerLaunchSubtext' dangerouslySetInnerHTML={{ __html: this.props.messages.setup_test_my_computer_step3_subtext }}/>
        </div>;
    }

    return (
      <div id="testMyComputer" className="testMyComputer">
        <div className="testMyComputerBanner"/>
        <div className="testMyComputerSection">
          <div id="testMyComputerHeader" className="testMyComputerHeader">{this.props.messages.test_my_computer_header}</div>
          <div id="setupTestMyComputerBodyIntro" className="setupTestMyComputerBodyIntro">{this.props.messages.setup_test_my_computer_intro}</div>
          <div id="setupTestMyComputerStep1" className="setupTestMyComputerStepSection">
            <div className="setupTestMyComputerStepText">{this.props.messages.setup_test_my_computer_step1}</div>
            <a href={this.props.sdk.testMyComputerService.testMyComputerTelehealthVideoClientInstallUrl} download>
              <Button id="downloadVideoClient" className="downloadButton">{this.props.messages.setup_test_my_computer_download_button}</Button>
            </a>
          </div>
          <div id="setupTestMyComputerStep2" className="setupTestMyComputerStepSection">
            <div className="setupTestMyComputerStepText">{this.props.messages.setup_test_my_computer_step2}</div>
            <div className="setupTestMyComputerSubtext">{installInstructions}</div>
            {installDetails}
          </div>
          <div id="setupTestMyComputerStep3" className="setupTestMyComputerStepSection">
            <div className="setupTestMyComputerStepText">{this.props.messages.setup_test_my_computer_step3}</div>
            <div className="setupTestMyComputerSubtext">{this.props.messages.test_my_computer_subtext}</div>
            <Button id="launchVideoClient" className="launchButton" onClick={e => this.handleLaunchButton(e)}>{this.props.messages.test_my_computer_launch_button}</Button>
            <div className="setupTestMyComputerSubtext">{this.props.messages.setup_test_my_computer_step3_instruction}</div>
            {launchDetails}
          </div>
          <div id="setupVideoNote" className="setupVideoStepSection">
            <div className="setUpTestMyComputerInstallSubtextSmall">{this.props.messages.setup_test_my_computer_note }</div>
            <br/>
            <br/>
          </div>
        </div>
      </div>
    );
  }
}

SetupTestMyComputerComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  launchTestMyComputer: PropTypes.func.isRequired,
};
SetupTestMyComputerComponent.defaultProps = {};
export default SetupTestMyComputerComponent;
