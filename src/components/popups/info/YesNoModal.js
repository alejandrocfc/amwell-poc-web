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

// 'No' defaults to toggle if not provided
const YesNoModal = props => (
  <GenericModal
    className={props.className}
    showClose={props.showClose}
    isOpen={props.isOpen}
    message={props.message}
    header={props.header}
    toggle={props.toggle}>
    <button onClick={props.noClickHandler || props.toggle}>{props.messages.no2}</button>
    <button onClick={props.yesClickHandler}>{props.messages.yes2}</button>
  </GenericModal>
);

YesNoModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  messages: PropTypes.any.isRequired,
  message: PropTypes.any.isRequired,
  header: PropTypes.any.isRequired,
  yesClickHandler: PropTypes.func.isRequired,
  noClickHandler: PropTypes.func,
  showClose: PropTypes.bool,
};
export default YesNoModal;
