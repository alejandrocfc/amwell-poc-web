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

import Delete from './images/icon-delete.png';
import Send from './images/icon-send.png';
import Attach from './images/icon-attach.png';
import DisabledAttach from './images/icon-attach-disable.png';
import MessageAction from './MessageAction';

import './ComposeMessageActions.css';

const ComposeMessageActions = props =>
  (
    <div className="composeMessageActions">
      <label>
        <input
          accept={props.sdk.getSystemConfiguration().mimeTypeWhitelist}
          type="file"
          onClick={(e) => { e.target.value = null; }}
          onChange={e => props.attachToMessageDraftClickHandler(e)}/>
        <MessageAction title={props.messages.secure_message_actions_attach} disabled={props.draftAttachment} icon={props.draftAttachment ? DisabledAttach : Attach}/>
      </label>
      <MessageAction title={props.messages.secure_message_actions_send} icon={Send} clickHandler={() => props.sendMessageDraftClickHandler()}/>
      <MessageAction title={props.messages.secure_message_actions_delete} icon={Delete} clickHandler={() => props.toggleDeleteModal()}/>
    </div>
  );


ComposeMessageActions.propTypes = {
  sdk: PropTypes.any.isRequired,
  messages: PropTypes.any.isRequired,
  sendMessageDraftClickHandler: PropTypes.func.isRequired,
  attachToMessageDraftClickHandler: PropTypes.func.isRequired,
  toggleDeleteModal: PropTypes.func.isRequired,
  draftAttachment: PropTypes.object,
};

ComposeMessageActions.defaultProps = {};
export default ComposeMessageActions;
