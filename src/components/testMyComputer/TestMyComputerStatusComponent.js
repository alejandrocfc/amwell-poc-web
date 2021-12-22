/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2019 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */
import React from 'react';
import { Button } from 'reactstrap';
import { FormattedDate } from 'react-intl';
import classNames from 'classnames';
import './TestMyComputerComponents.css';


class TestMyComputerStatusComponent extends React.Component {
  toggleDetailsView() {
    this.props.toggleDetailsView();
  }
  render() {
    return (
      <div className='testMyComputerStatusWrapper' id='testMyComputerStatusWrapper'>
        {!this.props.appointmentReadiness.techCheckPassed &&
        <TestMyComputerFailedComponent
          appointmentReadiness={this.props.appointmentReadiness}
          handler={this.props.handleLaunchButton}
          messages={this.props.messages}
          isDetailsViewOn={this.props.isDetailsViewOn}
          toggleHandler={this.toggleDetailsView.bind(this)}
        />
        }
        {this.props.appointmentReadiness.techCheckPassed &&
        <TestMyComputerPassedComponent
          appointmentReadiness={this.props.appointmentReadiness}
          handler={this.props.handleTestDone}
          messages={this.props.messages}
          isDetailsViewOn={this.props.isDetailsViewOn}
          toggleHandler={this.toggleDetailsView.bind(this)}
        />
        }
      </div>
    );
  }
}
function buildDeviceInfoBag(messages, appointmentReadiness) {
  const device1Value = appointmentReadiness.platformType && appointmentReadiness.platformType.localizedDisplayName;
  return {
    device1: { name: messages.test_my_computer_platform, value: device1Value },
    device2: { name: messages.test_my_computer_camera_device_name, value: appointmentReadiness.cameraDeviceName },
    device3: { name: messages.test_my_computer_speaker_device_name, value: appointmentReadiness.speakerDeviceName },
    device4: { name: messages.test_my_computer_microphone_device_name, value: appointmentReadiness.microphoneDeviceName },
  };
}
function buildMetricInfoBag(messages, appointmentReadiness) {
  const metric5Value = appointmentReadiness.platformVersion;
  return {
    metric1: { name: messages.test_my_computer_download_speed, value: `${appointmentReadiness.downloadSpeedMbps} Mbps` },
    metric2: { name: messages.test_my_computer_upload_speed, value: `${appointmentReadiness.uploadSpeedMbps} Mbps` },
    metric3: { name: messages.test_my_computer_latency, value: `${appointmentReadiness.latencyMs} ms` },
    metric4: { name: messages.test_my_computer_jitter, value: `${appointmentReadiness.jitter} ms` },
    metric5: { name: messages.test_my_computer_telehealth_video_version, value: metric5Value },
  };
}
const TestMyComputerFailedComponent = ({ handler, messages, appointmentReadiness, isDetailsViewOn, toggleHandler }) =>
  (
    <div>
      <div className='testMyComputerNotReadyIcon statusIcon' />
      <div className='testMyComputerNotReady'>{messages.test_my_computer_uh_oh}</div>
      <div className="testMyComputerNotReadyText">{messages.test_my_computer_not_ready}</div>
      <div className="testMyComputerGetReadyText">{messages.test_my_computer_get_ready}</div>
      {appointmentReadiness.telehealthPlatformType &&
        <TestMyComputerDetailsComponent
          messages={messages}
          appointmentReadiness={appointmentReadiness}
          isDetailsViewOn={isDetailsViewOn}
          toggleHandler={toggleHandler}
        />
      }
      <Button id="launchTestMyComputer" className="launchButton" onClick={e => handler(e)}>{messages.test_my_computer_launch_button}</Button>
    </div>
  );

