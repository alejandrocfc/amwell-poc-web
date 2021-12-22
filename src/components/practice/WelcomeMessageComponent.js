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

const WelcomeMessageComponent = (props) => {
  props.logger.debug('WelcomeMessageComponent: props', props);

  let welcomeMessage = null;
  if (props.welcomeMessage.length > 170) {
    if (props.welcomeMessageShowAll) {
      welcomeMessage = <span>{props.welcomeMessage}<button className="link-like" onClick={e => props.toggleWelcomeMessage(e)}> {props.messages.provider_welcome_text_less}</button></span>;
    } else {
      welcomeMessage = <span>{props.welcomeMessage.substring(0, 170)}<button className="link-like" onClick={e => props.toggleWelcomeMessage(e)}>...{props.messages.provider_welcome_text_more}</button></span>;
    }
  }

  return (
    <span>
      {welcomeMessage || props.welcomeMessage}
    </span>
  );
};

WelcomeMessageComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  toggleWelcomeMessage: PropTypes.func.isRequired,
  welcomeMessage: PropTypes.string.isRequired,
  welcomeMessageShowAll: PropTypes.bool.isRequired,
};
WelcomeMessageComponent.defaultProps = {};
export default WelcomeMessageComponent;
