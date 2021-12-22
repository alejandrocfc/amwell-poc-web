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
import awsdk from 'awsdk';
import PropTypes from 'prop-types';
import React from 'react';
import classNames from 'classnames';

import SetupTestMyComputer from '../components/testMyComputer/SetupTestMyComputerComponent';
import TestMyComputer from '../components/testMyComputer/TestMyComputerComponent';
import TestMyComputerWizard from '../components/testMyComputer/TestMyComputerWizard';

class TestMyComputerContainer extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('TestMyComputerContainer: props', props);
    this.exitTestMyComputer = this.exitTestMyComputer.bind(this);
    this.launchTestMyComputer = this.launchTestMyComputer.bind(this);
    this.toggleDetailsView = this.toggleDetailsView.bind(this);
    this.appointmentReadinessEnabled = this.props.sdk.getSystemConfiguration().appointmentReadinessEnabled;
    this.tmcRef = React.createRef();
    this.state = {
      testMyComputerLaunched: null,
      appointmentReadiness: null,
      isDetailsViewOn: false,
      browserSupportsWebRTC: awsdk.utils.WebRTCHelper.isWebRTCSupported(),
    };
  }

  componentDidMount() {
    this.getAppointmentReadinessIfLogged();
  }

  getAppointmentReadinessIfLogged() {
    if (this.props.activeConsumer && this.appointmentReadinessEnabled) {
      this.getAppointmentReadiness();
    }
  }

  getAppointmentReadiness() {
    this.props.sdk.appointmentService.getAppointmentReadiness(this.props.activeConsumer)
      .then((appointmentReadiness) => {
        this.props.logger.info('Found appointment readiness: ', appointmentReadiness);
        this.setState({ appointmentReadiness });
      })
      .catch((error) => {
        this.props.logger.error('Failed to fetch appointment readiness for consumer', this.props.activeConsumer);
        this.props.showErrorModal(error.message);
      });
  }

  componentWillUnmount() {
    this.exitTestMyComputer();
  }

  launchTestMyComputer() {
    if (this.state.browserSupportsWebRTC) {
      const config = {
        locale: this.props.locale,
        container: this.tmcRef.current,
        doneCallback: () => {
          this.exitTestMyComputer();
        },
        consumer: this.props.activeConsumer,
      };

      this.wizard = this.props.sdk.testMyComputerService.getTestMyComputerWizard(config);

      this.wizard.start();
      this.setState({ testMyComputerLaunched: true });
      this.props.setIsSimpleHeader(true);
    } else {
      this.props.sdk.testMyComputerService.launchTestMyComputerTelehealthVideoClient(this.props.activeConsumer)
        .then((testMyComputerLaunched) => {
          if (this.state.testMyComputerLaunched === null) {
            this.setState({ testMyComputerLaunched });
          }
        })
        .catch((error) => {
          this.props.showErrorModal(error.message);
        });
    }
  }

  exitTestMyComputer(e) {
    if (e) {
      e.preventDefault();
    }
    if (this.wizard) {
      this.wizard.stop();
    }
    // update the appointment readiness, if possible
    this.getAppointmentReadinessIfLogged();
    this.setState({ testMyComputerLaunched: false });
    this.props.setIsSimpleHeader(false);
  }

  toggleDetailsView() {
    this.setState(prevState => ({
      isDetailsViewOn: !prevState.isDetailsViewOn,
    }));
  }

  render() {
    const properties = {
      tmcRef: this.tmcRef,
      launchTestMyComputer: this.launchTestMyComputer,
      appointmentReadiness: this.state.appointmentReadiness,
      isDetailsViewOn: this.state.isDetailsViewOn,
      toggleDetailsView: this.toggleDetailsView,
      exitTestMyComputer: this.exitTestMyComputer,
    };

    // we only show setup if the browser doesn't support webrtc so the user can download the client
    // or if the launched flag is false which is only possible when the client tried to launch but return false (meaning it wasn't installed)
    const showSetup = !this.state.browserSupportsWebRTC && (this.state.testMyComputerLaunched === false);

    // when browser supports webrtc we show the start button whenever the test isn't running,
    // otherwise we show it only when we know for sure the client didn't launch
    const showStart = (!this.state.browserSupportsWebRTC && this.state.testMyComputerLaunched !== false)
                  || (this.state.browserSupportsWebRTC && !this.state.testMyComputerLaunched);

    return (
      <div>
        {showStart &&
        <TestMyComputer key="TestMyComputer" {...properties} {...this.props} />}
        <div className={classNames({ testMyComputerWizardHidden: !this.state.browserSupportsWebRTC || !this.state.testMyComputerLaunched })}>
          <TestMyComputerWizard {...properties} {...this.props}/>
        </div>
        {showSetup &&
        <SetupTestMyComputer key="SetupTestMyComputer" {...properties} {...this.props} />}
      </div>
    );
  }
}

TestMyComputerContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
};
TestMyComputerContainer.defaultProps = {};
export default TestMyComputerContainer;
