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

import MyMessagesComponent from '../components/mymessages/MyMessagesComponent';
import ValueLinkedContainer from './ValueLinkedContainer';
import formatBody from '../components/mymessages/FormattedMessageBody';
import { hasContextChanged } from '../components/Util';
import PageComponent from '../components/layout/PageComponent';
import banner from '../components/images/banners/man-smiling-tablet.png';

class MyMessagesContainer extends ValueLinkedContainer {
  constructor(props) {
    super(props);
    props.logger.debug('MyMessagesContainer: props', props);
    this.state = {
      errors: {},
      modified: {},
      inbox: null,
      sentMessages: null,
      detailedInboxMessage: null,
      detailedSentMessage: null,
      deleteModal: false,
      messageToDelete: null,
      contacts: [],
      topicTypes: [],
      messageDraft: null,
      draftContact: '',
      draftTopicType: '',
      draftBody: '',
      draftSubject: '',
      draftHealthSummary: false,
      draftAttachment: null,
      draftAttachmentError: '',
      isSecureMessagesSpinnerEnabled: true,
      isSecuredMessagesSyncing: false,
    };
  }

  componentDidMount() {
    this.setupMessageBoxes();
  }

  componentDidUpdate(prevProps) {
    if (hasContextChanged(this.props, prevProps)) {
      this.setupMessageBoxes();
    }
  }

  setupMessageBoxes() {
    // Get the inbox and sent... box
    const inboxPromise = this.props.sdk.secureMessageService.getInboxMessages(this.props.activeConsumer);
    const sentPromise = this.props.sdk.secureMessageService.getSentMessages(this.props.activeConsumer);
    const contactsPromise = this.props.sdk.secureMessageService.getContacts(this.props.activeConsumer);
    const topicTypesPromise = this.props.sdk.getTopicTypes();

    // No spinner here as the individual inbox and sent message views have their own spinners
    Promise.all([inboxPromise, sentPromise, contactsPromise, topicTypesPromise])
      .then((values) => {
        const inbox = values[0];
        const sentMessages = values[1];
        const contacts = values[2] || [];
        const topicTypes = values[3] || [];

        if (inbox.messages.length > 0) {
          this.getMessageDetail(inbox.messages[0]);
        }
        if (sentMessages.messages.length > 0) {
          this.getMessageDetail(sentMessages.messages[0]);
        }

        this.setState({ inbox, sentMessages, contacts, topicTypes, isSecureMessagesSpinnerEnabled: false });
      })
      .catch((error) => { this.handleError(error); });
  }

  getMessageDetail(selectedMessage) {
    // No spinner here as the message detail section has its own spinner
    this.props.sdk.secureMessageService.getMessageDetail(this.props.activeConsumer, selectedMessage)
      .then((detailedMessage) => {
        const state = {};
        if (detailedMessage.messageType === awsdk.AWSDKMessageType.Inbox) {
          this.updateMessageRead(detailedMessage);
          state.detailedInboxMessage = detailedMessage;
        } else {
          state.detailedSentMessage = detailedMessage;
        }
        state.messageDraft = null; // clear any draft since we're loading a new message
        this.setState(state);
      })
      .catch((error) => { this.handleError(error); });
  }

  getInboxMessageIndexOf(inboxMessage) {
    const index = -1;
    if (inboxMessage) {
      const inboxMessages = this.state.inbox.messages;
      for (let idx = 0; idx < inboxMessages.length; idx += 1) {
        if (inboxMessages[idx].id.persistentId === inboxMessage.id.persistentId) {
          return idx;
        }
      }
    }
    return index;
  }

  deleteMessage(detailedMessage) {
    if (detailedMessage) {
      const detailedMessageIndex = this.getInboxMessageIndexOf(detailedMessage);
      this.props.sdk.secureMessageService.removeMessage(this.props.activeConsumer, detailedMessage)
        .then(() => {
          this.setState({ messageToDelete: null, deleteModal: null });
          this.refreshMessages()
            .then(() => {
              const inboxMessagesLength = this.state.inbox.messages.length;
              if (inboxMessagesLength > 0 && detailedMessageIndex !== -1) {
                // Account for when the deleted message's index was the last in the inbox
                const selectedMessageIndex = (detailedMessageIndex === inboxMessagesLength) ? (inboxMessagesLength - 1) : detailedMessageIndex;
                this.getMessageDetail(this.state.inbox.messages[selectedMessageIndex]);
              }
            });
        })
        .catch((error) => { this.handleError(error); });
    }
  }

