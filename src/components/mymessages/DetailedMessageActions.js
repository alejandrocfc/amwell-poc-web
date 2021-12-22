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
import React from 'react';
import PropTypes from 'prop-types';

import Reply from './images/icon-reply.png';
import Forward from './images/icon-forward.png';
import Delete from './images/icon-delete.png';
import MessageAction from './MessageAction';

const DetailedMessageActions = props =>
  (
    <div className="detailedMessageActions">
      { (props.detailedMessage.messageType === awsdk.AWSDKMessageType.Inbox && !props.detailedMessage.isSystemNotification) &&
      <MessageAction title={props.messages.secure_message_actions_reply} icon={Reply} clickHandler={() => props.replyMessageClickHandler(props.detailedMessage)}/>}
      <MessageAction title={props.messages.secure_message_actions_forward} icon={Forward} clickHandler={() => props.forwardMessageClickHandler(props.detailedMessage)}/>
      <MessageAction title={props.messages.secure_message_actions_delete} icon={Delete} clickHandler={() => props.toggleDeleteModal(props.detailedMessage)}/>
    </div>
  );


DetailedMessageActions.propTypes = {
  messages: PropTypes.any.isRequired,
  detailedMessage: PropTypes.object.isRequired,
  replyMessageClickHandler: PropTypes.func.isRequired,
  forwardMessageClickHandler: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
};
DetailedMessageActions.defaultProps = {};
export default DetailedMessageActions;
