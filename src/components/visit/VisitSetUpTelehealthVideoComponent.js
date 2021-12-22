/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2017 American Well.
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

import VideoLaunchIcon from './images/iconVideoLaunch.png';
import './VisitComponents.css';

class VisitSetUpTelehealthVideoComponent extends React.Component {
  constructor(props) {
    super(props);
    this.logger = props.logger;
    this.logger.debug('VisitSetUpTelehealthVideoComponent: props', props);
    this.messages = props.messages;
    this.launchTelehealthVideo = props.launchTelehealthVideo;
    this.telehealthVideoInstallUrl = props.telehealthVideoInstallUrl;
    this.cancelVisit = props.cancelVisit;
    this.state = {
      telehealthVideoLaunched: props.telehealthVideoLaunched,
      installHideDetails: true,
      launchHideDetails: true,
    };
  }


  UNSAFE_componentWillReceiveProps(nextProps) {
    this.logger.debug('VisitSetUpTelehealthVideoComponent: nextProps', nextProps);
    this.setState({
      telehealthVideoLaunched: nextProps.telehealthVideoLaunched,
    });
  }

  handleLaunchButton() {
    this.logger.debug('VisitSetUpTelehealthVideoComponent: launchTelehealthVideo');
    this.launchTelehealthVideo();
  }

  toggleInstallDetails(e) {
    e.preventDefault();
    this.setState({
      installHideDetails: !this.state.installHideDetails,
    });
  }

  toggleLaunchDetails(e) {
    e.preventDefault();
    this.setState({
      launchHideDetails: !this.state.launchHideDetails,
    });
  }

  cancelClicked(e) {
    e.preventDefault();
    this.cancelVisit(this.visit);
  }

  havingTrouble(e) {
    e.preventDefault();
    this.setState({
      telehealthVideoLaunched: false,
    });
  }

  render() {
    if (this.state.telehealthVideoLaunched !== false) {
      return (
        <div className="startVideoSection">
          <div id="visitBodyIntro" className="visitBodyIntro">{this.messages.visit_start_video_waiting}</div>
          <div className="setupVideoLoading">
            <div className='setupVideoLoadingImage'>
              <img alt="" src={VideoLaunchIcon}/>
            </div>
          </div>
          <div className="startVideoStepText">{this.messages.visit_start_video_having_trouble}
            <button className="link-like" onClick={e => this.havingTrouble(e)}>{this.messages.visit_start_video_trouble_link}</button>
          </div>
          <div id="visitSetupCancelRequest" className="visitCancelRequest"><button className="link-like" onClick={e => this.cancelClicked(e)}>{this.messages.visit_cancel}</button></div>
        </div>
      );
    }
    const installInstructions = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? this.messages.visit_setup_video_step2_instruction_mac : this.messages.visit_setup_video_step2_instruction_win;
    const setupVideoInstallImage = (navigator.platform.toUpperCase().indexOf('MAC') >= 0) ? 'setupVideoInstallImageMac' : 'setupVideoInstallImageWin';

    let installDetails = null;
    if (this.state.installHideDetails) {
      installDetails = <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleInstallDetails(e)}>{this.messages.show_details}</button> <FontAwesome name="chevron-down" className="videoDetails" /></div>;
    } else {
      installDetails =
        <div>
          <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleInstallDetails(e)}>{this.messages.hide_details}</button> <FontAwesome name="chevron-up" className="videoDetails" /></div>
          <div className={setupVideoInstallImage}></div>
        </div>;
    }

    let launchDetails = null;
    if (this.state.launchHideDetails) {
      launchDetails = <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleLaunchDetails(e)}>{this.messages.show_details}</button> <FontAwesome name="chevron-down" className="videoDetails" /></div>;
    } else {
      launchDetails =
        <div>
          <div className='toggleDetails'><button className="link-like" onClick={e => this.toggleLaunchDetails(e)}>{this.messages.hide_details}</button> <FontAwesome name="chevron-up" className="videoDetails" /></div>
          <div className='setupVideoLaunchImage'></div>
        </div>;
    }

    return (
      <div className="setupVideoSection">
        <div id="visitBodyIntro" className="visitBodyIntro">{this.messages.visit_setup_video_intro}</div>
        <div id="setupVideoStep1" className="setupVideoStepSection">
          <div className="setUpVideoStepText">{this.messages.visit_setup_video_step1}</div>
          <a href={this.telehealthVideoInstallUrl} download>
            <Button id="downloadVideoClient" className="downloadButton">{this.messages.visit_setup_video_download_button}</Button>
          </a>
          <br/>
        </div>
        <div id="setupVideoStep2" className="setupVideoStepSection">
          <div className="setUpVideoStepText">{this.messages.visit_setup_video_step2}</div>
          <br/>
          <br/>
          <div className="setUpVideoInstallSubtext">{installInstructions}</div>
          {installDetails}
        </div>
        <div id="setupVideoStep3" className="setupVideoStepSection">
          <div className="setUpVideoStepText">{this.messages.visit_setup_video_step3}</div>
          <Button id="launchVideoClient" className="launchButton" onClick={e => this.handleLaunchButton(e)}>{this.messages.visit_setup_video_launch_button}</Button>
          <br/>
          <br/>
          <span className="setUpVideoLaunchSubtext">{this.messages.visit_setup_video_step3_instruction}</span>
          {launchDetails}
        </div>
        <div id="setupVideoNote" className="setupVideoStepSection">
          <div className="setUpVideoInstallSubtextSmall">{this.messages.visit_setup_video_note}</div>
          <br/>
          <br/>
        </div>
        <div className="visitCancel" ><Button className="visitCancelRequestButton" onClick={e => this.cancelClicked(e)}>{this.messages.visit_payment_method_cancel}</Button></div>
      </div>
    );
  }
}

VisitSetUpTelehealthVideoComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  telehealthVideoInstallUrl: PropTypes.string.isRequired,
  launchTelehealthVideo: PropTypes.func.isRequired,
};
VisitSetUpTelehealthVideoComponent.defaultProps = {};
export default VisitSetUpTelehealthVideoComponent;
