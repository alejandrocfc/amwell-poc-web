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

import React from 'react';
import PropTypes from 'prop-types';
import awsdk from 'awsdk';
import { Button, Col } from 'reactstrap';
import { FormattedHTMLMessage } from 'react-intl';

import ProviderInformationComponent from '../ProviderInformationComponent';
import ProviderNameAndPhotoComponent from '../ProviderNameAndPhotoComponent';
import CartModeButton from '../../cartmode/CartModeButton';

import './ProviderDetailsComponent.css';


class ProviderDetailsComponent extends React.Component {
  constructor(props) {
    super(props);
    this.props.logger.debug('ProviderDetailsComponent: props', props);
    this.buildTextFromList = this.buildTextFromList.bind(this);
    this.handleStartVisitClick = this.handleStartVisitClick.bind(this);
  }

  handleStartVisitClick(e, providerDetails) {
    e.preventDefault();
    this.props.logger.debug('ProviderDetailsComponent: Start Visit Click:', providerDetails.fullName, providerDetails);
    sessionStorage.setItem('selectedProvider', providerDetails.toString());
    this.props.history.push('/visit/intake/start', { provider: providerDetails.toString() });
  }

  buildTextFromList(list) {
    if (list && list.length > 0) {
      const text = [];
      list.forEach((item, index) => {
        const value = item.value || item;
        text.push(index === 0 ? value : `, ${value}`);
      });
      return text;
    }
    return this.props.messages.provider_none;
  }

  render() {
    let status = '';
    let startVisitMessage = '';
    let startButton = '';
    const isAvailable = [awsdk.AWSDKProviderVisibility.WEB_AVAILABLE, awsdk.AWSDKProviderVisibility.PHONE_AVAILABLE].includes(this.props.providerDetails.visibility) && this.props.providerDetails.waitingRoomCount === 0;
    if (this.props.providerDetails.visibility === awsdk.AWSDKProviderVisibility.OFFLINE) {
      status = 'offline';
      startVisitMessage = <FormattedHTMLMessage id="startVisitMessage" defaultMessage={ this.props.messages.provider_availability_offline_1 } />;
    } else if (isAvailable) {
      status = 'available';
      startVisitMessage = <FormattedHTMLMessage id="startVisitMessage" defaultMessage={ this.props.messages.provider_availability_available_1 } />;
      startButton = <Button id="providerStartButton" className="startVisitButton" onClick={e => this.handleStartVisitClick(e, this.props.providerDetails) }>{this.props.messages.provider_start_your_visit}</Button>;
    } else {
      status = 'waiting';
      startVisitMessage = <FormattedHTMLMessage id="startVisitMessage" defaultMessage={ this.props.messages.provider_availability_waiting_1 } values={{ count: Math.max(1, this.props.providerDetails.waitingRoomCount) }}/>;
      startButton = <Button id="providerWaitButton" className="startVisitButton" onClick={e => this.handleStartVisitClick(e, this.props.providerDetails) }>{this.props.messages.provider_join_waiting_room}</Button>;
    }

    return (
      <Col id={`${this.props.providerDetails.sourceId}-details`} className={`providerDetails ${status} col${this.props.providerPosition}`}>

        <ProviderNameAndPhotoComponent className={status} {...this.props}/>

        {this.props.handleRequestCallClick && <Button className="requestCallButton" onClick={e => this.props.handleRequestCallClick(e)}>{this.props.messages.request_call}</Button>}

        <div ref={this.props.setProviderDetailsRef} id="providerMain" className="providerMain">
          <div className={`startVisit ${status}`}>
            <div id="closeProvider" className="closeProvider" onClick={this.props.closeProviderDetails}/>
            <div className="providerStatusAndButton">
              <div id="providerStartVisitText" className="startVisitText">{ startVisitMessage }</div>
              { startButton }
            </div>
          </div>
          <div className="greetingAndInfo">
            <div id="providerGreeting" className="providerGreeting">{this.props.providerDetails.textGreeting}</div>
            <ProviderInformationComponent {...this.props}/>
          </div>{ this.props.providerDetails.visibility !== awsdk.AWSDKProviderVisibility.OFFLINE &&
            <CartModeButton clickHandler={this.props.startCartMode}/>
          }
        </div>
      </Col>);
  }
}


ProviderDetailsComponent.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  logger: PropTypes.object.isRequired,
  providerDetails: PropTypes.object.isRequired,
  providerPosition: PropTypes.number,
  closeProviderDetails: PropTypes.func.isRequired,
  handleRequestCallClick: PropTypes.func,
};
ProviderDetailsComponent.defaultProps = {};
export default ProviderDetailsComponent;
