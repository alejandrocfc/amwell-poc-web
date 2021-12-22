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
import { Modal, Button } from 'reactstrap';

import './DeleteModalComponent.css';

const DeleteModalComponent = (props) => {
  const header = props.messageToDelete ? props.messages.secure_message_delete_modal_header_message : props.messages.secure_message_delete_modal_header_draft;
  const body = props.messageToDelete ? props.messages.secure_message_delete_modal_body_message : props.messages.secure_message_delete_modal_body_draft;
  const handler = props.messageToDelete ? () => props.deleteMessageClickHandler(props.messageToDelete) : props.deleteMessageDraftClickHandler;

  return (
    <Modal className="deleteModal" isOpen={props.isOpen} toggle={props.toggle} dir={props.direction}>
      <div className="deleteModalHeader">{header}</div>
      <div className="deleteModalBody">{body}</div>
      <div className="deleteModalButtons">
        <Button onClick={props.toggle}>{props.messages.cancel}</Button>
        <Button onClick={handler}>{props.messages.ok}</Button>
      </div>
    </Modal>
  );
};


DeleteModalComponent.propTypes = {
  toggle: PropTypes.any.isRequired,
  isOpen: PropTypes.bool.isRequired,
  messages: PropTypes.any.isRequired,
  deleteMessageClickHandler: PropTypes.func.isRequired,
  deleteMessageDraftClickHandler: PropTypes.func.isRequired,
  messageToDelete: PropTypes.object,
};
DeleteModalComponent.defaultProps = {};
export default DeleteModalComponent;
