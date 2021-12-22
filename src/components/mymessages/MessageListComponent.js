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

import Message from './MessageComponent';

import './MessageListComponent.css';

const MessageListComponent = (props) => {
  props.logger.debug('MessageListComponent: props', props);

  return (
    <div className="messageListComponent">
      {props.messageList.map(message => <Message key={message.id.persistentId} message={message} {...props}/>)}
    </div>
  );
};

MessageListComponent.propTypes = {
  logger: PropTypes.any.isRequired,
  messageClickHandler: PropTypes.func.isRequired,
  messageList: PropTypes.array.isRequired,
};
MessageListComponent.defaultProps = {};
export default MessageListComponent;
