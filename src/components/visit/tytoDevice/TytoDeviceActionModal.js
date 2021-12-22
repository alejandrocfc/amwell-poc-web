/*!
 * American Well Consumer Web SDK Sample App
 *
 * Copyright © 2020 American Well.
 * All rights reserved.
 *
 * It is illegal to use, reproduce or distribute
 * any part of this Intellectual Property without
 * prior written authorization from American Well.
 */

import React from 'react';
import PropTypes from 'prop-types';

import './TytoDeviceActionModal.css';
import GenericModal from '../../popups/info/GenericModal';

const TytoDeviceModal = (props) => {
    const modalBodyClassName = `tytoDeviceModalBody " + ${props.modalBodyClassName}`;
    return (
        <GenericModal className="tytoDeviceActionModal" isOpen={props.isOpen} toggle={props.toggle} dir={props.direction} keyboard={false} backdrop='static'
            header={props.modalHeaderText}
            message={<div className={modalBodyClassName}  >
                <p>{props.modalBodyText}&nbsp;
                    {props.showSupportLink && (
                        <a href="https://support.tytocare.com/" className="link-like" target="_blank" rel="noopener noreferrer">
                            {props.messages.amwell_tyto_device_support_link}
                        </a>
                    )}
                </p>
            </div>}>
            <button onClick={props.onMainModalActionBtnPress}>{props.mainActionBtnText}</button>
            {props.showSkipStepActionBtn && (
                <button className="link-like" onClick={props.onSkipSetupActionBtnPress}>{props.messages.amwell_tyto_device_skip_setup}</button>
            )}
        </GenericModal>
    );
};

TytoDeviceModal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    toggle: PropTypes.func.isRequired,
    messages: PropTypes.any.isRequired,
    direction: PropTypes.any.isRequired,
    modalHeaderText: PropTypes.string.isRequired,
    modalBodyClassName: PropTypes.string.isRequired,
    modalBodyText: PropTypes.string.isRequired,
    mainActionBtnText: PropTypes.string.isRequired,
    onMainModalActionBtnPress: PropTypes.func.isRequired,
    showSkipStepActionBtn: PropTypes.bool.isRequired,
    showSupportLink: PropTypes.bool.isRequired
};
TytoDeviceModal.defaultProps = {};
export default TytoDeviceModal;
