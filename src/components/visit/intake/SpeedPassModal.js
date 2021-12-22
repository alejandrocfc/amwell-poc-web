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
import { Button } from 'reactstrap';
import { FormattedMessage } from 'react-intl';
import GenericModal from '../../popups/info/GenericModal';


const SpeedPassModal = (props) => {
  const firstName = props.activeConsumer ? props.activeConsumer.firstName : props.consumer.firstName;
  const isActiveConsumerSpeedPass = (props.speedPass && props.visitContext) ? (props.speedPass.consumer.id.persistentId === props.visitContext.consumer.id.persistentId) : false;

  let speedPassFirstName = '';
  let speedPassBody = props.messages.speedpass_body;
  let speedPassNoThanksText = props.messages.speedpass_no_thanks;
  let speedPassContinueText = props.messages.speedpass_copy_information;
  let speedPassBodyClass = 'speedPassBody';
  let speedPassOKClass = 'speedPassOK';

  if (props.speedPass && !isActiveConsumerSpeedPass) {
    speedPassFirstName = props.speedPass.consumer.firstName;
    speedPassBody = props.messages.speedpass_dependent_body;
    speedPassNoThanksText = props.messages.speedpass_dependent_no_thanks;
    speedPassContinueText = props.messages.yes2;
    speedPassBodyClass = 'speedPassDependentBody';
    speedPassOKClass = 'speedPassDependentOK';
  }

  return (
    <GenericModal className="speedPassModal" isOpen={props.speedPassModalActive} dir={props.direction}
      header={<FormattedMessage id="speedpass_welcome" values={{ firstName }}/>}
      message={<div className={speedPassBodyClass}>
        <FormattedMessage id="speedPassBody" defaultMessage={ speedPassBody } values={{ speedPassFirstName }}/>
      </div>}>
      <div className="speedPassFooter">
        <Button className={speedPassOKClass} onClick={props.continueSpeedPass}>{speedPassContinueText}</Button>
        <br />
        <a href="#cancel" onClick={props.cancelSpeedPass}>{speedPassNoThanksText}</a>
      </div>
    </GenericModal>
  );
};

SpeedPassModal.propTypes = {
  messages: PropTypes.any.isRequired,
  speedPassModalActive: PropTypes.bool.isRequired,
  direction: PropTypes.any.isRequired,
  continueSpeedPass: PropTypes.func.isRequired,
  cancelSpeedPass: PropTypes.func.isRequired,
  activeConsumer: PropTypes.object.isRequired,
  speedPass: PropTypes.object,
};
SpeedPassModal.defaultProps = {};
export default SpeedPassModal;
