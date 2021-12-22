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
import classNames from 'classnames';

class HeaderNotificationComponent extends React.Component {
  constructor(props) {
    super(props);
    this.wrapperRef = null;
    this.setWrapperRef = this.setWrapperRef.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  notificationHandler(path) {
    this.props.disableNotificationsBox();
    return this.props.history.push(path);
  }

  setWrapperRef(node) {
    this.wrapperRef = node;
  }

  handleClick() {
    this.props.enableNotificationsBox();
    if (this.wrapperRef) {
      this.wrapperRef.focus();
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.location.pathname !== prevProps.location.pathname) {
      this.props.disableNotificationsBox();
    }
  }

  render() {
    const hasNotification = !!(this.props.hasDependentRequest || this.props.hasAppointmentReminder || this.props.hasSecureMessage);
    const bellClass = classNames({
      notificationBell: true,
      pointerCursor: !this.props.isHeaderMenuDisabled,
      bellNoBlot: !hasNotification,
      bellWithBlot: hasNotification,
    });
    const notificationBellDiv = (this.props.isHeaderMenuDisabled) ? <div className={bellClass} /> : <div className={bellClass} onClick={this.handleClick} />;
    return (
      <div ref={this.setWrapperRef} onBlur={this.props.disableNotificationsBox} className='notificationWrapperDiv'>
        {this.props.displayNotifications &&
        <div className='notificationBox'>
          <div className='headerBox'>
            <div onClick={this.props.disableNotificationsBox} className='notificationClose'>&times;</div>
            <div className='notificationBoxTitle'><span>{this.props.messages.notifications_title}</span></div>
          </div>
          {!hasNotification ?
            <div className='emptyNotificationBox'><span>{this.props.messages.notifications_none}</span></div> :
            (<div className='notificationItems'>
              {this.props.hasDependentRequest &&
                <HeaderNotificationItem
                  title={this.props.messages.notifications_child_access_request_title}
                  body={this.props.messages.notifications_child_access_request_text}
                  linkText={this.props.messages.notifications_child_access_request_link_text}
                  handler={this.notificationHandler.bind(this)}
                  pathName='/myprofile/dependents' />
              }
              {this.props.hasAppointmentReminder &&
                <HeaderNotificationItem
                  title={this.props.messages.notifications_appointment_title}
                  body={this.props.messages.notifications_appointment_text}
                  linkText={this.props.messages.notifications_appointment_link_text}
                  handler={this.notificationHandler.bind(this)}
                  pathName='/appointments' />
              }
              {this.props.hasSecureMessage &&
                <HeaderNotificationItem title={this.props.messages.notifications_secure_message_title}
                  body={this.props.messages.notifications_secure_message_text}
                  linkText={this.props.messages.notifications_secure_message_link_text}
                  handler={this.notificationHandler.bind(this)}
                  pathName='/myMessages/inbox'
                />
              }
            </div>)}
        </div>}
        {this.props.displayNotifications &&
        <div className='notificationChevron' />}
        {notificationBellDiv}
      </div>
    );
  }
}
export default HeaderNotificationComponent;

const HeaderNotificationItem = ({ title, body, linkText, handler, pathName }) => (
  <div className='headerNotificationItem'>
    <span className='title'>{title}</span>
    <span className='body'>{body}</span>
    <span onClick={() => handler(pathName)} className='linkText'>{linkText}</span>
  </div>
);
