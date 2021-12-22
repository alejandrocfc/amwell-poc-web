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

import GenericModal from '../popups/info/GenericModal';
import { isValidPhoneNumber } from '../Util';

import './ChangePhoneNumberModal.css';


const ChangePhoneNumberModal = props => (
  <GenericModal

    className={classNames({
      changePhoneNumberModal: true,
      invalidPhone: props.errorMessage || (props.phoneNumber && !isValidPhoneNumber(props.phoneNumber)) })}

    isOpen={props.isOpen}
    message={
      <div>
        <input
          value={props.phoneNumber}
          onChange={e => props.setPhoneNumber(e.target.value) }
          placeholder={props.messages.visit_intake_enter_phone_number}
          type="text"/>
        {props.errorMessage &&
        <div className="changePhoneNumberModalError">
          {props.errorMessage}
        </div>}
      </div>
    }
    header={props.messages.appointments_change_number}
    toggle={props.toggle}>
    <button onClick={props.saveClickHandler}>{props.messages.save}</button>
  </GenericModal>
);

ChangePhoneNumberModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  messages: PropTypes.any.isRequired,
  toggle: PropTypes.func.isRequired,
  saveClickHandler: PropTypes.func.isRequired,
  setPhoneNumber: PropTypes.func.isRequired,
  phoneNumber: PropTypes.string,
  errorMessage: PropTypes.string,
};
export default ChangePhoneNumberModal;