const TestMyComputerPassedComponent = ({ handler, messages, appointmentReadiness, isDetailsViewOn, toggleHandler }) =>
  (
    <div>
      <div className='testMyComputerAllSetIcon statusIcon' />
      <div className='testMyComputerAllSet'>{messages.test_my_computer_all_set}</div>
      <div className="testMyComputerAllSetText">{messages.test_my_computer_all_set_subtext}</div>
      {appointmentReadiness.telehealthPlatformType &&
        <TestMyComputerDetailsComponent
          messages={messages}
          appointmentReadiness={appointmentReadiness}
          isDetailsViewOn={isDetailsViewOn}
          toggleHandler={toggleHandler}
        />
      }
      <Button id='testMyComputerDone' className='testDone' onClick={e => handler(e)}>{messages.test_my_computer_done}</Button>
    </div>
  );

const TestMyComputerDetailsComponent = ({ messages, appointmentReadiness, isDetailsViewOn, toggleHandler }) => {
  const detailMessage = isDetailsViewOn ? messages.hide_details : messages.show_details;
  let platformInfo = appointmentReadiness.platformType && appointmentReadiness.platformType.localizedDisplayName;
  const datePassed = appointmentReadiness.datePassedTechCheck || new Date(Date.now());
  platformInfo = `${platformInfo} - ${messages.test_my_computer_last_test}`;
  return (
    <div className='testMyComputerDetails'>
      <div className='testMyComputerDetailsHeader'>
        <span className='testMyComputerPlatformType'>{platformInfo}</span><FormattedDate className='testMyComputerPlatformType' value={datePassed} day='2-digit' month='2-digit' year='2-digit' />|<span className='testMyComputerRevealDetails' onClick={e => toggleHandler(e)}>{detailMessage}</span>
      </div>
      {isDetailsViewOn &&
        <TestMyComputerDetailsBoxComponent
          messages={messages}
          appointmentReadiness={appointmentReadiness}
        />
      }
    </div>
  );
};

const TestMyComputerDetailsBoxComponent = ({ messages, appointmentReadiness }) => {
  const deviceInfoBag = buildDeviceInfoBag(messages, appointmentReadiness);
  const metricInfoBag = buildMetricInfoBag(messages, appointmentReadiness);
  return (
    <div className='testMyComputerDetailsBox'>
      <TestMyComputerDeviceStatusComponent
        testDescription={messages.test_my_computer_camera}
        testTypePassed={appointmentReadiness.cameraPassed}
      />
      <TestMyComputerDeviceStatusComponent
        testDescription={messages.test_my_computer_speaker}
        testTypePassed={appointmentReadiness.speakerPassed}
      />
      <TestMyComputerDeviceStatusComponent
        testDescription={messages.test_my_computer_microphone}
        testTypePassed={appointmentReadiness.microphonePassed}
      />
      <TestMyComputerDeviceStatusComponent
        testDescription={messages.test_my_computer_speedTest}
        testTypePassed={appointmentReadiness.downloadSpeedMbps > 0 && appointmentReadiness.uploadSpeedMbps > 0}
      />
      <TestMyComputerInfoComponent infoBag={deviceInfoBag} />
      <TestMyComputerInfoComponent infoBag={metricInfoBag} />
    </div>
  );
};

const TestMyComputerDeviceStatusComponent = ({ testDescription, testTypePassed }) => {
  const clsNames = classNames(
    'testMyComputerDeviceStatusIcon',
    { failed: !testTypePassed });
  return (
    <div className='testMyComputerDeviceStatus'>
      <div className={clsNames} />
      <div className='testMyComputerDeviceText'>{testDescription}</div>
    </div>
  );
};
const TestMyComputerInfoComponent = ({ infoBag }) => {
  const deviceBlockInfo = [];
  Object.keys(infoBag).forEach(item =>
    deviceBlockInfo.push(
      <div key={infoBag[item].name} className='testMyComputerInfoItem'>
        <span className='testMyComputerDeviceDesc'>{infoBag[item].name} - </span>
        <span className='testMyComputerDeviceDescVal'>{infoBag[item].value}</span>
      </div>));
  return (
    <div className='testMyComputerInfoWrapper'>
      {deviceBlockInfo}
    </div>
  );
};

TestMyComputerStatusComponent.defaultProps = {};
export default TestMyComputerStatusComponent;
