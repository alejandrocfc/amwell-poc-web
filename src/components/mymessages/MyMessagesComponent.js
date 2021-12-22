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
import { FormattedMessage } from 'react-intl';
import { Route } from 'react-router-dom';
import awsdk from 'awsdk';

import TabBar from '../tabs/TabBarComponent';
import Tab from '../tabs/TabComponent';
import MessageListComponent from './MessageListComponent';
import DetailedMessageComponent from './DetailedMessageComponent';
import MessageAction from './MessageAction';
import DetailedMessageActions from './DetailedMessageActions';
import ComposeMessageComponent from './ComposeMessageComponent';
import ComposeMessageActions from './ComposeMessageActions';
import Loading from './images/loading.png';
import NewMessage from './images/icon-new-message.png';
import NewMessageDisabled from './images/icon-new-message-disabled.png';
import Sync from './images/icon-sync.png';
import SyncDisabled from './images/icon-sync-disabled.png';

import './MyMessagesComponent.css';
import DeleteModalComponent from './DeleteModalComponent';

class MyMessagesComponent extends React.Component {
  constructor(props) {
    super(props);
    props.logger.debug('MyMessagesComponent: props', props);
  }

  getInboxTabTitle() {
    if (this.props.inbox && this.props.inbox.unread > 0) {
      return <FormattedMessage id="unreadInbox" defaultMessage={ this.props.messages.secure_message_inbox_unread } values={{ unread: this.props.inbox.unread }} />;
    }
    return this.props.messages.secure_message_inbox;
  }

  render() {
    return (
      <>
        <TabBar>
          <Tab matchPath="inbox" title={this.getInboxTabTitle()} {...this.props}/>
          <Tab matchPath="sent" title={this.props.messages.secure_message_sent_messages} {...this.props}/>
        </TabBar>
        <div>

          <Route path={`${this.props.match.url}/inbox`} render={() => (
            <MessagesContent
              detailedMessage={this.props.detailedInboxMessage}
              messageList={this.props.inbox && this.props.inbox.messages}
              {...this.props}/>
          )}/>

          <Route path={`${this.props.match.url}/sent`} render={() => (
            <MessagesContent
              detailedMessage={this.props.detailedSentMessage}
              messageList={this.props.sentMessages && this.props.sentMessages.messages}
              {...this.props}/>
          )}/>

        </div>
        <DeleteModalComponent isOpen={this.props.deleteModal} toggle={this.props.toggleDeleteModal} {...this.props}/>
      </>
    );
  }
}

const MessagesContent = (props) => {
  const disableNewMessage = props.messageDraft && props.messageDraft.actionType === awsdk.AWSDKMessageActionType.New;
  return (
    <div className="myMessagesContent">
      <div className="messageActions">
        <div className="commonMessageActions">
          <MessageAction
            title={props.messages.secure_message_actions_new}
            disabled={disableNewMessage}
            icon={disableNewMessage ? NewMessageDisabled : NewMessage}
            clickHandler={props.newMessageClickHandler}/>
          <MessageAction
            title={props.messages.secure_message_actions_sync}
            disabled={props.isSecuredMessagesSyncing}
            icon={props.isSecuredMessagesSyncing ? SyncDisabled : Sync}
            clickHandler={props.syncMessageClickHandler}/>
        </div>
        {!props.messageDraft && props.detailedMessage &&
        <DetailedMessageActions {...props}/>}

        {props.messageDraft &&
        <ComposeMessageActions {...props}/>}

      </div>
      <MessageListAndDetail {...props}/>
    </div>
  );
};

const MessageListAndDetail = props =>
  (
    <div className="myMessagesListAndDetail">
      <div className="messageList">
        <LoadingSection messages={props.messages} isSecureMessagesSpinnerEnabled={props.isSecureMessagesSpinnerEnabled}>
          {props.messageList &&
          <MessageListComponent {...props}/>}
        </LoadingSection>
      </div>
      <div className="messageDetail">

        {/* If we have a draft, we should be showing the compose component */}
        {props.messageDraft &&
        <ComposeMessageComponent {...props}/>}

        {/* If we don't have a draft and we have messages, show the current detailed message or a loading spinner  */}
        {!props.messageDraft && props.messageList && props.messageList.length > 0 &&
          <LoadingSection messages={props.messages}>
            {props.detailedMessage &&
            <DetailedMessageComponent {...props}/>}
          </LoadingSection>}

        {/* No draft, no messages, show a message saying so */}
        {!props.messageDraft && (!props.messageList || props.messageList.length === 0) &&
          <div className="noMessages">{props.messages.secure_message_no_messages}</div>}

      </div>
    </div>
  );

const LoadingSection = props =>
  (
    <div>
      {props.isSecureMessagesSpinnerEnabled ? <div className="loadingSection"><img alt={props.messages.secure_message_loading} src={Loading}/></div> : (props.children || <div className="loadingSection"><img alt={props.messages.secure_message_loading} src={Loading}/></div>)}
    </div>
  );


MyMessagesComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  messageClickHandler: PropTypes.func.isRequired,
  deleteMessageClickHandler: PropTypes.func.isRequired,
  detailedMessage: PropTypes.object,
};
MyMessagesComponent.defaultProps = {};
export default MyMessagesComponent;
