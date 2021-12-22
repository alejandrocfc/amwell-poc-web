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

import PropTypes from 'prop-types';
import React from 'react';
import ChatWindowComponent from '../components/visit/chat/ChatWindowComponent';


class ChatContainer extends React.Component {
  constructor(props) {
    super();
    props.logger.info('ChatContainer: props', props);
    this.state = {
      currentMessage: '',
    };
  }

  handleSendMessageClick(e) {
    e.preventDefault();
    if (this.state.currentMessage) {
      this.props.handleSendMessageClick(this.state.currentMessage, this.props.chatReport.lastOrdinal);
      this.setState({ currentMessage: '' });
    }
  }

  updateCurrentMessage(currentMessage) {
    this.setState({ currentMessage });
  }

  render() {
    return <ChatWindowComponent
      messages={this.props.messages}
      chatReport={this.props.chatReport}
      currentMessage={this.state.currentMessage}
      sentMessage={this.props.sentMessage}
      topBumperMessage={this.props.topBumperMessage}
      handleSendMessageClick={this.handleSendMessageClick.bind(this)}
      updateCurrentMessage={this.updateCurrentMessage.bind(this)}
    />;
  }
}

ChatContainer.propTypes = {
  sdk: PropTypes.object.isRequired,
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
  chatReport: PropTypes.object.isRequired,
  handleSendMessageClick: PropTypes.func.isRequired,
  topBumperMessage: PropTypes.string,
  sentMessage: PropTypes.object,
};
ChatContainer.defaultProps = {};
export default ChatContainer;
