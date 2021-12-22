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
import classNames from 'classnames';

import PaperClip from './images/paper-clip.png';

import './MessageComponent.css';

const MessageComponent = (props) => {
  props.logger.debug('MessageComponent: props', props);

  const messageClass = classNames({
    message: true,
    unread: props.message.isUnread,
    selected: props.detailedMessage && props.detailedMessage.id.persistentId === props.message.id.persistentId,
  });

  return (
    <div className={messageClass} onClick={() => props.messageClickHandler(props.message)}>
      <div className="messageTitle">
        <div className="messageSenderName">{props.message.senderName}</div>
        {props.message.hasAttachment && <img alt="attachment" src={PaperClip}/>}
        <div className="messageDate">
          <FormattedDate value={props.message.date}
            year='numeric'
            month='numeric'
            day='numeric'
            hour='2-digit'
            minute='2-digit'
            timeZone='UTC' />
        </div>
      </div>
      {props.message.topicType && <div className="messageTopic">{props.message.topicType.name}</div>}
      <div className="messageSubject">{props.message.subject}</div>
      <div className="messageBodyPreview">{props.message.bodyPreview}</div>
    </div>
  );
};

MessageComponent.propTypes = {
  logger: PropTypes.any.isRequired,
  message: PropTypes.object.isRequired,
  messageClickHandler: PropTypes.func.isRequired,
  detailedMessage: PropTypes.object,
};
MessageComponent.defaultProps = {};
export default MessageComponent;
