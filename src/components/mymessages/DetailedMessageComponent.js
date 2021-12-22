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
import { FormattedHTMLMessage } from 'react-intl';
import PropTypes from 'prop-types';

import './DetailedMessageComponent.css';
import MessageMetaInfoComponent from './MessageMetaInfoComponent';


const DetailedMessageComponent = (props) => {
  props.logger.debug('DetailedMessageComponent: props', props);
  const messageBody = props.detailedMessage.body.replace(/#msgHorizontalDivider/gi, '') || '<div />';
  return (
    <div className="detailedMessageComponent">
      <div className="detailedMessageTitle">
        <div className="detailedMessageFullName">{props.detailedMessage.sender.fullName}</div>
        <div>{props.detailedMessage.subject}</div>
      </div>
      <MessageMetaInfoComponent {...props}/>
      <hr className="metaBodyDivider"/>
      <div>
        <FormattedHTMLMessage
          id='secureMessageBody'
          defaultMessage={messageBody}
        />
      </div>
    </div>
  );
};

DetailedMessageComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.any.isRequired,
  detailedMessage: PropTypes.object.isRequired,
};
DetailedMessageComponent.defaultProps = {};
export default DetailedMessageComponent;
