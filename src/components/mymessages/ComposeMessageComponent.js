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
import ContentEditable from 'react-contenteditable';

import { Checkbox, Select, TextInputRaw } from '../form/Inputs';

import './ComposeMessageComponent.css';

const ComposeMessageComponent = (props) => {
  props.logger.debug('ComposeMessageComponent: props', props);

  const isReply = props.messageDraft.actionType === awsdk.AWSDKMessageActionType.Reply;
  const isForward = props.messageDraft.actionType === awsdk.AWSDKMessageActionType.Forward;
  const isDisplayTopicTypeSelector = !(isForward && props.messageDraft.sourceIsSystemNotification);

  const messageType = () => {
    if (isReply) {
      return props.messages.secure_message_compose_title_reply;
    } else if (isForward) {
      return props.messages.secure_message_compose_title_forward;
    }
    return props.messages.secure_message_compose_title_new;
  };

  return (
    <div className="composeMessageComponent">
      <div className="messageTypeTitle">
        {messageType()}
      </div>

      <ContactSelector
        valueLink={props.valueLinks.draftContact}
        contacts={props.contacts}
        isReply={isReply}
        messages={props.messages}/>

      {props.valueLinks.draftTopicType.value !== null &&
      <TopicTypeSelector
        valueLink={props.valueLinks.draftTopicType}
        topicTypes={props.topicTypes}
        isReply={isReply}
        isForward={isForward}
        messages={props.messages}
        isDisplayTopicTypeSelector={isDisplayTopicTypeSelector}/>}

      <TextInputRaw
        className="composeMessageSubject"
        valueLink={props.valueLinks.draftSubject}
        placeholder={props.messages.secure_message_compose_meta_subject}/>

      {props.draftAttachment &&
      <Attachment
        valueLink={props.valueLinks.draftAttachmentError}
        draftAttachment={props.draftAttachment}
        removeAttachment={props.removeAttachment}
        messages={props.messages}/>}

      <Checkbox checkedLink={props.valueLinks.draftHealthSummary} className="healthSummaryCheckbox">
        {props.messages.secure_message_compose_meta_health_summary}
      </Checkbox>

      <div className="disclaimerInfo">
        {props.messages.secure_message_compose_meta_disclaimer}
      </div>

      {props.valueLinks.draftBody.error &&
      <div className="error">{props.valueLinks.draftBody.error}</div>}
      <ContentEditable
        html={props.valueLinks.draftBody.value}
        onChange={props.valueLinks.draftBody.action((x, e) => e.target.value)}
        onBlur={null}
        disabled={false}
        tagName={'div'}
        className={'messageEditableBody'}
        style={null}/>
    </div>
  );
};

const ContactSelector = props => (
  <div>
    <Select valueLink={props.valueLink} disabled={props.isReply}>
      <option value="" disabled hidden>{props.messages.secure_message_compose_meta_contact}</option>
      {props.contacts
        .filter(c => c.acceptsSecureMessage)
        .map(c => <option key={c.id.persistentId} value={c.id.persistentId}>{c.name}</option>)}
    </Select>
    {props.valueLink.error &&
    <div className="error">{props.valueLink.error}</div>}
  </div>
);

const TopicTypeSelector = props => (
  <div>
    {props.isDisplayTopicTypeSelector &&
    <div>
      <Select valueLink={props.valueLink} disabled={props.isReply || props.isForward}>
        <option value='' disabled hidden>{props.messages.secure_message_compose_meta_type}</option>
        {props.topicTypes.map(t => <option key={t.key} value={t.name}>{t.name}</option>)}
      </Select>
      {props.valueLink.error &&
      <div className="error">{props.valueLink.error}</div>}
    </div>}
  </div>
);

const Attachment = props => (
  <div className="attachmentTitle">
    {props.draftAttachment.name}
    <span onClick={() => props.removeAttachment()}>{props.messages.secure_message_compose_meta_remove_file}</span>
    {props.valueLink.error &&
    <div className="error">{props.valueLink.error}</div>}
  </div>
);

ComposeMessageComponent.propTypes = {
  valueLinks: PropTypes.any.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.any.isRequired,
  contacts: PropTypes.array.isRequired,
  messageDraft: PropTypes.object.isRequired,
  removeAttachment: PropTypes.func.isRequired,
  draftAttachment: PropTypes.any,
};
ComposeMessageComponent.defaultProps = {};
export default ComposeMessageComponent;