  syncMessages() {
    this.enableInboxSpinner();
    this.refreshMessages()
      .catch((error) => { this.handleError(error); })
      .finally(() => this.disableInboxSpinner());
  }

  refreshMessages() {
    const inbox = this.state.inbox;
    const sentMessages = this.state.sentMessages;

    const inboxPromise = this.props.sdk.secureMessageService.refreshInbox(this.props.activeConsumer, inbox);
    const sentPromise = this.props.sdk.secureMessageService.refreshSentMessages(this.props.activeConsumer, sentMessages);

    // no spinner since it's happening in the background
    return Promise.all([inboxPromise, sentPromise])
      .then(() => {
        if (inbox && inbox.unread === 0) {
          this.props.hideSecureMessagesOnBell();
        }
        this.setState({ inbox, sentMessages });
      })
      .catch((error) => { this.handleError(error); });
  }

  updateMessageRead(detailedMessage) {
    // no spinner since it's happening in the background
    this.props.sdk.secureMessageService.updateMessageRead(this.props.activeConsumer, detailedMessage)
      .then(() => {
        this.refreshMessages();
      })
      .catch((error) => { this.handleError(error); });
  }

  getAttachment(attachment) {
    this.props.enableSpinner();
    this.props.sdk.secureMessageService.getAttachment(this.props.activeConsumer, attachment)
      .then((blob) => {
        const isMicrosoftBrowser = window.navigator && window.navigator.msSaveOrOpenBlob;
        const theWindow = !isMicrosoftBrowser ? window.open('') : null;
        if (isMicrosoftBrowser) {
          window.navigator.msSaveOrOpenBlob(blob);
        } else {
          theWindow.location = URL.createObjectURL(blob);
        }
      })
      .catch((error) => { this.handleError(error); })
      .finally(() => this.props.disableSpinner());
  }

  removeAttachment() {
    this.setState({ draftAttachment: null, draftAttachmentError: '', errors: {} });
  }

  attachToMessage(e) {
    this.props.logger.debug('MyMessagesContainer: attaching to message');

    const file = e.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = (() => {
      const uploadAttachment = this.props.sdk.secureMessageService.newUploadAttachment();
      uploadAttachment.name = file.name;
      uploadAttachment.data = new Blob([fileReader.result], { type: file.type });
      this.setState({ draftAttachment: uploadAttachment });
    });
    fileReader.readAsArrayBuffer(file);
  }

