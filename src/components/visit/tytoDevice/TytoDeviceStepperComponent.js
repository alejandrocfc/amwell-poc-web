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

import './TytoDeviceStepperComponent.css';
import TytoDeviceWizardScreenType from './TytoDeviceWizardScreenType.model';
import TytoDeviceSetupWIFIComponent from './TytoDeviceSetupWIFIComponent';
import TytoDeviceQRCodeComponent from './TytoDeviceQRCodeComponent';
import TytoDeviceModal from './TytoDeviceActionModal';
import TytoDeviceGenericStep from './TytoDeviceGenericStep';


class TytoStepperComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showDevicePairingFailureModal: false,
      showQRExpiredModal: false,
      currentStep: TytoDeviceWizardScreenType.SETUP_DEVICE,
      ssId: '',
      ssIdPwd: ''
    };

    this.tytoQRcodeComponents = React.createRef();
    this.showServicesUnavailablePage = false;
    this.setStepperStep = this.setStepperStep.bind(this);
    this.setUserWiFiNetworkDetails = this.setUserWiFiNetworkDetails.bind(this);
    this.handleShowTytoDeviceErrorPage = this.handleShowTytoDeviceErrorPage.bind(this);
    this.handleRegenerateQRCode = this.handleRegenerateQRCode.bind(this);
    this.handleTryAgain = this.handleTryAgain.bind(this);
    this.returnToVisitIntake = this.returnToVisitIntake.bind(this);
  }

  setStepperStep(requiredStep) {
    switch (requiredStep) {
      case TytoDeviceWizardScreenType.REGENERATE_QRCODE: {
        this.setState({ showQRExpiredModal: true, showDevicePairingFailureModal: false });
        break;
      }
      case TytoDeviceWizardScreenType.PAIRING_ERROR: {
        this.setState({ showQRExpiredModal: false, showDevicePairingFailureModal: true });
        break;
      }
      default: {
        this.setState({ showQRExpiredModal: false, showDevicePairingFailureModal: false });
        this.setState({ currentStep: requiredStep });
      }
    }
  }

  setUserWiFiNetworkDetails(ssId, ssIdPwd) {
    this.setState({ ssId, ssIdPwd })
  }

  handleShowTytoDeviceErrorPage() {
    if (!this.showServicesUnavailablePage) {
      this.showServicesUnavailablePage = !this.showServicesUnavailablePage;
      this.setStepperStep(TytoDeviceWizardScreenType.TRY_AGAIN);
    } else {
      this.setStepperStep(TytoDeviceWizardScreenType.SERVICE_UNAVAILABLE);
    }
  }

  handleRegenerateQRCode() {
    this.setStepperStep(TytoDeviceWizardScreenType.QRCODE_SCREEN);
    this.tytoQRcodeComponents.regenerateQRCode();
  }

  handleTryAgain() {
    this.setStepperStep(TytoDeviceWizardScreenType.SETUP_DEVICE);
  }

  returnToVisitIntake() {
    this.props.history.replace('/visit/intake/start');
  }

  toggleQRExpiredModal() {
    this.setState(prevState => ({
      showQRExpiredModal: !prevState.showQRExpiredModal,
    }));
  }

  toggleDevicePairingFailureModal() {
    this.setState(prevState => ({
      showDevicePairingFailureModal: !prevState.showDevicePairingFailureModal,
    }));
  }

  render() {
    const currentStep = this.state.currentStep;

    const steps = () => {
      switch (currentStep) {
        case TytoDeviceWizardScreenType.SETUP_DEVICE:
          return <TytoDeviceSetupWIFIComponent
            {...this.props}
            setStepperStep={this.setStepperStep}
            setUserWiFiNetworkDetails={this.setUserWiFiNetworkDetails}
          />
        case TytoDeviceWizardScreenType.QRCODE_SCREEN:
          return (
            <TytoDeviceQRCodeComponent
              {...this.props}
              setStepperStep={this.setStepperStep}
              handleSkipSetup={this.returnToVisitIntake}
              handleShowTytoDeviceErrorPage={this.handleShowTytoDeviceErrorPage}
              ssId={this.state.ssId}
              ssIdPwd={this.state.ssIdPwd}
              ref={(el) => (this.tytoQRcodeComponents = el)}
              sdk={this.props.sdk}
              consumer={this.props.consumer}
            />
          );
        case TytoDeviceWizardScreenType.DEVICE_PAIRED:
          return (
            <TytoDeviceGenericStep
              {...this.props}
              bodyTextFirstPart={this.props.messages.amwell_tyto_device_devicePaired}
              icon={"devicePaired"}
              mainActionBtnText={this.props.messages.amwell_tyto_device_misc_continue.toUpperCase()}
              onMainModalActionBtnPress={this.returnToVisitIntake}
              hasSecondActionBtn={false}
            />
          );
        case TytoDeviceWizardScreenType.TRY_AGAIN:
          return (
            <TytoDeviceGenericStep
              {...this.props}
              bodyTextFirstPart={this.props.messages.amwell_tyto_device_server_down}
              icon={"deviceFailed"}
              mainActionBtnText={this.props.messages.amwell_tyto_device_skip_setup.toUpperCase()}
              onMainModalActionBtnPress={this.returnToVisitIntake}
              hasSecondActionBtn={true}
              secondActionBtnText={this.props.messages.amwell_tyto_device_try_again}
              onSecondModalActionBtnPress={this.handleTryAgain}
            />
          );
        case TytoDeviceWizardScreenType.SERVICE_UNAVAILABLE:
          return (
            <TytoDeviceGenericStep
              {...this.props}
              bodyTextFirstPart={this.props.messages.amwell_tyto_device_connection_unavailable}
              bodyTextSecondPart={this.props.messages.amwell_tyto_device_trouble_connecting}
              icon={"deviceFailed"}
              mainActionBtnText={this.props.messages.amwell_tyto_device_skip_setup.toUpperCase()}
              onMainModalActionBtnPress={this.returnToVisitIntake}
              hasSecondActionBtn={false}
            />
          );
        default:
          return <TytoDeviceSetupWIFIComponent
            {...this.props}
            setStepperStep={this.setStepperStep}
            setUserWiFiNetworkDetails={this.setUserWiFiNetworkDetails}
          />
      }
    };
    return (
      <div className="tytoDeviceIntegration">

        <TytoDeviceModal
          {...this.props}
          isOpen={this.state.showQRExpiredModal}
          toggle={this.toggleQRExpiredModal.bind(this)}
          modalHeaderText={this.props.messages.amwell_tyto_device_qr_expired}
          modalBodyClassName="qrCodeExpired"
          modalBodyText={this.props.messages.amwell_tyto_device_regenerate}
          mainActionBtnText={this.props.messages.amwell_tyto_device_generate_new_qrcode}
          onMainModalActionBtnPress={this.handleRegenerateQRCode}
          showSkipStepActionBtn={false}
          showSupportLink={false}
        />

        <TytoDeviceModal
          {...this.props}
          isOpen={this.state.showDevicePairingFailureModal}
          toggle={this.toggleDevicePairingFailureModal.bind(this)}
          modalHeaderText={this.props.messages.amwell_tyto_device_please_try_again}
          modalBodyClassName="tryAgain"
          modalBodyText={this.props.messages.amwell_tyto_device_pairing_failure}
          mainActionBtnText={this.props.messages.amwell_tyto_device_try_again}
          onMainModalActionBtnPress={this.handleTryAgain}
          showSkipStepActionBtn={true}
          onSkipSetupActionBtnPress={this.returnToVisitIntake}
          showSupportLink={true}
          secondModalActionBtnText={this.props.messages.amwell_tyto_device_skip_setup}
        />
        {steps()}
      </div>
    );
  }
}

TytoStepperComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  history: PropTypes.any.isRequired
};
TytoStepperComponent.defaultProps = {};
export default TytoStepperComponent;
