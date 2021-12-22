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
import { Modal } from 'reactstrap';

import './GenericModal.css';

const GenericModal = props => (
  <Modal className={`genericModal ${props.className || ''}`} isOpen={props.isOpen} toggle={props.toggle} dir={props.direction} keyboard={props.keyboard} backdrop={props.backdrop}>
    {props.showClose && <div className="genericModalClose" onClick={props.toggle} />}
    <div className="genericModalHeader">
      {props.header}
    </div>
    {props.htmlContent
      ? <div className="genericModalMessage" dangerouslySetInnerHTML={{__html: props.message}}></div>
      : <div className="genericModalMessage">{props.message}</div>
    }
    <div className="genericModalButtons">
      {props.children}
    </div>
  </Modal>
);

GenericModal.defaultProps = {
  keyboard: true
};

GenericModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.any.isRequired,
  header: PropTypes.any.isRequired,
  children: PropTypes.any.isRequired,
  toggle: PropTypes.func,
  direction: PropTypes.string,
  showClose: PropTypes.bool,
  backdrop: PropTypes.string,
  keyboard: PropTypes.bool,
  htmlContent: PropTypes.bool,
};

export default GenericModal;
