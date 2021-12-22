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
import PropTypes from 'prop-types';

import DeviceIcon from './images/device-icon.png';
import DevicePairedIcon from './images/device-paired.png';
import './DeviceIntegrationComponent.css';

const devicePaired = (props) => {
  return (
    <React.Fragment>
      <div className="tytoDeviceDetails">
        <img className="devicePaired" alt={props.messages.visit_intake_invite_integration_tyto_label} src={DevicePairedIcon} />
        <p>
          {props.messages.amwell_tyto_device_devicePaired}
          <button className="link-like" onClick={props.changeUserWiFiNetwork}>{props.messages.amwell_tyto_device_pairDifferentNetwork}</button>
        </p>
      </div>
    </React.Fragment>
  )
}

const deviceNotPaired = (props) => {
  return (
    <div>
      <div className="tytoDeviceDetails">
        <img alt={props.messages.visit_intake_invite_integration_tyto_label} src={DeviceIcon} />
        <p>
          {props.messages.visit_intake_invite_integration_tyto_details}
        </p>
      </div>
      <p>{props.messages.visit_intake_invite_integration_useTytoInVisitQuestion}</p>
      <div>
        <label>
          <input className="radio" checked={props.useTytoDeviceDuringVisit} value="useTytoDeviceYes" onChange={() => props.setUseTytoDeviceDuringVisit(true)} type="radio" />
          {props.messages.yes}
        </label>
        <label>
          <input className="radio" checked={!props.useTytoDeviceDuringVisit} value="useTytoDeviceNo" onChange={() => props.setUseTytoDeviceDuringVisit(false)} type="radio" />
          {props.messages.no}
        </label>
      </div>
    </div>
  );
}

const TytoDeviceIntegration = (props) => {
  return (
    <div className="visitIntakeSection visitIntakeTytoDevice">
      <div>{props.messages.visit_intake_invite_integration_tyto_label}</div>
      {(props.isTytoDevicePaired) && devicePaired(props)}
      {!props.isTytoDevicePaired && deviceNotPaired(props)}
    </div>
  );
};

TytoDeviceIntegration.propTypes = {
  messages: PropTypes.any.isRequired,
  setUseTytoDeviceDuringVisit: PropTypes.func.isRequired,
  useTytoDeviceDuringVisit: PropTypes.bool.isRequired,
  isTytoDevicePaired: PropTypes.bool.isRequired,
  changeUserWiFiNetwork: PropTypes.func.isRequired
};
TytoDeviceIntegration.defaultProps = {};
export default TytoDeviceIntegration;
