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
import { Modal, ModalBody, ModalHeader } from 'reactstrap';
import { FormattedMessage } from 'react-intl';

import './CallRequestedComponent.css';


const CallRequestedComponent = (props) => {
  props.logger.debug('CallRequestedComponent: props', props);

  return (
    <Modal dir={props.direction} className={props.direction} isOpen={props.showCallRequested} toggle={props.toggleCallRequested}>
      <div className="callRequested">
        <ModalHeader className="header">
          {props.messages.past_providers_request_sent}
          <div className="close" onClick={props.toggleCallRequested}/>
        </ModalHeader>
        <ModalBody>
          <div className="description">
            <FormattedMessage id="callRequestedDescription" defaultMessage={ props.messages.past_providers_call_requested_description } values={{ phoneNumber: props.activeConsumer.phone }} />
          </div>
        </ModalBody>
      </div>
    </Modal>
  );
};

CallRequestedComponent.propTypes = {
  messages: PropTypes.any.isRequired,
  logger: PropTypes.object.isRequired,
};
CallRequestedComponent.defaultProps = {};
export default CallRequestedComponent;
