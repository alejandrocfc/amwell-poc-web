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

import './TytoDeviceGenericStep.css';

const TytoDeviceGenericStep = (props) => {
    return (
        <div className="tytoDeviceGenericStepBody">
            <p>{props.bodyTextFirstPart}<br />{props.bodyTextSecondPart}</p>
            <div className={classNames('genericStepBodyIcon', props.icon)}/>
            <div className="tytoActionButtons">
                <button onClick={props.onMainModalActionBtnPress}>{props.mainActionBtnText}</button>
                {props.hasSecondActionBtn && (
                    <button onClick={props.onSecondModalActionBtnPress}>{props.secondActionBtnText}</button>
                )}
            </div>
        </div >
    );
};

TytoDeviceGenericStep.propTypes = {
    messages: PropTypes.any.isRequired,
    direction: PropTypes.any.isRequired,
    bodyTextFirstPart: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    mainActionBtnText: PropTypes.string.isRequired,
    hasSecondActionBtn: PropTypes.bool.isRequired,
};
TytoDeviceGenericStep.defaultProps = {};
export default TytoDeviceGenericStep;
