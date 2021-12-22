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

import './MessageAction.css';

const MessageAction = (props) => {
  const actionClass = classNames({
    messageAction: true,
    disabled: props.disabled,
  });

  return (
    <div className={actionClass} onClick={!props.disabled && props.clickHandler}>
      <img alt={props.title} src={props.icon}/>
      <div>{props.title}</div>
    </div>
  );
};

MessageAction.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.any.isRequired,
  clickHandler: PropTypes.func,
  disabled: PropTypes.any,
};
MessageAction.defaultProps = {};
export default MessageAction;
