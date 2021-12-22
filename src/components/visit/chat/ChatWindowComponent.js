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
import classNames from 'classnames';

import './ChatWindowComponent.css';
import TranscriptComponent from './TranscriptComponent';

class ChatWindowComponent extends React.Component {
  constructor(props) {
    super(props);
    this.bottomRef = null;
    this.state = {
      isCollapsed: false,
    };
  }

  scrollToBottom() {
    this.bottomRef.scrollIntoView({ behavior: 'smooth' });
  }

  componentDidMount() {
    this.scrollToBottom();
  }

  componentDidUpdate(prevProps) {
    if ((this.props.chatReport.lastOrdinal > prevProps.chatReport.lastOrdinal || this.props.sentMessage) && !this.state.isCollapsed) {
      this.scrollToBottom();
    }
  }

  toggleIsCollapsed(e) {
    e.preventDefault();
    this.setState(prevState => ({
      isCollapsed: !prevState.isCollapsed,
    }));
  }

  render() {
    return (
      <div className={classNames('chatContainer', { collapsed: this.state.isCollapsed })}>
        <div className={classNames('chatWindow', { collapsed: this.state.isCollapsed })}>
          <div className="chatWindowHeading">
            {this.props.messages.chat_window_title}
            <button onClick={e => this.toggleIsCollapsed(e)}/>
          </div>
          <div className="transcriptWindow">
            {this.props.topBumperMessage && <div className="topBumperMessage">{this.props.topBumperMessage}</div>}
            <TranscriptComponent chatItems={this.props.chatReport.chatItems} sentMessage={this.props.sentMessage}/>
            <div ref={(element) => { this.bottomRef = element; }}/>
          </div>
          <form className="chatWindowInput">
            <input type="text" placeholder={this.props.messages.chat_input_placeholder_text} value={this.props.currentMessage} onChange={e => this.props.updateCurrentMessage(e.target.value)}/>
            <button type="submit" onClick={e => this.props.handleSendMessageClick(e)}/>
          </form>
        </div>
      </div>
    );
  }
}
ChatWindowComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  chatReport: PropTypes.object.isRequired,
  currentMessage: PropTypes.string.isRequired,
  updateCurrentMessage: PropTypes.func.isRequired,
  handleSendMessageClick: PropTypes.func.isRequired,
  topBumperMessage: PropTypes.string,
  sentMessage: PropTypes.object,
};
ChatWindowComponent.defaultProps = {};

export default ChatWindowComponent;
