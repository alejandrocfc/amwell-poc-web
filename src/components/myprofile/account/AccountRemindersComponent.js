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
import { Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import '../MyProfileComponent.css';
import { Checkbox } from '../../form/Inputs';

const AccountRemindersInfoComponent = (props) => {
  props.logger.debug('AccountRemindersInfoComponent: props', props);

  const remindersLink = props.valueLinks.reminders;
  const remindersEnabledMessage = props.currentConsumer.appointmentReminderTextsEnabled ? props.messages.yes : props.messages.no;
  const consumerPhone = props.currentConsumer.phone;
  const toggleEditReminders = () => {
    remindersLink.set(props.currentConsumer.appointmentReminderTextsEnabled);
    props.toggleEditReminders();
  };

  return (
    <div>
      <div className="myProfileContentSubheader">
        {props.messages.my_profile_appointment_reminders}
        {!props.isDependent &&
        <span>
          <span className="myProfileSeparator">|</span>
          <span className="myProfileLink" onClick={() => toggleEditReminders()}>{props.messages.edit}</span>
        </span>
        }
      </div>
      <div className="myProfileContentDescription">
        <FormattedMessage id="my_profile_appointment_reminders_description" values={{ formattedNumber: consumerPhone }} />
      </div>
      {props.isEditReminders ? (
        <div className="editContainer">
          <div className="myProfileInputContainer">
            <Checkbox className="myProfileReminderBox" value={props.currentConsumer.appointmentReminderTextsEnabled} checkedLink={remindersLink}>
              <span>{props.messages.my_profile_enable_question}</span>
            </Checkbox>
          </div>
          <div className="myProfileButtonContainer">
            <div className="cancelBtn">
              <Button tabIndex="30" className="myProfileAccountBtn" onClick={() => toggleEditReminders()}>{props.messages.cancel}</Button>
            </div>
            <div className="saveBtn">
              <Button tabIndex="31" className="myProfileAccountBtn" onClick={e => props.updateMyProfileAccount(e, 'reminder')}>{props.messages.save}</Button>
            </div>
          </div>
        </div>) : (
        <div className="myProfileValueContainer">
          <div className="myProfileValueLabel"><div className="labelValue">{props.messages.my_profile_enabled}</div>
            <div>{remindersEnabledMessage}</div>
          </div>
        </div>
      )}
    </div>
  );
};

AccountRemindersInfoComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
AccountRemindersInfoComponent.defaultProps = {};
export default AccountRemindersInfoComponent;
