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
import awsdk from 'awsdk';

import './TytoDeviceQRCodeComponent.css';
import TytoDeviceWizardScreenType from './TytoDeviceWizardScreenType.model';

class TytoDeviceQRCodeComponent extends React.Component {
  qrCodeElement;
  qrTimeToLiveTimeout;
  pollingTimeoutId;
  isPaired = false;
  pairedDeviceTimeOut = 10000;
  pollingInterval = 2000;
  MINUTE = 60 * 1000;
  qrTimeToLive = 5 * this.MINUTE;

  constructor(props) {
    super(props);

    this.state = {
      hasQRCode: false
    };
  }

  componentDidMount() {
    this.regenerateQRCode();
  }

  regenerateQRCode() {
    this.props.enableSpinner();
    this.props.sdk.deviceLiveStreamService.appendQRCode(
      this.props.consumer, {
      type: awsdk.AWSDKDeviceIntegrationMode.TYTO_LIVESTREAM,
      container: this.qrCodeElement,
      SSID: this.props.ssId,
      SSIDPassword: this.props.ssIdPwd,
    }).then((response) => {
      if (response) this.setState({ hasQRCode: true });
      this.qrTimeToLiveTimeout = setTimeout(() => {
        clearTimeout(this.qrTimeToLiveTimeout);
        if (!this.isPaired) {
          this.props.setStepperStep(TytoDeviceWizardScreenType.REGENERATE_QRCODE);
        }
      }, this.qrTimeToLive);
    }).catch((error) => {
      this.props.logger.info('Something went wrong:', error);
      this.displayErrorScreenBasedOnErrorCounter();
    }).finally(() => {
      this.props.disableSpinner();
    });
  }

  componentWillUnmount() {
    this.clearAllTimeout();
  }

  pollDevicePairingStatus(interval, timeout) {
    const endTime = new Date().getTime() + timeout;
    this.props.enableSpinner();
    const checkCondition = (resolve, reject) => {
      this.props.sdk.deviceLiveStreamService.getDevicePairingStatus(this.props.consumer, awsdk.AWSDKDeviceLiveStreamType.TYTO_LIVESTREAM)
        .then((response) => {
          if (response.devicePairingStatus.toString() === awsdk.AWSDKDevicePairingStatusEnum.PAIRED && response.isDeviceOnline) {
            this.isPaired = true;
            this.props.setStepperStep(TytoDeviceWizardScreenType.DEVICE_PAIRED);
            this.props.setTytoDevicePairedStatus(true);
            this.clearAllTimeout();
            Promise.resolve(resolve);
          } else if (new Date().getTime() < endTime && response.devicePairingStatus.toString() === awsdk.AWSDKDevicePairingStatusEnum.PAIRED) {
            this.pollingTimeoutId = setTimeout(checkCondition, interval, reject);
          } else {
            this.clearAllTimeout();
            this.props.setStepperStep(TytoDeviceWizardScreenType.PAIRING_ERROR);
          }
        }).catch(() => {
          this.displayErrorScreenBasedOnErrorCounter();
          Promise.reject("error");
        }).finally(() => {
          this.props.disableSpinner();
        });
    };
    return new Promise(checkCondition);
  }

  clearAllTimeout() {
    clearTimeout(this.pollingTimeoutId);
    clearTimeout(this.qrTimeToLiveTimeout);
  }

  displayErrorScreenBasedOnErrorCounter() {
    this.clearAllTimeout();
    this.props.handleShowTytoDeviceErrorPage();
  }

  onContinuePress() {
    this.pollDevicePairingStatus(this.pollingInterval, this.pairedDeviceTimeOut);
  }

  onBackPress() {
    this.props.setStepperStep(TytoDeviceWizardScreenType.SETUP_DEVICE);
  }

  render() {
    return (
      <div className="tytoDeviceQRComponent">
        {this.state.hasQRCode && (
          <p className="deailsText">
            {this.props.messages.amwell_tyto_device_qrCodePageDesc}
          </p>
        )}
        <div className="QRCodeImg" ref={(el) => (this.qrCodeElement = el)}></div>
        {this.state.hasQRCode && (
          <div>
            <div className="tytoActionButtons">
              <button className='visitButton' onClick={e => this.onBackPress(e)}>{this.props.messages.back}</button>
              <button className='visitButton' onClick={e => this.onContinuePress(e)}>{this.props.messages.continue}</button>
            </div>
            <button className="link-like" onClick={e => this.props.handleSkipSetup(e)}>{this.props.messages.amwell_tyto_device_skip_setup}</button>
          </div>)}
      </div>
    );
  }
}

TytoDeviceQRCodeComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  sdk: PropTypes.any.isRequired,
  consumer: PropTypes.any.isRequired,
  handleShowTytoDeviceErrorPage: PropTypes.func.isRequired,
  setStepperStep: PropTypes.func.isRequired,
  handleSkipSetup: PropTypes.func.isRequired
};
export default TytoDeviceQRCodeComponent;
