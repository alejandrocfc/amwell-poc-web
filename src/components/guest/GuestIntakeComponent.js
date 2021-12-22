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
import { Button, Form } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import { EmailInput, TextInputRaw } from '../form/Inputs';

const GuestIntakeComponent = (props) => {
  props.logger.trace('GuestIntakeComponent props', props);
  return (
    <div>
      <div id="visitIntake" className="visitForm">
        <div id="visitBodyIntro" className="visitBodyIntro">{props.messages.guest_intake_description}</div>
        <Form id="visitIntakeForm">
          <div className="guestNameContainer">
            <div className="label">{props.messages.guest_intake_name_label}</div>
            <TextInputRaw className='guestNameInput' name="guestName" placeholder={props.messages.guest_intake_name_placeholder} valueLink={props.valueLinks.guestName}/>
          </div>
          <div className="guestEmailContainer">
            <div className="label">{props.messages.guest_intake_email_label}</div>
            <div>{props.messages.guest_intake_email_desc}</div>
            <EmailInput valueLink={props.valueLinks.guestEmail} placeholder={props.messages.guest_intake_email_placeholder}/>
          </div>
          <div id="visitIntakeSubmit" className="visitSubmit">
            <Button type="submit" className="visitButton" disabled={props.submitDisabled} onClick={props.submitGuestIntake}>{props.messages.visit_intake_next}</Button>
          </div>
          <div className="technicalAssistance"><FormattedMessage id="technical_assistance_generic" values={{ formattedNumber: props.messages.customer_support_phone_number }}/></div>
        </Form>
      </div>
    </div>
  );
};

export default GuestIntakeComponent;
