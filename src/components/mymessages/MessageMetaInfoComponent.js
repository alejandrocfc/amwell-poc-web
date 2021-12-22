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
import { FormattedDate } from 'react-intl';

import './MessageMetaInfoComponent.css';

const MessageMetaInfoComponent = (props) => {
  props.logger.debug('MessageMetaInfoComponent: props', props);

  const recipients = props.detailedMessage.recipients.map((r, index) => {
    let name;
    if (index === 0 || index === props.detailedMessage.recipients.length - 1) {
      name = r.fullName;
    } else {
      name = `${r.fullName}, `;
    }
    return <span key={r.id.persistentId}>{name}</span>;
  });

  return (
    <div className="messageMetaInfo">
      <div>
        <span className="messageMetaInfoLabel">{props.messages.secure_message_detailed_sent}</span>
        <FormattedDate value={props.detailedMessage.date}
          year='numeric'
          month='numeric'
          day='numeric'
          hour='2-digit'
          minute='2-digit'
          timeZone='UTC'
          timeZoneName='short'/>
      </div>
      <div>
        <span className="messageMetaInfoLabel">{props.messages.secure_message_detailed_to}</span>
        {recipients}
      </div>
      {props.detailedMessage.topicType &&
      <div>
        <span className="messageMetaInfoLabel">{props.messages.secure_message_detailed_type}</span>
        {props.detailedMessage.topicType.name}
      </div>}
      {props.detailedMessage.attachmentCount > 0 &&
      <div>
        <span className="messageMetaInfoLabel">{props.messages.secure_message_detailed_attachment}</span>
        <button className="link-like" onClick={(e) => { e.preventDefault(); props.getAttachment(props.detailedMessage.attachments[0]); }}>
          {props.detailedMessage.attachments[0].name}
        </button>
      </div>}
    </div>
  );
};

MessageMetaInfoComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.any.isRequired,
  detailedMessage: PropTypes.object.isRequired,
};
MessageMetaInfoComponent.defaultProps = {};
export default MessageMetaInfoComponent;
