/*!
 * American Well Consumer Web SDK
 *
 * Copyright (c) 2018 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Button, Input, Label, FormGroup, Form } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { PhoneNumberInput } from '../form/Inputs';
import './VisitComponents.css';

class VisitWaitingRoomSMSComponent extends React.Component {
  render() {
    const smsPhoneNumberLink = this.props.smsPhoneNumberLink;
    const smsCheckBoxTabIndex = this.props.tabIndex;
    const smsPhoneInputTabIndex = Number(smsCheckBoxTabIndex) + 1;
    const smsMobileNumberInputTabIndex = smsPhoneInputTabIndex + 1;

    return (
      <div className="visitWaitingRoomSMS" id="visitWaitingRoomSMS">
        { !this.props.smsNumberAlreadyProvided ?
          <Form onSubmit={this.props.submitSMSPhoneNumber}>
            <FormGroup check className="smsEnableCheckBox">
              <Label check>
                <Input type="checkbox" id="smsEnableInputBox" checked={this.props.displaySMSInput} onChange={this.props.toggleDisplaySMSInput} tabIndex={smsCheckBoxTabIndex} />{' '}
              </Label>
              <div className="smsEnableText" id="smsEnableText">
                <FormattedMessage className="smsEnableTextTitle" id="smsEnableTextTitle"
                  defaultMessage={ !this.props.displaySMSInput ? this.props.messages.visit_waiting_room_sms_enable_prompt : this.props.messages.visit_waiting_room_sms_enter_number_prompt } />
              </div>
            </FormGroup>
            {this.props.displaySMSInput &&
              <div className={this.props.displaySMSInput ? 'smsInputWrapper' : 'smsInputWrapper hidden'}>
                <PhoneNumberInput locale={this.props.locale} id="smsPhoneInput" className="smsPhoneInput" valueLink={smsPhoneNumberLink} name="smsPhoneInput"
                  placeholder={this.props.messages.visit_waiting_room_sms_mobile_number} tabIndex={smsPhoneInputTabIndex} />
                <div id="smsMobileNumberSubmit" className="smsMobileNumberSubmit">
                  <Button tabIndex={smsMobileNumberInputTabIndex} id="smsMobileNumberSubmit" className="smsMobileNumberSubmit">{this.props.messages.visit_waiting_room_sms_ok}</Button>
                </div>
              </div>
            }
          </Form>
          :
          <div className="smsAllSet" >
            <FormattedMessage className="smsAllSet" id="smsAllSet" defaultMessage={this.props.messages.visit_waiting_room_provider_will_text} /><br/>
            <FormattedMessage className="smsAllSetKeepOpen" id="smsAllSetKeepOpen" defaultMessage={this.props.messages.visit_waiting_room_keep_dont_close_browser} />
          </div>
        }
      </div>
    );
  }
}
VisitWaitingRoomSMSComponent.propTypes = {
  messages: PropTypes.any.isRequired,
};
VisitWaitingRoomSMSComponent.defaultProps = { };
export default VisitWaitingRoomSMSComponent;