  sendMessage() {
    const messageDraft = this.state.messageDraft;
    // recipient is already set for a reply message
    if (messageDraft.actionType !== awsdk.AWSDKMessageActionType.Reply) {
      messageDraft.recipient = this.state.contacts.find(c => c.id.persistentId === this.state.draftContact);
    }
    // topic type is already set from the forwarded/replied message
    if (messageDraft.actionType === awsdk.AWSDKMessageActionType.New) {
      messageDraft.topicType = this.state.topicTypes.find(t => t.name === this.state.draftTopicType);
    }

    messageDraft.body = this.state.draftBody.replace(/<\s*h\s*r\s*\/*\s*>/g, '#msgHorizontalDivider') || '';
    messageDraft.subject = this.state.draftSubject;
    messageDraft.attachHealthSummary = this.state.draftHealthSummary;
    messageDraft.uploadAttachment = this.state.draftAttachment;

    this.props.enableSpinner();
    this.props.sdk.secureMessageService.sendMessage(this.props.activeConsumer, this.state.messageDraft)
      .then(() => {
        this.deleteMessageDraft();
        this.refreshMessages();
      })
      .catch((error) => { this.handleError(error); })
      .finally(() => this.props.disableSpinner());
  }

  handleError(error) {
    const errors = {};
    if (error.errorCode === awsdk.AWSDKErrorCode.authenticationSessionExpired) {
      this.props.history.push('/sessionExpired');
    } else if (error.errorCode === awsdk.AWSDKErrorCode.validationError && error.fieldName === 'topicType') {
      errors.draftTopicType = this.props.messages.secure_message_validation_topic_type;
    } else if (error.errorCode === awsdk.AWSDKErrorCode.validationError && error.fieldName === 'recipient') {
      errors.draftContact = this.props.messages.secure_message_validation_contact;
    } else if (error.errorCode === awsdk.AWSDKErrorCode.unsupportedMimeType) {
      errors.draftAttachmentError = this.props.messages.secure_message_validation_attachment_unsupported;
    } else if (error.errorCode === awsdk.AWSDKErrorCode.attachmentSizeTooLarge) {
      errors.draftAttachmentError = this.props.messages.secure_message_validation_attachment_too_large;
    } else {
      this.props.logger.info('Something went wrong:', error);
      this.props.showErrorModal();
    }
    if (errors !== {}) this.setState({ errors });
  }

  toggleDeleteModal(messageToDelete) {
    this.setState(prevState => ({
      deleteModal: !prevState.deleteModal,
      messageToDelete,
    }));
  }

  newMessageDraft() {
    this.setState({
      messageDraft: this.props.sdk.secureMessageService.getNewMessageDraft(),
      draftContact: '',
      draftTopicType: '',
      draftSubject: '',
      draftBody: '',
      draftHealthSummary: false,
      draftAttachment: null,
      errors: {},
    });
  }

  newReplyMessageDraft(detailedMessage) {
    this.setState({
      messageDraft: this.props.sdk.secureMessageService.getReplyMessageDraft(detailedMessage),
      draftContact: detailedMessage.sender ? detailedMessage.sender.id.persistentId : '',
      draftTopicType: detailedMessage.topicType ? detailedMessage.topicType.name : '',
      draftSubject: `RE: ${detailedMessage.subject || ''}`,
      draftBody: formatBody(detailedMessage, this.props.locale, this.props.messages),
      draftHealthSummary: false,
      draftAttachment: null,
      errors: {},
    });
  }

  newForwardMessageDraft(detailedMessage) {
    this.setState({
      messageDraft: this.props.sdk.secureMessageService.getForwardMessageDraft(detailedMessage),
      draftContact: '',
      draftTopicType: detailedMessage.topicType ? detailedMessage.topicType.name : '',
      draftSubject: `FWD: ${detailedMessage.subject || ''}`,
      draftBody: formatBody(detailedMessage, this.props.locale, this.props.messages),
      draftHealthSummary: false,
      draftAttachment: null,
      errors: {},
    });
  }

  deleteMessageDraft() {
    this.setState({ messageDraft: null, deleteModal: false, modified: {}, errors: {} });
  }

  enableInboxSpinner() {
    this.props.logger.info('Enable Secured Messages Inbox and Sent Messages Spinner');
    this.setState({ isSecureMessagesSpinnerEnabled: true, isSecuredMessagesSyncing: true });
  }

  disableInboxSpinner() {
    this.props.logger.info('Disable Secured Messages Inbox and Sent Messages Spinner');
    this.setState({ isSecureMessagesSpinnerEnabled: false, isSecuredMessagesSyncing: false });
  }

  render() {
    const valueLinks = this.linkAll(['draftSubject', 'draftContact', 'draftTopicType', 'draftBody', 'draftHealthSummary', 'draftAttachmentError']);

    const properties = {
      valueLinks,
      inbox: this.state.inbox,
      sentMessages: this.state.sentMessages,
      detailedInboxMessage: this.state.detailedInboxMessage,
      detailedSentMessage: this.state.detailedSentMessage,
      contacts: this.state.contacts,
      messageDraft: this.state.messageDraft,
      topicTypes: this.state.topicTypes,
      draftAttachment: this.state.draftAttachment,
      deleteModal: this.state.deleteModal,
      messageToDelete: this.state.messageToDelete,
      isSecureMessagesSpinnerEnabled: this.state.isSecureMessagesSpinnerEnabled,
      isSecuredMessagesSyncing: this.state.isSecuredMessagesSyncing,
      toggleDeleteModal: this.toggleDeleteModal.bind(this),
      removeAttachment: this.removeAttachment.bind(this),
      newMessageClickHandler: this.newMessageDraft.bind(this),
      syncMessageClickHandler: this.syncMessages.bind(this),
      replyMessageClickHandler: this.newReplyMessageDraft.bind(this),
      forwardMessageClickHandler: this.newForwardMessageDraft.bind(this),
      messageClickHandler: this.getMessageDetail.bind(this),
      deleteMessageClickHandler: this.deleteMessage.bind(this),
      deleteMessageDraftClickHandler: this.deleteMessageDraft.bind(this),
      attachToMessageDraftClickHandler: this.attachToMessage.bind(this),
      sendMessageDraftClickHandler: this.sendMessage.bind(this),
      getAttachment: this.getAttachment.bind(this),
    };

    return (
      <PageComponent banner={banner} unpadded={true}>
        <MyMessagesComponent {...properties} {...this.props}/>
      </PageComponent>
    );
  }
}

MyMessagesContainer.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
MyMessagesContainer.defaultProps = {};
export default MyMessagesContainer;
