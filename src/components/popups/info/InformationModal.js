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

import GenericModal from './GenericModal';

// defaults to 'OK' button that toggles modal if nothing explicitly set
const InformationModal = props => (
  <GenericModal className={`InformationModal ${props.className || ''}`} {...props}>
    <button onClick={props.clickHandler || props.toggle}>{props.buttonText || props.messages.ok}</button>
  </GenericModal>
);

InformationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  message: PropTypes.any.isRequired,
  header: PropTypes.string.isRequired,
  messages: PropTypes.any.isRequired,
  toggle: PropTypes.func.isRequired,
  clickHandler: PropTypes.func,
  buttonText: PropTypes.string,
  direction: PropTypes.string,
  showClose: PropTypes.bool,
  htmlContent: PropTypes.bool,
};
export default InformationModal;
