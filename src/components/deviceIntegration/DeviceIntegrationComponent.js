/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import awsdk from 'awsdk';
import { TextInput } from '../form/Inputs';
import './DeviceIntegrationComponent.css';

class DeviceIntegrationComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.info('DeviceIntegrationComponent: props', props);
    this.qrCodeWrapperRef = React.createRef();
    this.state = {
      devicePairingStatus: "",
      isDeviceOnline: false,
      showDeviceStatus: false,
      onlineColor: "",
      pairingColor: ""
    };
  }

  getDeviceStatus(e) {
    if (e) e.preventDefault();
    this.setState({
      showDeviceStatus: false
    });
    this.props.getDevicePairingStatus(e).then((res) => {
      this.setState({
        devicePairingStatus: res.devicePairingStatus,
        isDeviceOnline: res.isDeviceOnline,
        statusShow: true
      }, () => {
        this.setColors();
      });
    });
  }

  setColors() {
    switch (this.state.devicePairingStatus) {
      case awsdk.AWSDKDevicePairingStatusEnum.PAIRED:
        this.setState({
          pairingColor: 'paintGreen'
        });
        break;
      case awsdk.AWSDKDevicePairingStatusEnum.PREVIOUSLY_PAIRED:
        this.setState({
          pairingColor: 'paintYellow'
        });
        break;
      default:
        this.setState({
          pairingColor: 'paintRed'
        });
    }

    this.setState({
      onlineColor: this.state.isDeviceOnline ? 'paintGreen' : 'paintRed'
    });

  }

  render() {
    return (
      <div className="visitIntakeSection visitIntakeHealthSummary">
        <div>{this.props.messages.visit_intake_device_integration_tytoLS_title}</div>
        <span>{this.props.messages.visit_intake_device_integration_tytoLS_addWifiPassword}</span>
        <TextInput name="ssid" valueLink={this.props.valueLinks.ssidName} placeholder={this.props.messages.visit_intake_device_integration_tytoLS_WIFI}>{this.props.messages.visit_intake_device_integration_SSIDName}</TextInput>
        <TextInput name="ssidPwd" valueLink={this.props.valueLinks.ssidPwd} placeholder={this.props.messages.visit_intake_device_integration_tytoLS_Password}>{this.props.messages.visit_intake_device_integration_SSIDPassword}</TextInput>
        <div className='buttons'>
          <button className="visitIntakeDeviceIntegrationBtn" onClick={(e) => this.props.appendQRCode(e, this.qrCodeWrapperRef.current)}>{this.props.messages.visit_intake_device_integration_tytoLS_generateQR}</button>
          <button className="visitIntakeDeviceIntegrationBtn" onClick={(e) => this.getDeviceStatus(e)}>{this.props.messages.visit_intake_device_integration_tytoLS_check_status}</button>
        </div>
        <div className='qrcodeStatusContainer'>
          {this.state.statusShow && <div className="devicePairingStatusWrapper">
            <div>
              <span>{this.props.messages.visit_intake_device_integration_tytoLS_isPaired}</span>
              <span className={this.state.pairingColor}>{this.state.devicePairingStatus}</span>
            </div>
            <br />
            <div>
              <span>{this.props.messages.visit_intake_device_integration_tytoLS_isOnline}</span>
              <span className={this.state.onlineColor}>{this.state.isDeviceOnline.toString()}</span>
            </div>
          </div>}
          <div className="qrCodeWrapper" ref={this.qrCodeWrapperRef} />
        </div>
      </div>
    );
  }
}
export default DeviceIntegrationComponent;
