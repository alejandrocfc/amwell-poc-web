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
import { Form, FormGroup, Input } from 'reactstrap';

import TytoDeviceWizardScreenType from './TytoDeviceWizardScreenType.model';


import './TytoDeviceSetupWIFIComponent.css';

class TytoDeviceSetupWIFIComponent extends React.Component {
  hidePassword = true;
  constructor(props) {
    super(props);

    this.state = {
      showPasswordText: this.props.messages.amwell_tyto_device_misc_show,
      wifiPasswordInputType: "password",
      wifiPasswordInputValue: this.props.ssidName || '',
      wifiNetworkInputValue: this.props.ssidPwd || ''
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleHideShowPassword() {
    this.hidePassword = !this.hidePassword;
    const showPasswordNewText = this.hidePassword
      ? this.props.messages.amwell_tyto_device_misc_show
      : this.props.messages.amwell_tyto_device_misc_hide;
    this.wifiPasswordInputType = this.hidePassword ? "password" : "text"
    this.setState({ showPasswordText: showPasswordNewText, wifiPasswordInputType: this.hidePassword ? "password" : "text" })
  }

  onWifiNetworkInputChanged(value) {
    this.setState({ wifiNetworkInputValue: value })
  }

  onWifiPasswordInputChanged(value) {
    this.setState({ wifiPasswordInputValue: value })
  }

  onSubmitBtnPress(e) {
    this.props.setUserWiFiNetworkDetails(this.state.wifiNetworkInputValue, this.state.wifiPasswordInputValue);
    this.props.setStepperStep(TytoDeviceWizardScreenType.QRCODE_SCREEN);
  }

  onBackBtnPress(e) {
    this.props.history.goBack()
  }

  render() {
    return (
      <div>
        <p className="deailsText">{this.props.messages.amwell_tyto_device_pairing_setup_provider}</p>
        <Form id="wifisetupForm" onSubmit={e => this.onSubmitPress(e)}>
          <FormGroup>
            <Input type="text" name="ssidName"
              autoComplete="false"
              onChange={e => this.onWifiNetworkInputChanged(e.target.value)}
              placeholder={this.props.messages.amwell_tyto_device_network}
              value={this.state.wifiNetworkInputValue} />
          </FormGroup>
          <FormGroup>
            <Input type={this.state.wifiPasswordInputType} name="ssidPwd"
              autoComplete="false"
              onChange={e => this.onWifiPasswordInputChanged(e.target.value)}
              placeholder={this.props.messages.amwell_tyto_device_password}
              value={this.state.wifiPasswordInputValue} />
            <label
              className="password-label"
              onClick={() => this.handleHideShowPassword()}
            >
              {this.state.showPasswordText}
            </label>
          </FormGroup>
        </Form>
        <p className="disclaimer">{this.props.messages.amwell_tyto_device_pairing_setup_disclaimer}</p>
        <div className="tytoActionButtons">
          <button id="button" className='visitButton' onClick={e => this.onBackBtnPress(e)}>{this.props.messages.back}</button>
          <button id="submit" className='visitButton' onClick={e => this.onSubmitBtnPress(e)}>{this.props.messages.continue}</button>
        </div>
      </div>
    );
  }
}

TytoDeviceSetupWIFIComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  setUserWiFiNetworkDetails: PropTypes.func.isRequired,
  setStepperStep: PropTypes.func.isRequired
};
export default TytoDeviceSetupWIFIComponent;
